import { Request, Response } from "express";
import { OrderModel } from "../models/order.model.js";
import tryCatch from "../utils/trycatch.js";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { convertToWebp } from "../utils/imageconverter.js";
import { broadcastToRestaurant, driverClients } from "../index.js";
import searchForDrivers from "../utils/geoFunctions.js";
import { CitiesModel } from "../models/cities.model.js";
import { OrderQueuesModel } from "../models/order_queue.model.js";

export const getAllOrders = async (req: Request, res: Response) => {
  const status = req.query.status;
  const restaurant = (req as any).user;
  const page = req.query.page ? Number(req.query.page) : 1;

  const from_date = req.query.from
    ? new Date(req.query.from as string).toISOString().split("T")[0]
    : undefined;

  const to_date = req.query.to
    ? new Date(req.query.to as string).toISOString().split("T")[0]
    : undefined;

  if (from_date && to_date && from_date > to_date) {
    return res.status(400).json({ message: "Invalid date range" });
  }

  if (!from_date && !to_date) {
    return res.status(400).json({ message: "Missing date range" });
  }

  if (status === "true") {
    const { data, error } = await tryCatch(
      OrderModel.getStats(from_date!, to_date!, restaurant.id)
    );

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.json({ stats: data });
  }

  const { data, error } = await tryCatch(
    OrderModel.getAll(from_date!, to_date!, restaurant.id, page)
  );

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  return res.json({ orders: data });
};

export const getAllOrdersAdmin = async (req: Request, res: Response) => {
  const status = req.query.status as string | undefined;
  const search = req.query.search as string | undefined;
  const city = req.query.city as string | undefined;
  const page = req.query.page ? Number(req.query.page) : 1;
  const adminUser = (req as any).user.data;

  const cities = await CitiesModel.getCityByBranchId(
    adminUser.branches.branch_id
  );

  const { data, error } = await tryCatch(
    OrderModel.getByFilters(
      status,
      city,
      search,
      adminUser.branches.branch_id,
      page
    )
  );

  if (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
    return;
  }

  res.json({ orders: data?.orders, count: data?.orderCount, cities });
};

export const getOrderById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { data, error } = await tryCatch(OrderModel.getById(id));

  if (error) {
    res.status(500).json({ message: error.message });
  }

  res.json({ order: data });
};

export const createOrder = async (req: Request, res: Response) => {
  const restaurant = (req as any).user;

  let imageUrl = "";

  if (req.body.receiptImage) {
    const base64Data = req.body.receiptImage.split(";base64,").pop();
    const imageBuffer = Buffer.from(base64Data, "base64");
    const finalDir = "public/images/receipt";

    if (!fs.existsSync(finalDir)) {
      fs.mkdirSync(finalDir, { recursive: true });
    }

    const fileName = `${uuidv4()}.png`;
    const filePath = path.join(finalDir, fileName);
    fs.writeFileSync(filePath, imageBuffer);

    const webpFileName = await convertToWebp(filePath, finalDir);
    imageUrl = `/images/receipt/${webpFileName}`;
  } else if (req.file) {
    const finalDir = "public/images/receipt";

    if (!fs.existsSync(finalDir)) {
      fs.mkdirSync(finalDir, { recursive: true });
    }

    const webpFileName = await convertToWebp(req.file.path, finalDir);
    imageUrl = `/images/receipt/${webpFileName}`;
  }

  const { data: order_data, error: order_error } = await tryCatch(
    OrderModel.create({
      order_total_price: Number(req.body.totalAmount),
      order_delivery_cost: Number(req.body.deliveryCost),
      user_phone: req.body.customerPhone,
      order_status: "preparing",
      order_notes: req.body.notes,
      restaurant_id: restaurant.id,
      order_city: req.body.order_city,
      order_receipt: imageUrl,
    })
  );

  if (order_error) {
    console.log(order_error);
    return res.status(500).json({ message: order_error.message });
  }

  if (!order_data || order_data.length === 0) {
    console.log("Failed to create order");
    return res.status(500).json({ message: "Failed to create order" });
  }

  const order = order_data[0];

  const { data: _, error: queue_error } = await tryCatch(
    OrderQueuesModel.create({
      order_id: order.order_id,
      payload: JSON.stringify({
        order_id: order.order_id,
        restaurant_id: restaurant.id,
      }),
      status: "pending",
      attempts: 0,
      created_at: Date.now(),
      updated_at: Date.now(),
    })
  );

  if (queue_error) {
    console.log("Failed to create queue for the order");
    return res
      .status(500)
      .json({ message: "Failed to create queue for the order" });
  }

  broadcastToRestaurant(restaurant.id, {
    type: "new_order",
    order,
  });

  res.json({ success: true });
};

