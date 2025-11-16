import tryCatch from "./trycatch";
import { DriverLoginRecordModel } from "../models/driver_login_record.model";
import { cleanupFile } from "./cleanupFile";

export const handleLoginRecord = async (
  driverId: number,
  selfiePath: string,
  shiftDuration: number
): Promise<{ error?: any }> => {
  const loginRecordData = {
    driver_image: selfiePath,
    login_time: new Date().toISOString(),
    shift_start_time: new Date().toISOString(),
    shift_end_time: new Date(
      Date.now() + shiftDuration * 60 * 60 * 1000
    ).toISOString(),
  };

  const { data: existingRecord, error: findError } = await tryCatch(
    DriverLoginRecordModel.findByDriverId(driverId)
  );
  if (findError) return { error: findError };

  if (existingRecord) {
    console.log(
      "Updating login record for driver",
      existingRecord.driver_image
    );
    cleanupFile(existingRecord.driver_image);

    const { error } = await tryCatch(
      DriverLoginRecordModel.update(
        existingRecord.login_record_id!,
        loginRecordData
      )
    );
    return { error };
  } else {
    const { error } = await tryCatch(
      DriverLoginRecordModel.create({ driver_id: driverId, ...loginRecordData })
    );
    return { error };
  }
};
