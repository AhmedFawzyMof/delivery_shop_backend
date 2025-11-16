import { db } from "../config/db";
import { driver_login_record } from "../config/db/schema";
import { InferInsertModel, eq } from "drizzle-orm";

export type NewDriverLoginRecord = InferInsertModel<typeof driver_login_record>;

export class DriverLoginRecordModel {
  static async create(record: NewDriverLoginRecord) {
    return db.insert(driver_login_record).values(record).returning().get();
  }

  static async findByDriverId(driverId: number) {
    return db
      .select()
      .from(driver_login_record)
      .where(eq(driver_login_record.driver_id, driverId))
      .get();
  }

  static async update(
    loginRecordId: number,
    record: Partial<NewDriverLoginRecord>
  ) {
    return db
      .update(driver_login_record)
      .set(record)
      .where(eq(driver_login_record.login_record_id, loginRecordId))
      .returning()
      .get();
  }
}
