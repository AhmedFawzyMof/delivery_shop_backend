import { db } from "../config/db/index.js";
import {
  cities,
  driver,
  driver_login_record,
  order,
  restaurant,
} from "../config/db/schema.js";
import { and, eq, sql } from "drizzle-orm";

export class DriverModel {
  static async create(data: Partial<typeof driver.$inferInsert>) {
    return db
      .insert(driver)
      .values({
        ...data,
        created_at: new Date().toISOString(),
      })
      .returning();
  }

  static async getAll(
    page: number,
    status: any,
    city: any,
    search: any,
    branch_id: number
  ) {
    const limit = page * 25;
    const offset = (page - 1) * 25;

    const conditions: any[] = [];

    if (status) {
      conditions.push(eq(driver.driver_status, status));
    }

    if (search) {
      conditions.push(sql`${driver.driver_full_name} LIKE ${`%${search}%`}`);
    }

    if (city) {
      conditions.push(sql`${driver.driver_city} = ${city}`);
    }

    conditions.push(eq(cities.branch_id, branch_id));

    const totalCount = await db
      .select({
        count: sql<number>`COUNT(${driver.driver_id})`,
      })
      .from(driver)
      .innerJoin(cities, eq(driver.driver_city, cities.city_name))
      .leftJoin(restaurant, eq(driver.stationed_at, restaurant.restaurant_id))
      .where(and(...conditions))
      .groupBy(driver.driver_id)
      .get();

    const result = await db
      .select({
        driver_id: driver.driver_id,
        driver_full_name: driver.driver_full_name,
        driver_phone: driver.driver_phone,
        driver_city: driver.driver_city,
        driver_status: driver.driver_status,
        driver_created_at: driver.created_at,
        driver_type: driver.driver_type,
        is_baned: driver.is_baned,
        stationed_at: restaurant.restaurant_id,
        restaurant_name: restaurant.restaurant_name,
        id_number: driver.id_number,
        device_id: driver.device_id,
        plate_number: driver.plate_number,
        first_license_photo: driver.first_license_photo,
        second_license_photo: driver.second_license_photo,
        third_license_photo: driver.third_license_photo,
        fourth_license_photo: driver.fourth_license_photo,
        freelancer: driver.freelancer,
        shift_duration: driver.shift_duration,
        rate: driver.rate,
        login_record: {
          driver_image: driver_login_record.driver_image,
          login_time: driver_login_record.login_time,
          shift_start_time: driver_login_record.shift_start_time,
          shift_end_time: driver_login_record.shift_end_time,
        },
      })
      .from(driver)
      .leftJoin(
        driver_login_record,
        eq(driver.driver_id, driver_login_record.driver_id)
      )
      .innerJoin(cities, eq(driver.driver_city, cities.city_name))
      .leftJoin(restaurant, eq(driver.stationed_at, restaurant.restaurant_id))
      .where(and(...conditions))
      .groupBy(driver.driver_id)
      .limit(limit)
      .offset(offset)
      .all();

    return {
      totalCount: totalCount?.count,
      data: result,
    };
  }

  static async getByPhoneAndPassword(phone: string, password: string) {
    return db
      .select()
      .from(driver)
      .where(
        and(
          and(eq(driver.is_baned, false), eq(driver.driver_status, "approved")),
          and(eq(driver.driver_phone, phone), eq(driver.password, password))
        )
      );
  }

  static async getById(id: number) {
    const result = await db
      .select()
      .from(driver)
      .where(eq(driver.driver_id, id));
    return result[0] ?? null;
  }

  static async getStatus(id: number) {
    const today = new Date().toISOString().split("T")[0];
    const fromDateTime = today.includes(":") ? today : `${today} 00:00:00`;
    const toDateTime = today.includes(":") ? today : `${today} 23:59:59`;
    const result = await db
      .selectDistinct({
        todayEarnings: sql<number>`SUM(${order.order_delivery_cost})`.as(
          "todayEarnings"
        ),
        completedToday:
          sql<number>`COUNT(CASE WHEN ${order.order_status} = 'delivered' THEN 1 END)`.as(
            "completedToday"
          ),
      })
      .from(driver)
      .innerJoin(order, eq(driver.driver_id, order.driver_id))
      .where(
        and(
          eq(driver.driver_id, id),
          and(
            sql`datetime(${order.created_at}) >= datetime(${fromDateTime})`,
            sql`datetime(${order.created_at}) <= datetime(${toDateTime})`
          )
        )
      );
    return result[0] ?? null;
  }

  static async update(id: number, data: Partial<typeof driver.$inferInsert>) {
    return db.update(driver).set(data).where(eq(driver.driver_id, id));
  }

  static async delete(id: number) {
    return db.delete(driver).where(eq(driver.driver_id, id));
  }
}
