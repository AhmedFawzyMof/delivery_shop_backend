import tryCatch from "./trycatch";
import { DriverLoginRecordModel } from "../models/driver_login_record.model";
import { cleanupFile } from "./cleanupFile";
import fs from "fs";
import path from "path";
import sharp from "sharp";

export const handleLoginRecord = async (
  driverId: number,
  selfieTempPath: string,
  shiftDuration: number
): Promise<{ error?: any }> => {
  try {
    const targetDir = path.join(
      "public",
      "images",
      "drivers",
      String(driverId),
      "selfies"
    );

    fs.mkdirSync(targetDir, { recursive: true });

    const webpFilename = `selfie-${Date.now()}.webp`;
    const finalPath = path.join(targetDir, webpFilename);

    await sharp(selfieTempPath).webp({ quality: 80 }).toFile(finalPath);

    cleanupFile(selfieTempPath);

    const publicPath = finalPath.replace("public/", "");

    console.log(shiftDuration);
    const loginRecordData = {
      driver_image: publicPath,
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

    if (existingRecord && existingRecord.driver_image) {
      console.log(
        "Updating login record for driver",
        existingRecord.driver_image
      );

      const oldPath = path.join("public", existingRecord.driver_image);
      cleanupFile(oldPath);

      const { error } = await tryCatch(
        DriverLoginRecordModel.update(
          existingRecord.login_record_id!,
          loginRecordData
        )
      );
      return { error };
    }

    const { error } = await tryCatch(
      DriverLoginRecordModel.create({
        driver_id: driverId,
        ...loginRecordData,
      })
    );

    return { error };
  } catch (err: any) {
    cleanupFile(selfieTempPath);
    return { error: err };
  }
};
