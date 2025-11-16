import { Console } from "console";
import { db } from "../config/db/index.js";
import {
  cities,
  driver,
  order,
  restaurant,
  user,
} from "../config/db/schema.js";
import { eq, sql, and, desc, not } from "drizzle-orm";

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

  static async getLatest() {
    return db
      .select({
        order_id: order.order_id,
        order_status: order.order_status,
        order_total_price: order.order_total_price,
        order_delivery_cost: order.order_delivery_cost,
      })
      .from(order)
      .orderBy(desc(order.created_at))
      .limit(5);
  }

  static async getByFilters(
    status: string | undefined,
    city: string | undefined,
    search: string | undefined,
    branch_id: number,
    page: number
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
      .select({
        order_id: order.order_id,
        user_id: order.user_id,
        restaurant_id: order.restaurant_id,
        restaurant_name: restaurant.restaurant_name,
        restaurant_address: restaurant.address,
        restaurant_city: restaurant.restaurant_city,
        order_total_price: order.order_total_price,
        order_status: order.order_status,
        order_receipt: order.order_receipt,
        order_delivery_cost: order.order_delivery_cost,
        order_notes: order.order_notes,
        driver_id: order.driver_id,
        driver_full_name: driver.driver_full_name,
        driver_phone: driver.driver_phone,
        driver_type: driver.driver_type,
        plate_number: driver.plate_number,
        created_at: order.created_at,
        user_name: user.user_name,
        user_phone: user.user_phone,
        user_address: user.user_address,
      })
      .from(order)
      .innerJoin(user, eq(order.user_id, user.user_id))
      .leftJoin(driver, eq(order.driver_id, driver.driver_id))
      .leftJoin(restaurant, eq(order.restaurant_id, restaurant.restaurant_id))
      .leftJoin(cities, eq(restaurant.restaurant_city, cities.city_name))
      .where(and(...conditions))
      .orderBy(order.order_id)
      .limit(limit)
      .offset(offset);

    return {
      orderCount: orderCount?.order_count,
      orders: result,
    };
  }

  static async getAll(
    from_date: string,
    to_date: string,
    restaurant_id: number,
    page: number
  ) {
    const fromDateTime = from_date.includes(":")
      ? from_date
      : `${from_date} 00:00:00`;
    const toDateTime = to_date.includes(":") ? to_date : `${to_date} 23:59:59`;

    const offset = (page - 1) * 50;
    const limit = page * 50;

    return await db
      .select({
        order_id: order.order_id,
        user_id: order.user_id,
        restaurant_id: order.restaurant_id,
        order_total_price: order.order_total_price,
        order_status: order.order_status,
        order_receipt: order.order_receipt,
        order_delivery_cost: order.order_delivery_cost,
        order_notes: order.order_notes,
        driver_id: order.driver_id,
        created_at: order.created_at,
        user_name: user.user_name,
        user_phone: user.user_phone,
        user_address: user.user_address,
      })
      .from(order)
      .innerJoin(user, eq(order.user_id, user.user_id))
      .where(
        and(
          eq(order.restaurant_id, restaurant_id),
          and(
            sql`datetime(${order.created_at}) >= datetime(${fromDateTime})`,
            sql`datetime(${order.created_at}) <= datetime(${toDateTime})`
          )
        )
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
    page: number
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

    return await db
      .select({
        order_id: order.order_id,
        user_id: order.user_id,
        restaurant_id: order.restaurant_id,
        order_total_price: order.order_total_price,
        order_status: order.order_status,
        order_receipt: order.order_receipt,
        order_delivery_cost: order.order_delivery_cost,
        order_notes: order.order_notes,
        driver_id: order.driver_id,
        created_at: order.created_at,
        user_name: user.user_name,
        user_phone: user.user_phone,
        user_address: user.user_address,
        restaurant_name: restaurant.restaurant_name,
        restaurant_address: restaurant.address,
      })
      .from(order)
      .innerJoin(user, eq(order.user_id, user.user_id))
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
    restaurant_id: number
  ) {
    const fromDateTime = from_date.includes(":")
      ? from_date
      : `${from_date} 00:00:00`;
    const toDateTime = to_date.includes(":") ? to_date : `${to_date} 23:59:59`;

    const result = await db
      .select({
        sum_of_orders: sql<number>`COUNT(${order.order_id})`.as(
          "sum_of_orders"
        ),
        total_price: sql<number>`SUM(${order.order_total_price})`.as(
          "total_price"
        ),
        delivery_cost: sql<number>`SUM(${order.order_delivery_cost})`.as(
          "delivery_cost"
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
            sql`datetime(${order.created_at}) <= datetime(${toDateTime})`
          )
        )
      )
      .get();

    return result;
  }

  static async getAdminStats(
    from_date: string,
    to_date: string,
    city: string | undefined,
    branch_id: number
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

    const result = await db
      .select({
        sum_of_orders: sql<number>`COUNT(${order.order_id})`.as(
          "sum_of_orders"
        ),
        total_price: sql<number>`SUM(${order.order_total_price})`.as(
          "total_price"
        ),
        delivery_cost: sql<number>`SUM(${order.order_delivery_cost})`.as(
          "delivery_cost"
        ),
        sum_of_completed_orders: sql<number>`
        COUNT(CASE WHEN ${order.order_status} = 'delivered' THEN 1 END)
      `.as("sum_of_completed_orders"),
      })
      .from(order)
      .innerJoin(restaurant, eq(order.restaurant_id, restaurant.restaurant_id))
      .innerJoin(cities, eq(restaurant.restaurant_city, cities.city_name))
      .where(and(...conditions))
      .get();

    return result;
  }

  static async getById(id: number) {
    const result = await db
      .select({
        order_id: order.order_id,
        user_id: order.user_id,
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
        user_name: user.user_name,
        user_phone: user.user_phone,
        user_address: user.user_address,
      })
      .from(order)
      .innerJoin(user, eq(order.user_id, user.user_id))
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
        user_id: order.user_id,
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
        user_name: user.user_name,
        user_phone: user.user_phone,
        user_address: user.user_address,
      })
      .from(order)
      .innerJoin(user, eq(order.user_id, user.user_id))
      .innerJoin(restaurant, eq(order.restaurant_id, restaurant.restaurant_id))
      .where(eq(order.order_id, id))
      .get();
  }

  static async delete(id: number) {
    return db.delete(order).where(eq(order.order_id, id));
  }

  static async activeOrders(id: number) {
    return db
      .select({
        order_id: order.order_id,
        order_status: order.order_status,
        order_total_price: order.order_total_price,
        order_delivery_cost: order.order_delivery_cost,
        user: {
          user_name: user.user_name,
          user_phone: user.user_phone,
          user_address: user.user_address,
        },
        restaurant: {
          restaurant_id: restaurant.restaurant_id,
          restaurant_name: restaurant.restaurant_name,
          restaurant_address: restaurant.address,
          location: restaurant.location,
        },
      })
      .from(order)
      .innerJoin(user, eq(order.user_id, user.user_id))
      .innerJoin(restaurant, eq(order.restaurant_id, user.restaurant_id))
      .where(
        and(not(eq(order.order_status, "delivered")), eq(order.driver_id, id))
      );
  }

  static async getByDriverId(
    id: number,
    from_date: string,
    to_date: string,
    page: number
  ) {
    const fromDateTime = from_date.includes(":")
      ? from_date
      : `${from_date} 00:00:00`;
    const toDateTime = to_date.includes(":") ? to_date : `${to_date} 23:59:59`;

    const offset = (page - 1) * 50;
    const limit = page * 50;
    const earnings = await db
      .select({
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
            sql`datetime(${order.created_at}) <= datetime(${toDateTime})`
          )
        )
      )
      .get();
    const orders = await db
      .select({
        order_id: order.order_id,
        order_total_price: order.order_total_price,
        order_delivery_cost: order.order_delivery_cost,
        order_receipt: order.order_receipt,
        user_id: user.user_id,
        user_name: user.user_name,
        user_phone: user.user_phone,
        user_address: user.user_address,
        restaurant_id: restaurant.restaurant_id,
        restaurant_name: restaurant.restaurant_name,
        restaurant_address: restaurant.address,
      })
      .from(order)
      .innerJoin(user, eq(order.user_id, user.user_id))
      .innerJoin(restaurant, eq(order.restaurant_id, user.restaurant_id))
      .where(
        and(
          eq(order.driver_id, id),
          and(
            sql`datetime(${order.created_at}) >= datetime(${fromDateTime})`,
            sql`datetime(${order.created_at}) <= datetime(${toDateTime})`
          )
        )
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
