import { DriverModel } from "../models/driver.model.js";
import { Request, Response } from "express";
import fs from "fs";
import { convertToWebp } from "../utils/imageconverter.js";
import tryCatch from "../utils/trycatch.js";
import path from "path";
import { OrderModel } from "../models/order.model.js";
import { broadcastToRestaurant, driverClients } from "../index.js";
import { CitiesModel } from "../models/cities.model.js";
import crypto from "crypto";
import sharp from "sharp";

const getAllDrivers = async (req: Request, res: Response) => {
  const adminUser = (req as any).user.data;

  const { city, active, search, search_city, status, page } = req.query;

  let cities: { city_name: string | null }[] = [];

  if (adminUser) {
    cities = await CitiesModel.getCityByBranchId(adminUser.branches.branch_id);
  }

  if (active === "true" && city !== "") {
    if (city) {
      const drivers = Array.from(driverClients.values())
        .filter((ws) => {
          return ws.driver_status === "READY" && ws.driver_city === city;
        })
        .map((ws) => ({
          driver_id: ws.driver_id,
          driver_name: ws.driver_name,
          driver_city: ws.driver_city,
          driver_type: ws.driver_type,
          driver_status: ws.driver_status,
        }));

      return res.json({ drivers: drivers });
    }
  }

  const { data, error } = await tryCatch(
    DriverModel.getAll(
      Number(page),
      status,
      search_city,
      search,
      adminUser.branches.branch_id
    )
  );

  if (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }

  const drivers_ids = data?.data.map((driver: any) => driver.driver_id);

  const activeDrivers = Array.from(driverClients.values())
    .filter((ws) => {
      return ws.driver_id && drivers_ids?.includes(ws.driver_id);
    })
    .map((ws) => ({
      driver_id: ws.driver_id,
    }));

  res.json({
    drivers: data?.data,
    totalCount: data?.totalCount,
    cities,
    activeDrivers,
  });
};

const getDriverById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { history } = req.query;
  const page = req.query.page ? Number(req.query.page) : 1;

  const from_date = req.query.from
    ? new Date(req.query.from as string).toISOString().split("T")[0]
    : undefined;
  const to_date = req.query.to
    ? new Date(req.query.to as string).toISOString().split("T")[0]
    : undefined;

  if (history !== "true") {
    const { data: status, error: statusError } = await tryCatch(
      DriverModel.getStatus(id)
    );

    if (statusError) {
      console.error(statusError);
      return res.status(500).json({ message: statusError.message });
    }

    const { data: orders, error: ordersError } = await tryCatch(
      OrderModel.activeOrders(id)
    );

    if (ordersError) {
      console.error(ordersError);
      return res.status(500).json({ message: ordersError.message });
    }

    return res.status(200).json({ status: status, orders: orders });
  }

  const { data, error: ordersError } = await tryCatch(
    OrderModel.getByDriverId(id, from_date!, to_date!, page)
  );

  if (ordersError) {
    console.error(ordersError);
    return res.status(500).json({ message: ordersError.message });
  }

  res.status(200).json({ orders: data.orders, earnings: data.earnings });
};

const addDriver = async (req: Request, res: Response) => {
  const allowedTextFields = [
    "driver_full_name",
    "rate",
    "driver_status",
    "driver_type",
    "driver_phone",
    "driver_city",
    "id_number",
    "plate_number",
    "stationed_at",
    "password",
    "is_baned",
  ];

  const textUpdates: Record<string, any> = {};

  for (const field of allowedTextFields) {
    if (field in req.body) {
      if (field === "password") {
        const hashedPassword = crypto
          .createHash("sha256")
          .update(req.body[field])
          .digest("hex");
        Object.assign(textUpdates, { password: hashedPassword });
      } else {
        textUpdates[field] = req.body[field];
      }
    }
  }

  const allowedFiles = [
    "first_license_photo",
    "second_license_photo",
    "third_license_photo",
    "fourth_license_photo",
  ];

  const uploadedFiles = (req.files || {}) as {
    [key: string]: Express.Multer.File[];
  };
  const fileUpdates: Record<string, any> = {};

  for (const field of allowedFiles) {
    const file = uploadedFiles?.[field]?.[0];
    if (!file) continue;

    const originalPath = file.path;
    const webpPath = originalPath.replace(path.extname(originalPath), ".webp");

    await sharp(originalPath).webp({ quality: 80 }).toFile(webpPath);

    fs.unlinkSync(originalPath);

    fileUpdates[field] = webpPath
      .replace(process.cwd(), "")
      .replace("/public", "")
      .replace(/\\/g, "/");
  }

  const allUpdates = { ...textUpdates, ...fileUpdates };

  if (Object.keys(allUpdates).length > 0) {
    const { error } = await tryCatch(DriverModel.create(allUpdates));

    if (error) {
      console.log(error);
      return res.status(500).json({ message: "خطأ أثناء تعديل بيانات السائق" });
    }
  }

  res.json({
    success: true,
    updated_fields: allUpdates,
  });
};

