import { db } from "../config/db/index.js";
import { user } from "../config/db/schema.js";
import { and, eq, like, or } from "drizzle-orm";

export class UserModel {
  static async create(data: Partial<typeof user.$inferInsert>) {
    if (!data.user_phone) {
      throw new Error("User phone number is required for existence check.");
    }
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.user_phone, data.user_phone?.toString()));

    if (existingUser.length > 0) {
      return existingUser;
    }
    return db.insert(user).values(data).returning();
  }

  static async getAll(search: string, page: number, restaurant_id: number) {
    const limit = page * 50;
    const offset = (page - 1) * 50;

    if (search && search.trim() !== "") {
      return db
        .select()
        .from(user)
        .where(
          and(
            eq(user.restaurant_id, restaurant_id),
            or(
              like(user.user_name, `%${search}%`),
              like(user.user_phone, `%${search}%`)
            )
          )
        )
        .limit(limit)
        .offset(offset);
    }

    return db
      .select()
      .from(user)
      .where(eq(user.restaurant_id, restaurant_id))
      .limit(limit)
      .offset(offset);
  }

  static async getById(id: number) {
    const result = await db.select().from(user).where(eq(user.user_id, id));
    return result[0] ?? null;
  }

  static async update(id: number, data: Partial<typeof user.$inferInsert>) {
    return db.update(user).set(data).where(eq(user.user_id, id));
  }

  static async delete(id: number) {
    return db.delete(user).where(eq(user.user_id, id));
  }
}
