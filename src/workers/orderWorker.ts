import { db } from "../config/db";
import { order, orderQueues, restaurant } from "../config/db/schema";
import { eq, and, isNull, not, sql, asc } from "drizzle-orm";
import tryCatch from "../utils/trycatch";
import searchForDrivers from "../utils/geoFunctions";
import { driverClients } from "..";

type RestaurantLocation = {
  lat: number;
  lng: number;
};

async function fetchNextJob() {
  const LOCK_TIMEOUT = 30000;

  await db
    .update(orderQueues)
    .set({
      status: "pending",
      locked_at: null,
    })
    .where(
      and(
        eq(orderQueues.status, "processing"),
        not(isNull(orderQueues.locked_at)),
        sql`${orderQueues.locked_at} < ${Date.now() - LOCK_TIMEOUT}`
      )
    );

  const job = await db
    .select()
    .from(orderQueues)
    .where(
      and(eq(orderQueues.status, "pending"), isNull(orderQueues.locked_at))
    )
    .orderBy(asc(orderQueues.created_at))
    .limit(1);

  if (job.length === 0) return null;

  await db
    .update(orderQueues)
    .set({
      status: "processing",
      locked_at: Date.now(),
    })
    .where(eq(orderQueues.queue_id, job[0].queue_id));

  return job[0];
}

async function handleOrder(job: any) {
  const payload = JSON.parse(job.payload);

  if (!payload || !payload.order_id || !payload.restaurant_id) {
    console.log("payload missing data");
    return;
  }

  const { data, error } = await tryCatch(
    db
      .select({
        order_id: order.order_id,
        order_status: order.order_status,
        order_total_price: order.order_total_price,
        order_delivery_cost: order.order_delivery_cost,
        order_city: order.order_city,
        user_phone: order.user_phone,
        created_at: order.created_at,
        ready_at: order.ready_at,
        picked_up_at: order.picked_up_at,
        delivered_at: order.delivered_at,
        restaurant: {
          restaurant_id: restaurant.restaurant_id,
          restaurant_name: restaurant.restaurant_name,
          restaurant_address: restaurant.address,
          location: restaurant.location,
        },
      })
      .from(order)
      .innerJoin(restaurant, eq(order.restaurant_id, restaurant.restaurant_id))
      .where(eq(order.order_id, payload.order_id))
      .get()
  );

  if (error) {
    console.error("❌ DB Error while fetching order:", error.message);
    return;
  }

  if (!data || !data.order_id) {
    console.error("❌ No order found for ID:", payload.order_id);
    return;
  }

  console.log("✔️ Order processed successfully:", data.order_id);

  return data;
}

export async function processLoop() {
  let emptyLoops = 0;

  while (true) {
    const job = await fetchNextJob();

    if (job) {
      try {
        emptyLoops = 0;
        const orderData = await handleOrder(job);

        if (!orderData) {
          console.error("❌ Job returned no orderData");
          throw new Error("Order data missing");
        }

        const rest = orderData.restaurant;
        try {
          let location: RestaurantLocation | null = rest.location as any;

          if (typeof location === "string") {
            try {
              const cleaned = (location as string)
                .replaceAll("\\", "")
                .replace(/^"|"$/g, "");
              location = JSON.parse(cleaned);
            } catch (err2) {
              console.error("❌ Invalid restaurant location JSON:", err2);
              throw new Error("Invalid restaurant location");
            }
          }

          if (!location) {
            console.error("❌ Restaurant has no valid location");
            throw new Error("Restaurant location missing");
          }

          if (!orderData.order_city) {
            throw new Error("Order city missing");
          }

          const drivers = await searchForDrivers(
            rest.restaurant_id,
            orderData.order_city,
            location.lat,
            location.lng,
            driverClients
          );

          if (drivers.length === 0) {
            console.error("❌ No drivers available.");
            throw new Error("No available drivers");
          }

          const ws = driverClients.get(drivers[0].driver_id!);
          if (ws && ws.readyState === ws.OPEN) {
            ws.send(
              JSON.stringify({
                type: "new_order_nearby",
                order: {
                  ...orderData,
                  restaurant: rest,
                },
              })
            );
          }

          console.log(
            `📢 Worker broadcasted order ${orderData.order_id} to ${drivers.length} drivers.`
          );
        } catch (err) {
          console.error("❌ Worker background search failed:", err);
          throw err;
        }

        await db
          .update(orderQueues)
          .set({ status: "done" })
          .where(eq(orderQueues.queue_id, job.queue_id));
      } catch (err) {
        console.error("❌ Job failed:", err);

        await db
          .update(orderQueues)
          .set({ status: "failed" })
          .where(eq(orderQueues.queue_id, job.queue_id));
      }
    } else {
      emptyLoops++;
    }

    const interval = emptyLoops > 10 ? 3000 : 1000;
    await new Promise((res) => setTimeout(res, interval));
  }
}

export async function startOrderWorker() {
  console.log("🚀 Order worker started...");
  await processLoop();
}
