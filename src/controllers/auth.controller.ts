import tryCatch from "../utils/trycatch";
import { RestaurantModel } from "../models/restaurant.model";
import { DriverModel } from "../models/driver.model";
import { AdminModel } from "../models/admin.model";
import crypto from "crypto";
import { createSessionToken, verifySessionToken } from "../utils/token";
import { Request, Response } from "express";
import { saveSelfie } from "../utils/saveSelfie";
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
    RestaurantModel.getByNameAndPassword(restaurant_name, hashedPassword)
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
  const { id_number, password, shift, selfie } = req.body;

  if (!id_number || !password || !shift || !selfie) {
    console.error(req.body);
    return res.status(422).json({ message: "Missing required fields" });
  }

  const hashedPassword = hashPassword(password);

  const { data: found, error } = await tryCatch(
    DriverModel.getByIdAndPassword(id_number, hashedPassword)
  );

  if (error) return res.status(500).json({ message: error.message });
  if (found.length === 0)
    return res.status(401).json({ message: "Invalid ID or password" });

  const driverId = found[0].driver_id;

  const selfiePath = await saveSelfie({ id: driverId, base64: selfie });

  const shiftDuration = Number(shift);

  const { error: recordError } = await handleLoginRecord(
    driverId,
    selfiePath,
    shiftDuration
  );

  if (recordError) {
    cleanupFile(selfiePath);
    return res.status(500).json({ message: recordError.message });
  }

  const sessionToken = createSessionToken(
    {
      ...found[0],
      type: "driver",
      shiftDuration,
    },
    `${shiftDuration}h` as TokenDuration
  );

  res.json({
    driver: found[0],
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
    AdminModel.login(identifier, hashedPassword)
  );

  if (error) return res.status(500).json({ message: error.message });
  if (!data) return res.status(401).json({ message: "Invalid credentials" });

  const sessionToken = createSessionToken({ ...data }, "1d");

  res.json({
    user: data,
    sessionToken,
  });
};

export { restaurant_login, verify_session, driver_login, admin_login };