const addFromAdmin = async (req: Request, res: Response) => {
  const allowedTextFields = [
    "driver_full_name",
    "rate",
    "driver_status",
    "driver_type",
    "driver_phone",
    "driver_city",
    "id_number",
    "plate_number",
    "password",
    "is_baned",
    "freelancer",
    "shift_duration",
  ];

  const textUpdates: Record<string, any> = {};

  for (const field of allowedTextFields) {
    if (field in req.body) {
      if (field === "password") {
        const hashedPassword = crypto
          .createHash("sha256")
          .update(req.body[field])
          .digest("hex");
        Object.assign(textUpdates, { password: hashedPassword });
      } else {
        textUpdates[field] = req.body[field];
      }
    }
  }

  const allowedFiles = [
    "first_license_photo",
    "second_license_photo",
    "third_license_photo",
    "fourth_license_photo",
  ];

  const uploadedFiles = (req.files || {}) as {
    [key: string]: Express.Multer.File[];
  };
  const fileUpdates: Record<string, any> = {};

  for (const field of allowedFiles) {
    const file = uploadedFiles?.[field]?.[0];
    if (!file) continue;

    const originalPath = file.path;
    const webpPath = originalPath.replace(path.extname(originalPath), ".webp");

    await sharp(originalPath).webp({ quality: 80 }).toFile(webpPath);

    fs.unlinkSync(originalPath);

    fileUpdates[field] = webpPath
      .replace(process.cwd(), "")
      .replace("/public", "")
      .replace(/\\/g, "/");
  }

  const allUpdates = { ...textUpdates, ...fileUpdates };

  const { error } = await tryCatch(DriverModel.create(allUpdates));

  if (error) {
    console.log(error);
    return res.status(500).json({ message: "خطأ أثناء إضافة السائق" });
  }

  res.json({
    success: true,
    updated_fields: allUpdates,
  });
};

const editDriver = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { banning } = req.query;

  if (banning === "true") {
    const { data: _, error } = await tryCatch(
      DriverModel.update(id, { is_baned: req.body.ban })
    );
    if (error) {
      console.log(error);
      return res.status(500).json({ message: "خطأ أثناء حظر السائق" });
    }
    return res.json({ success: true });
  }

  const allowedTextFields = [
    "driver_full_name",
    "rate",
    "driver_status",
    "driver_type",
    "driver_phone",
    "driver_city",
    "id_number",
    "plate_number",
    "stationed_at",
    "password",
    "is_baned",
    "freelancer",
    "shift_duration",
  ];

  const textUpdates: Record<string, any> = {};

  for (const field of allowedTextFields) {
    if (field in req.body) {
      if (field === "password") {
        const hashedPassword = crypto
          .createHash("sha256")
          .update(req.body.password)
          .digest("hex");
        Object.assign(textUpdates, { password: hashedPassword });
      } else {
        textUpdates[field] = req.body[field];
      }
    }
  }

  const allowedFiles = [
    "first_license_photo",
    "second_license_photo",
    "third_license_photo",
    "fourth_license_photo",
  ];

  const uploadedFiles = (req.files || {}) as {
    [key: string]: Express.Multer.File[];
  };
  const fileUpdates: Record<string, any> = {};

  const driverOld = await DriverModel.getById(id);

  for (const field of allowedFiles) {
    const file = uploadedFiles?.[field]?.[0];
    if (!file) continue;

    const originalPath = file.path;
    const webpPath = originalPath.replace(path.extname(originalPath), ".webp");

    await sharp(originalPath).webp({ quality: 80 }).toFile(webpPath);

    fs.unlinkSync(originalPath);

    const oldPath = (driverOld as Record<string, any>)?.[field];
    if (oldPath) {
      const absOldPath = path.join(process.cwd(), oldPath);
      if (fs.existsSync(absOldPath)) fs.unlinkSync(absOldPath);
    }

    fileUpdates[field] = webpPath
      .replace(process.cwd(), "")
      .replace("/public", "")
      .replace(/\\/g, "/");
  }

  const allUpdates = { ...textUpdates, ...fileUpdates };

  const newData = { ...allUpdates };
  if (allUpdates.is_baned) {
    Object.assign(newData, { is_baned: JSON.parse(allUpdates.is_baned) });
  }
  if (allUpdates.freelancer) {
    Object.assign(newData, { freelancer: JSON.parse(allUpdates.freelancer) });
  }

  const { error } = await tryCatch(DriverModel.update(id, newData));

  if (error) {
    console.log(error);
    return res.status(500).json({ message: "خطأ أثناء تعديل بيانات السائق" });
  }

  res.json({
    success: true,
    updated_fields: allUpdates,
  });
};

