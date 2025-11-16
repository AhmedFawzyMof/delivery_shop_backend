import { db } from "../config/db";
import { admin_branches } from "../config/db/schema";
import { eq } from "drizzle-orm";

export class AdminBranchesModel {
  static async getAll() {
    return await db.select().from(admin_branches);
  }

  static async getByAdminId(adminId: number) {
    return await db
      .select()
      .from(admin_branches)
      .where(eq(admin_branches.admin_id, adminId));
  }

  static async create(data: typeof admin_branches.$inferInsert) {
    return await db.insert(admin_branches).values(data).returning();
  }

  static async delete(id: number) {
    return await db
      .delete(admin_branches)
      .where(eq(admin_branches.admin_branch_id, id))
      .returning();
  }
}
