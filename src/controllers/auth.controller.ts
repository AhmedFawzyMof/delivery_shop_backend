import tryCatch from "../utils/trycatch";
import { RestaurantModel } from "../models/restaurant.model";
import { DriverModel } from "../models/driver.model";
import { AdminModel } from "../models/admin.model";
import crypto from "crypto";
import { createSessionToken, verifySessionToken } from "../utils/token";
import { Request, Response } from "express";
import { hashPassword } from "../utils/hashPassword";
import { cleanupFile } from "../utils/cleanupFile";
import { handleLoginRecord } from "../utils/handleLoginRecord";

type TokenDuration = "1d" | "2h" | "4h" | "8h" | "12h";

const restaurant_login = async (req: Request, res: Response) => {
  const { restaurant_name, password } = req.body;

  if (!restaurant_name || !password) {
    return res.status(422).json({ message: "Missing name or password" });
  }

  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  const { data, error } = await tryCatch(
    RestaurantModel.getByNameAndPassword(restaurant_name, hashedPassword),
  );

  if (error) return res.status(500).json({ message: error.message });
  if (!data)
    return res.status(401).json({ message: "Invalid name or password" });

  const sessionPayload = {
    id: data.restaurant_id,
    type: "restaurant",
    name: data.restaurant_name!,
    city: data.restaurant_city!,
    logo_image: data.logo_image!,
    address: data.address!,
    location: data.location!,
  };

  const sessionToken = createSessionToken(sessionPayload, "12h");

  res.json({
    user: sessionPayload,
    sessionToken,
  });
};

const driver_login = async (req: Request, res: Response) => {
  const { phone, password, shift, is_freelancer, device_id } = req.body;
  const selfieFile = req.file;

  if (!phone || !password || !selfieFile || !device_id) {
    console.error(req.body, req.file);
    return res.status(422).send("Missing required fields including device_id");
  }

  if (is_freelancer === "1" && !shift) {
    return res
      .status(422)
      .json("Shift duration is required for freelancer drivers");
  }

  const hashedPassword = hashPassword(password);

  const { data: driver, error } = await tryCatch(
    DriverModel.getByPhoneAndPassword(phone, hashedPassword),
  );

  if (error) return res.status(500).send(error.message);
  if (driver.length === 0)
    return res.status(401).send("Invalid ID or password");

  const driverRecord = driver[0];

  if (driverRecord.device_id) {
    if (driverRecord.device_id !== device_id) {
      return res.status(403).json({
        message: "This driver is already logged in on another device",
      });
    }
  } else {
    const { error: updateError } = await tryCatch(
      DriverModel.update(driverRecord.driver_id, { device_id: device_id }),
    );
    if (updateError) {
      return res.status(500).json({ message: updateError.message });
    }
  }

  const selfiePath = selfieFile.path;
  let shiftDuration: number;

  if (driverRecord.freelancer) {
    shiftDuration = Number(shift);
  } else {
    shiftDuration = driverRecord.shift_duration!;
    if (!shiftDuration) {
      console.log("Driver shift duration missing in database");
      cleanupFile(selfiePath);
      return res.status(500).send("Driver shift duration missing in database");
    }
  }

  const { error: recordError } = await handleLoginRecord(
    driverRecord.driver_id,
    selfiePath,
    shiftDuration,
  );

  if (recordError) {
    cleanupFile(selfiePath);
    console.log(recordError);
    return res.status(500).json({ message: recordError.message });
  }

  const sessionToken = createSessionToken(
    { ...driverRecord, type: "driver", shiftDuration },
    `${shiftDuration}h` as TokenDuration,
  );

  res.json({
    driver: driverRecord,
    sessionToken,
  });
};

const admin_login = async (req: Request, res: Response) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(422).json({ message: "Missing email/phone or password" });
  }

  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  const { data, error } = await tryCatch(
    AdminModel.login(identifier, hashedPassword),
  );

  if (error) return res.status(500).json({ message: error.message });
  if (!data) return res.status(401).json({ message: "Invalid credentials" });

  const sessionToken = createSessionToken({ ...data, type: "admin" }, "1d");

  res.status(200).json({
    user: data,
    sessionToken,
  });
};

const verify_session = async (req: Request, res: Response) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "Not authenticated" });

    const token = header.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Missing token" });

    const decoded = verifySessionToken(token);
    if (!decoded)
      return res.status(401).json({ message: "Invalid or expired session" });

    res.json({ user: decoded });
  } catch (e) {
    return res.status(500).json({ message: (e as Error).message });
  }
};

export { restaurant_login, verify_session, driver_login, admin_login };
