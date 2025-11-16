import { db } from "../config/db";
import { roles } from "../config/db/schema";
import { eq } from "drizzle-orm";

export class RolesModel {
  static async getAll() {
    return await db.select().from(roles);
  }

  static async getById(id: number) {
    return await db.select().from(roles).where(eq(roles.role_id, id));
  }

  static async create(data: typeof roles.$inferInsert) {
    return await db.insert(roles).values(data).returning();
  }

  static async update(id: number, data: Partial<typeof roles.$inferInsert>) {
    return await db
      .update(roles)
      .set(data)
      .where(eq(roles.role_id, id))
      .returning();
  }

  static async delete(id: number) {
    return await db.delete(roles).where(eq(roles.role_id, id)).returning();
  }
}
