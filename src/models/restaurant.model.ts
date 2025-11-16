import { db } from "../config/db/index.js";
import { cities, restaurant } from "../config/db/schema.js";
import { eq, and, like, sql } from "drizzle-orm";

export class RestaurantModel {
  static async create(data: {
    restaurant_name: string;
    restaurant_city: string;
    logo_image?: string;
    address?: string;
    location?: string;
    commercial_register?: string;
    password?: string;
  }) {
    return db.insert(restaurant).values({
      ...data,
      created_at: new Date().toISOString(),
    });
  }

  static async getAll(
    search: string,
    city: string,
    page: number,
    branch_id: number
  ) {
    const limit = page * 50;
    const offset = (page - 1) * 50;
    const conditions: any[] = [];

    if (search && search.trim() !== "") {
      conditions.push(sql`${restaurant.restaurant_name} LIKE ${`%${search}%`}`);
    }

    if (city && city.trim() !== "") {
      conditions.push(sql`${restaurant.restaurant_city} = ${city}`);
    }

    const totalCount = await db
      .select({
        count: sql<number>`COUNT(${restaurant.restaurant_id})`,
      })
      .from(restaurant)
      .leftJoin(cities, eq(restaurant.restaurant_city, cities.city_name))
      .where(and(...conditions, eq(cities.branch_id, branch_id)))
      .get();

    const result = await db
      .select({
        restaurant_id: restaurant.restaurant_id,
        restaurant_name: restaurant.restaurant_name,
        restaurant_city: restaurant.restaurant_city,
        logo_image: restaurant.logo_image,
        address: restaurant.address,
        location: restaurant.location,
        commercial_register: restaurant.commercial_register,
        rate: restaurant.rate,
        is_baned: restaurant.is_baned,
        created_at: restaurant.created_at,
      })
      .from(restaurant)
      .leftJoin(cities, eq(restaurant.restaurant_city, cities.city_name))
      .where(and(...conditions, eq(cities.branch_id, branch_id)))
      .limit(limit)
      .offset(offset);

    return {
      totalCount: totalCount?.count ?? 0,
      result,
    };
  }

  static async getById(id: number) {
    const result = await db
      .select()
      .from(restaurant)
      .where(eq(restaurant.restaurant_id, id));
    return result[0] ?? null;
  }

  static async getByNameAndPassword(name: string, password: string) {
    return await db
      .select()
      .from(restaurant)
      .where(
        and(
          eq(restaurant.is_baned, false),
          and(
            eq(restaurant.restaurant_name, name),
            eq(restaurant.password, password)
          )
        )
      )
      .get();
  }

  static async update(
    id: number,
    data: Partial<typeof restaurant.$inferInsert>
  ) {
    return db
      .update(restaurant)
      .set(data)
      .where(eq(restaurant.restaurant_id, id));
  }

  static async delete(id: number) {
    return db.delete(restaurant).where(eq(restaurant.restaurant_id, id));
  }
}
