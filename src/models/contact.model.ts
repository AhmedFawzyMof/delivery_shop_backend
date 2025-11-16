import { db } from "../config/db";
import { contact } from "../config/db/schema";
import { eq } from "drizzle-orm";

export class ContactModel {
  static async getAll() {
    return await db.select().from(contact);
  }

  static async getById(contactId: number) {
    return await db
      .select()
      .from(contact)
      .where(eq(contact.contact_id, contactId));
  }

  static async create(data: typeof contact.$inferInsert) {
    return await db.insert(contact).values(data).returning();
  }

  static async delete(contactId: number) {
    return await db
      .delete(contact)
      .where(eq(contact.contact_id, contactId))
      .returning();
  }
}