const deleteDriver = async (req: Request, res: Response) => {
  res.json(await DriverModel.delete(Number(req.params.id)));
};

const updateOrderPickedUp = async (req: Request, res: Response) => {
  try {
    const orderId = Number(req.params.id);
    const { photo } = req.body;

    if (!orderId || !photo) {
      return res
        .status(400)
        .json({ message: "Order ID and photo are required." });
    }

    let imageUrl = "";
    if (photo) {
      const finalDir = `public/images/orders/picked-up/${orderId}`;
      if (!fs.existsSync(finalDir)) {
        fs.mkdirSync(finalDir, { recursive: true });
      }

      const base64Data = photo.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      const tempFilePath = path.join(finalDir, `picked-up-${Date.now()}.png`);
      fs.writeFileSync(tempFilePath, buffer);

      const webpFileName = await convertToWebp(tempFilePath, finalDir);
      imageUrl = `/images/orders/picked-up/${webpFileName}`;
    }

    const { data: updatedOrder, error: updateError } = await tryCatch(
      OrderModel.update(orderId, {
        order_status: "picked-up",
        pickup_image: imageUrl,
        driver_id: (req as any).user.driver_id,
      })
    );

    if (updateError) {
      console.error("Error updating order status:", updateError);
      return res.status(500).json({ message: updateError.message });
    }

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ message: "Order not found or not updated." });
    }

    if (updatedOrder.restaurant_id) {
      broadcastToRestaurant(updatedOrder.restaurant_id, {
        type: "order_status_updated",
        order: updatedOrder,
      });
    }

    const driverId = (req as any).user.driver_id;
    const driverWs = driverClients.get(driverId);

    if (driverWs && driverWs.readyState === driverWs.OPEN) {
      driverWs.send(
        JSON.stringify({
          type: "order_status_updated",
          order_id: orderId,
          order_status: "picked-up",
        })
      );
      console.log(
        `📢 Sent order status update for order ${orderId} to driver ${driverId}`
      );
    }

    res.json({ success: true, order: updatedOrder });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

const updateOrderDelivered = async (req: Request, res: Response) => {
  try {
    const orderId = Number(req.params.id);

    const { data: updatedOrder, error: updateError } = await tryCatch(
      OrderModel.update(orderId, {
        order_status: "delivered",
      })
    );

    if (updateError) {
      console.error("Error updating order status:", updateError);
      return res.status(500).json({ message: updateError.message });
    }

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ message: "Order not found or not updated." });
    }

    if (updatedOrder.restaurant_id) {
      broadcastToRestaurant(updatedOrder.restaurant_id, {
        type: "order_status_updated",
        order: updatedOrder,
      });
    }

    const driverId = (req as any).user.driver_id;
    const driverWs = driverClients.get(driverId);

    if (driverWs && driverWs.readyState === driverWs.OPEN) {
      driverWs.send(
        JSON.stringify({
          type: "order_status_updated",
          order_id: orderId,
          order_status: "delivered",
        })
      );
      console.log(
        `📢 Sent order status update for order ${orderId} to driver ${driverId}`
      );
    }

    res.json({ success: true, order: updatedOrder });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

export {
  getAllDrivers,
  getDriverById,
  addDriver,
  editDriver,
  deleteDriver,
  updateOrderPickedUp,
  updateOrderDelivered,
  addFromAdmin,
};
