import { db } from "../config/db";
import { orderQueues } from "../config/db/schema";
import { eq } from "drizzle-orm";

export class OrderQueuesModel {
  static async getAll() {
    return await db.select().from(orderQueues);
  }

  static async getById(queueId: number) {
    return await db
      .select()
      .from(orderQueues)
      .where(eq(orderQueues.queueId, queueId));
  }

  static async getFirstPending() {
    return await db
      .select()
      .from(orderQueues)
      .where(eq(orderQueues.status, "pending"))
      .limit(1);
  }

  static async create(data: typeof orderQueues.$inferInsert) {
    return await db.insert(orderQueues).values(data);
  }

  static async update(
    queueId: number,
    data: Partial<typeof orderQueues.$inferInsert>
  ) {
    return await db
      .update(orderQueues)
      .set(data)
      .where(eq(orderQueues.queueId, queueId))
      .returning();
  }

  static async delete(queueId: number) {
    return await db
      .delete(orderQueues)
      .where(eq(orderQueues.queueId, queueId))
      .returning();
  }
}
