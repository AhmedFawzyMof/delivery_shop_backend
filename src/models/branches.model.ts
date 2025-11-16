import { db } from "../config/db";
import { branches } from "../config/db/schema";
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
}
