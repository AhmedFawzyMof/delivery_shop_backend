import { db } from "../config/db/index";
import { cities, driver, order, restaurant } from "../config/db/schema";
import { eq, sql, and, desc, not, inArray } from "drizzle-orm";

export class OrderModel {
  static async create(data: Partial<typeof order.$inferInsert>) {
    return db
      .insert(order)
      .values({
        ...data,
        created_at: new Date().toISOString(),
      })
      .returning();
  }

  static async getLatest(cities: string[]) {
    return db
      .select({
        order_id: order.order_id,
        order_status: order.order_status,
        order_total_price: order.order_total_price,
        order_delivery_cost: order.order_delivery_cost,
      })
      .from(order)
      .where(inArray(order.order_city, cities))
      .orderBy(desc(order.created_at))
      .limit(5);
  }

  static async getByFilters(
    status: string | undefined,
    city: string | undefined,
    search: string | undefined,
    branch_id: number,
    page: number,
  ) {
    const ITEMS_PER_PAGE = 50;
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const limit = ITEMS_PER_PAGE;

    const conditions: any[] = [];

    if (status) {
      conditions.push(eq(order.order_status, status));
    }

    if (search) {
      conditions.push(sql`${order.order_id} LIKE ${`%${search}%`}`);
    }

    if (city) {
      conditions.push(sql`${restaurant.restaurant_city} = ${city}`);
    }

    conditions.push(eq(cities.branch_id, branch_id));

    const orderCount = await db
      .select({
        order_count: sql<number>`COUNT(${order.order_id})`,
      })
      .from(order)
      .leftJoin(restaurant, eq(order.restaurant_id, restaurant.restaurant_id))
      .leftJoin(cities, eq(restaurant.restaurant_city, cities.city_name))
      .where(and(...conditions))
      .get();

    const result = await db
      .selectDistinct({
        restaurant_id: order.restaurant_id,
        restaurant_name: restaurant.restaurant_name,
        restaurant_address: restaurant.address,
        restaurant_city: restaurant.restaurant_city,
        order_total_price: order.order_total_price,
        order_status: order.order_status,
        order_receipt: order.order_receipt,
        order_city: order.order_city,
        order_id: order.order_id,
        order_delivery_cost: order.order_delivery_cost,
        order_notes: order.order_notes,
        payment_method: order.payment_method,
        user_phone: order.user_phone,
        driver_id: order.driver_id,
        driver_full_name: driver.driver_full_name,
        driver_phone: driver.driver_phone,
        driver_type: driver.driver_type,
        plate_number: driver.plate_number,
        created_at: order.created_at,
        ready_at: order.ready_at,
        picked_up_at: order.picked_up_at,
        delivered_at: order.delivered_at,
        cancelation_reason: order.cancelation_reason,
      })
      .from(order)
      .leftJoin(driver, eq(order.driver_id, driver.driver_id))
      .leftJoin(restaurant, eq(order.restaurant_id, restaurant.restaurant_id))
      .leftJoin(cities, eq(restaurant.restaurant_city, cities.city_name))
      .where(and(...conditions))
      .limit(limit)
      .offset(offset)
      .orderBy(
        sql`CASE WHEN ${order.order_status} = 'canceled' THEN 1 ELSE 0 END`,
        desc(order.created_at),
      );

    return {
      orderCount: orderCount?.order_count,
      orders: result,
    };
  }

  static async getAll(
    from_date: string,
    to_date: string,
    restaurant_id: number,
    page: number,
  ) {
    const fromDateTime = from_date.includes(":")
      ? from_date
      : `${from_date} 00:00:00`;
    const toDateTime = to_date.includes(":") ? to_date : `${to_date} 23:59:59`;

    const offset = (page - 1) * 50;
    const limit = page * 50;

    return await db
      .selectDistinct({
        order_id: order.order_id,
        restaurant_id: order.restaurant_id,
        order_total_price: order.order_total_price,
        order_status: order.order_status,
        order_receipt: order.order_receipt,
        order_delivery_cost: order.order_delivery_cost,
        order_notes: order.order_notes,
        payment_method: order.payment_method,
        driver_id: order.driver_id,
        created_at: order.created_at,
      })
      .from(order)
      .where(
        and(
          eq(order.restaurant_id, restaurant_id),
          and(
            sql`datetime(${order.created_at}) >= datetime(${fromDateTime})`,
            sql`datetime(${order.created_at}) <= datetime(${toDateTime})`,
          ),
        ),
      )
      .limit(limit)
      .offset(offset)
      .orderBy(desc(order.created_at));
  }