export const adminUpdateOrder = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { order_status } = req.body;
  const currentDate = new Date().toISOString();

  let orderError;
  let orderData;

  if (order_status === "delivered") {
    const { data, error } = await tryCatch(
      OrderModel.update(id, {
        order_status: order_status,
        delivered_at: currentDate,
      })
    );

    orderError = error;
    orderData = data;
  }

  if (order_status === "picked-up") {
    const { data, error } = await tryCatch(
      OrderModel.update(id, {
        order_status: order_status,
        picked_up_at: currentDate,
      })
    );

    orderError = error;
    orderData = data;
  }

  if (order_status === "ready") {
    const { data, error } = await tryCatch(
      OrderModel.update(id, {
        order_status: order_status,
        ready_at: currentDate,
      })
    );

    orderError = error;
    orderData = data;
  }

  const { data, error } = await tryCatch(
    OrderModel.update(id, {
      order_status: order_status,
    })
  );

  if (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }

  if (orderError?.message) {
    console.error(orderError.message);
    res.status(500).json({ message: orderError.message });
  }

  orderData = data;

  if (orderData?.restaurant_id) {
    broadcastToRestaurant(orderData.restaurant_id, {
      type: "order_status_updated",
      order: orderData,
    });
  }

  if (orderData?.driver_id) {
    for (const ws of driverClients.values()) {
      if (
        ws.driver_stationed_at === orderData.restaurant_id &&
        ws.driver_orders &&
        ws.driver_orders.includes(orderData.order_id) &&
        ws.readyState === ws.OPEN
      ) {
        ws.send(
          JSON.stringify({
            type: "order_status_updated",
            order_id: orderData.order_id,
            order_status: orderData.order_status,
          })
        );
        console.log(
          `📢 Sent order status update for order ${orderData.order_id} to driver ${ws.driver_id}`
        );
        break;
      }
    }
  }

  res.json({ success: true });
};

export const updateOrder = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const updateStatus = req.query.update_status === "true";
  const orderIdToUpdate = id;
  const newOrderStatus = req.body.order_status;
  const restaurantId = req.body.restaurant_id;
  const currentDate = new Date().toISOString();

  if (updateStatus) {
    let orderData;
    let orderError;
    if (req.body.order_status === "delivered") {
      const { data, error } = await tryCatch(
        OrderModel.update(id, {
          order_status: req.body.order_status,
          delivered_at: currentDate,
        })
      );

      orderData = data;
      orderError = error;
    }

    if (req.body.order_status === "picked-up") {
      const { data, error } = await tryCatch(
        OrderModel.update(id, {
          order_status: req.body.order_status,
          picked_up_at: currentDate,
        })
      );

      orderData = data;
      orderError = error;
    }

    if (req.body.order_status === "ready") {
      const { data, error } = await tryCatch(
        OrderModel.update(id, {
          order_status: req.body.order_status,
          ready_at: currentDate,
        })
      );

      orderData = data;
      orderError = error;
    }

    if (orderError) {
      res.status(500).json({ message: orderError.message });
    }

    broadcastToRestaurant(req.body.restaurant_id, {
      type: "order_status_updated",
      order: orderData,
    });

    for (const ws of driverClients.values()) {
      if (
        ws.driver_stationed_at === restaurantId &&
        ws.driver_orders &&
        ws.driver_orders.includes(orderIdToUpdate) &&
        ws.readyState === ws.OPEN
      ) {
        ws.send(
          JSON.stringify({
            type: "order_status_updated",
            order_id: orderIdToUpdate,
            order_status: newOrderStatus,
          })
        );
        console.log(
          `📢 Sent order status update for order ${orderIdToUpdate} to driver ${ws.driver_id}`
        );
        break;
      }
    }

    return res.json({ success: true });
  }

  const { data, error } = await tryCatch(
    OrderModel.update(id, {
      order_total_price: req.body.order_total_price,
      order_delivery_cost: req.body.order_delivery_cost,
      order_notes: req.body.notes,
    })
  );

  if (error) {
    res.status(500).json({ message: error.message });
  }

  broadcastToRestaurant(req.body.restaurant_id, {
    type: "updated_order",
    order: data,
  });

  for (const ws of driverClients.values()) {
    if (
      ws.driver_stationed_at === restaurantId &&
      ws.driver_orders &&
      ws.driver_orders.includes(orderIdToUpdate) &&
      ws.readyState === ws.OPEN
    ) {
      ws.send(
        JSON.stringify({
          type: "updated_order",
          order: data,
        })
      );
      console.log(
        `📢 Sent order status update for order ${orderIdToUpdate} to driver ${ws.driver_id}`
      );
      break;
    }
  }

  res.json({ success: true });
};

export const assignOrder = async (req: Request, res: Response) => {
  try {
    const { driver_id, orders } = req.body;
    const { data, error } = await tryCatch(OrderModel.getByIds(orders));

    if (error || !data) {
      return res
        .status(500)
        .json({ message: error?.message || "Order not found" });
    }

    const ordersToSend: any = [];

    orders.forEach((order: any) => {
      const restaurant = {
        name: order.restaurant_name,
        id: order.restaurant_id,
        location: order.location,
        address: order.restaurant_address,
      };

      ordersToSend.push({ ...order, restaurant });
    });

    const wsClient = driverClients.get(Number(driver_id));

    if (wsClient && wsClient.readyState === wsClient.OPEN) {
      ordersToSend.forEach((order: any) => {
        wsClient.send(
          JSON.stringify({
            type: "new_order_nearby",
            order: order,
          })
        );
      });
      return res.json({ success: true });
    }

    return res.json({ success: false, message: "Driver not connected" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { data, error } = await tryCatch(OrderModel.delete(id));

  if (error) {
    res.status(500).json({ message: error.message });
  }

  res.json({ order: data });
};
