import { db } from "../config/db";
import { branches, cities, order, restaurant } from "../config/db/schema";
import { eq } from "drizzle-orm";

export class BranchesModel {
  static async getAll() {
    return await db.select().from(branches);
  }

  static async getById(id: number) {
    return await db.select().from(branches).where(eq(branches.branch_id, id));
  }

  static async create(data: typeof branches.$inferInsert) {
    return await db.insert(branches).values(data).returning();
  }

  static async update(id: number, data: Partial<typeof branches.$inferInsert>) {
    return await db
      .update(branches)
      .set(data)
      .where(eq(branches.branch_id, id))
      .returning();
  }

  static async delete(id: number) {
    return await db
      .delete(branches)
      .where(eq(branches.branch_id, id))
      .returning();
  }

  static async getBracheByOrderId(order_id: number) {
    const result = await db
      .select({
        branch_id: branches.branch_id,
        restaurant_name: restaurant.restaurant_name,
      })
      .from(order)
      .leftJoin(restaurant, eq(restaurant.restaurant_id, order.restaurant_id))
      .leftJoin(cities, eq(cities.city_name, restaurant.restaurant_city))
      .leftJoin(branches, eq(branches.branch_id, cities.branch_id))
      .where(eq(order.order_id, order_id))
      .get();

    return result;
  }
}