  static async getAllAdmin(
    from_date: string,
    to_date: string,
    city: string | undefined,
    branch_id: number,
    page: number,
    driver_id: number | undefined,
    restaurant_id: number | undefined,
  ) {
    const fromDateTime = from_date.includes(":")
      ? from_date
      : `${from_date} 00:00:00`;
    const toDateTime = to_date.includes(":") ? to_date : `${to_date} 23:59:59`;

    const offset = (page - 1) * 50;
    const limit = page * 50;

    const conditions: any[] = [
      sql`datetime(${order.created_at}) >= datetime(${fromDateTime})`,
      sql`datetime(${order.created_at}) <= datetime(${toDateTime})`,
      eq(cities.branch_id, branch_id),
    ];

    if (city) {
      conditions.push(eq(restaurant.restaurant_city, city));
    }

    if (driver_id) {
      conditions.push(eq(order.driver_id, driver_id));
    }

    if (restaurant_id) {
      conditions.push(eq(order.restaurant_id, restaurant_id));
    }

    return await db
      .select({
        order_id: order.order_id,
        restaurant_id: order.restaurant_id,
        order_total_price: order.order_total_price,
        order_status: order.order_status,
        order_receipt: order.order_receipt,
        order_delivery_cost: order.order_delivery_cost,
        order_notes: order.order_notes,
        payment_method: order.payment_method,
        ready_at: order.ready_at,
        picked_up_at: order.picked_up_at,
        delivered_at: order.delivered_at,
        user_phone: order.user_phone,
        driver_id: order.driver_id,
        created_at: order.created_at,
        restaurant_name: restaurant.restaurant_name,
        restaurant_address: restaurant.address,
      })
      .from(order)
      .innerJoin(restaurant, eq(order.restaurant_id, restaurant.restaurant_id))
      .innerJoin(cities, eq(restaurant.restaurant_city, cities.city_name))
      .where(and(...conditions))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(order.created_at));
  }

  static async getStats(
    from_date: string,
    to_date: string,
    restaurant_id: number,
  ) {
    const fromDateTime = from_date.includes(":")
      ? from_date
      : `${from_date} 00:00:00`;
    const toDateTime = to_date.includes(":") ? to_date : `${to_date} 23:59:59`;

    const result = await db
      .select({
        sum_of_orders: sql<number>`COUNT(${order.order_id})`.as(
          "sum_of_orders",
        ),
        total_price: sql<number>`SUM(${order.order_total_price})`.as(
          "total_price",
        ),
        delivery_cost: sql<number>`SUM(${order.order_delivery_cost})`.as(
          "delivery_cost",
        ),
        sum_of_completed_orders: sql<number>`
          COUNT(CASE WHEN ${order.order_status} = 'delivered' THEN 1 END)
        `.as("sum_of_completed_orders"),
      })
      .from(order)
      .where(
        and(
          eq(order.restaurant_id, restaurant_id),
          and(
            sql`datetime(${order.created_at}) >= datetime(${fromDateTime})`,
            sql`datetime(${order.created_at}) <= datetime(${toDateTime})`,
          ),
        ),
      )
      .get();

    return result;
  }

  static async getAdminStats(
    from_date: string,
    to_date: string,
    city: string | undefined,
    branch_id: number,
    driver_id: number | undefined,
    restaurant_id: number | undefined,
  ) {
    const fromDateTime = from_date.includes(":")
      ? from_date
      : `${from_date} 00:00:00`;
    const toDateTime = to_date.includes(":") ? to_date : `${to_date} 23:59:59`;

    const conditions: any[] = [
      sql`datetime(${order.created_at}) >= datetime(${fromDateTime})`,
      sql`datetime(${order.created_at}) <= datetime(${toDateTime})`,
      eq(cities.branch_id, branch_id),
    ];

    if (city) {
      conditions.push(eq(restaurant.restaurant_city, city));
    }

    if (driver_id) {
      conditions.push(eq(order.driver_id, driver_id));
    }

    if (restaurant_id) {
      conditions.push(eq(order.restaurant_id, restaurant_id));
    }

    const result = await db
      .select({
        sum_of_orders: sql<number>`COUNT(${order.order_id})`.as(
          "sum_of_orders",
        ),
        total_price: sql<number>`SUM(${order.order_total_price})`.as(
          "total_price",
        ),
        delivery_cost:
          sql<number>`SUM(CASE WHEN ${order.order_status} = 'delivered' THEN ${order.order_delivery_cost} ELSE 0 END)`.as(
            "delivery_cost",
          ),
        sum_of_completed_orders: sql<number>`
        COUNT(CASE WHEN ${order.order_status} = 'delivered' THEN 1 END)
      `.as("sum_of_completed_orders"),
        cancelled_orders:
          sql<number>`COUNT(CASE WHEN ${order.order_status} = 'canceled' THEN 1 END)`.as(
            "cancelled_orders",
          ),
        cancelled_cost:
          sql<number>`SUM(CASE WHEN ${order.order_status} = 'canceled' THEN ${order.order_delivery_cost} END)`.as(
            "cancelled_cost",
          ),
      })
      .from(order)
      .innerJoin(restaurant, eq(order.restaurant_id, restaurant.restaurant_id))
      .innerJoin(cities, eq(restaurant.restaurant_city, cities.city_name))
      .where(and(...conditions))
      .get();

    return result;
  }

  static async getByIds(ids: number[]) {
    const result = await db
      .select({
        order_id: order.order_id,
        restaurant_id: order.restaurant_id,
        restaurant_name: restaurant.restaurant_name,
        restaurant_address: restaurant.address,
        location: restaurant.location,
        order_total_price: order.order_total_price,
        order_status: order.order_status,
        order_receipt: order.order_receipt,
        order_delivery_cost: order.order_delivery_cost,
        order_notes: order.order_notes,
        driver_id: order.driver_id,
        created_at: order.created_at,
      })
      .from(order)
      .innerJoin(restaurant, eq(order.restaurant_id, restaurant.restaurant_id))
      .where(inArray(order.order_id, ids));

    return result ?? null;
  }

  static async getById(id: number) {
    const result = await db
      .select({
        order_id: order.order_id,
        restaurant_id: order.restaurant_id,
        restaurant_name: restaurant.restaurant_name,
        restaurant_address: restaurant.address,
        location: restaurant.location,
        order_total_price: order.order_total_price,
        order_status: order.order_status,
        order_receipt: order.order_receipt,
        order_delivery_cost: order.order_delivery_cost,
        order_notes: order.order_notes,
        driver_id: order.driver_id,
        created_at: order.created_at,
      })
      .from(order)
      .innerJoin(restaurant, eq(order.restaurant_id, restaurant.restaurant_id))
      .where(eq(order.order_id, id))
      .get();
    return result ?? null;
  }

  static async update(id: number, data: Partial<typeof order.$inferInsert>) {
    await db.update(order).set(data).where(eq(order.order_id, id));

    return db
      .select({
        order_id: order.order_id,
        restaurant_id: order.restaurant_id,
        restaurant_name: restaurant.restaurant_name,
        restaurant_address: restaurant.address,
        location: restaurant.location,
        order_total_price: order.order_total_price,
        order_status: order.order_status,
        order_receipt: order.order_receipt,
        order_delivery_cost: order.order_delivery_cost,
        order_notes: order.order_notes,
        user_phone: order.user_phone,
        driver_id: order.driver_id,
        ready_at: order.ready_at,
        picked_up_at: order.picked_up_at,
        delivered_at: order.delivered_at,
        created_at: order.created_at,
      })
      .from(order)
      .innerJoin(restaurant, eq(order.restaurant_id, restaurant.restaurant_id))
      .where(eq(order.order_id, id))
      .get();
  }

  static async delete(id: number) {
    return db.delete(order).where(eq(order.order_id, id));
  }

  static async activeOrders(id: number) {
    const sub = db
      .selectDistinct({ order_id: order.order_id })
      .from(order)
      .where(
        and(not(eq(order.order_status, "delivered")), eq(order.driver_id, id)),
      )
      .as("sub");

    return db
      .select({
        order_id: order.order_id,
        order_status: order.order_status,
        order_total_price: order.order_total_price,
        order_delivery_cost: order.order_delivery_cost,
        order_city: order.order_city,
        payment_method: order.order_city,
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
      .innerJoin(sub, eq(sub.order_id, order.order_id))
      .innerJoin(restaurant, eq(order.restaurant_id, restaurant.restaurant_id));
  }

  static async getByDriverId(
    id: number,
    from_date: string,
    to_date: string,
    page: number,
  ) {
    const fromDateTime = from_date.includes(":")
      ? from_date
      : `${from_date} 00:00:00`;
    const toDateTime = to_date.includes(":") ? to_date : `${to_date} 23:59:59`;

    const offset = (page - 1) * 50;
    const limit = page * 50;
    const earnings = await db
      .selectDistinct({
        delivery_cost: sql<number>`SUM(${order.order_delivery_cost})`,
        sum_of_orders_based_on_date: sql<number>`COUNT(${order.order_id})`,
        sum_of_orders: sql<number>`(SELECT COUNT(*) FROM \'order\' WHERE driver_id = ${id})`,
      })
      .from(order)
      .where(
        and(
          eq(order.driver_id, id),
          and(
            sql`datetime(${order.created_at}) >= datetime(${fromDateTime})`,
            sql`datetime(${order.created_at}) <= datetime(${toDateTime})`,
          ),
        ),
      )
      .get();

    const orders = await db
      .selectDistinct({
        order_id: order.order_id,
        order_total_price: order.order_total_price,
        order_delivery_cost: order.order_delivery_cost,
        order_receipt: order.order_receipt,
        restaurant_id: restaurant.restaurant_id,
        restaurant_name: restaurant.restaurant_name,
        restaurant_address: restaurant.address,
      })
      .from(order)
      .innerJoin(restaurant, eq(order.restaurant_id, restaurant.restaurant_id))
      .where(
        and(
          eq(order.driver_id, id),
          and(
            sql`datetime(${order.created_at}) >= datetime(${fromDateTime})`,
            sql`datetime(${order.created_at}) <= datetime(${toDateTime})`,
          ),
        ),
      )
      .limit(limit)
      .offset(offset)
      .orderBy(desc(order.created_at));

    return {
      orders,
      earnings,
    };
  }
}
