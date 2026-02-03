import { Request, Response } from "express";
import { OrderModel } from "../models/order.model";
import tryCatch from "../utils/trycatch";
import { handleImageUpload } from "../utils/imageHandler";
import {
  broadcastToRestaurant,
  driverClients,
} from "../utils/websocketManager";
import { CitiesModel } from "../models/cities.model";
import { OrderQueuesModel } from "../models/order_queue.model";
import { ORDER_STATUS } from "../constants/orderStatus";

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
      OrderModel.getStats(from_date!, to_date!, restaurant.id),
    );

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.json({ stats: data });
  }

  const { data, error } = await tryCatch(
    OrderModel.getAll(from_date!, to_date!, restaurant.id, page),
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
    adminUser.branches.branch_id,
  );

  const { data, error } = await tryCatch(
    OrderModel.getByFilters(
      status,
      city,
      search,
      adminUser.branches.branch_id,
      page,
    ),
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

  const finalDir = "public/images/receipt";
  if (req.body.receiptImage) {
    imageUrl = await handleImageUpload(req.body.receiptImage, finalDir);
  } else if (req.file) {
    imageUrl = await handleImageUpload(req.file, finalDir);
  }

  const { data: order_data, error: order_error } = await tryCatch(
    OrderModel.create({
      order_total_price: Number(req.body.totalAmount),
      order_delivery_cost: Number(req.body.deliveryCost),
      user_phone: req.body.customerPhone,
      order_status: ORDER_STATUS.PREPARING,
      order_notes: req.body.notes,
      restaurant_id: restaurant.id,
      order_city: req.body.order_city,
      order_receipt: imageUrl,
      payment_method: req.body.paymentMethod,
    }),
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
      status: ORDER_STATUS.PREPARING,
      attempts: 0,
      created_at: Date.now(),
      updated_at: Date.now(),
    }),
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

const updateOrderStatus = async (
  id: number,
  order_status: string,
  currentDate: string,
  cancelation_reason?: string | undefined,
) => {
  let updateData: {
    order_status: string;
    delivered_at?: string;
    picked_up_at?: string;
    ready_at?: string;
    cancelation_reason?: string;
  } = { order_status: order_status };

  switch (order_status) {
    case ORDER_STATUS.DELIVERED:
      updateData.delivered_at = currentDate;
      break;
    case ORDER_STATUS.PICKED_UP:
      updateData.picked_up_at = currentDate;
      break;
    case ORDER_STATUS.READY:
      updateData.ready_at = currentDate;
      break;
  }

  if (order_status === ORDER_STATUS.CANCELED && cancelation_reason) {
    updateData.cancelation_reason = cancelation_reason;
  }

  return await tryCatch(OrderModel.update(id, updateData));
};

export const adminUpdateOrder = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { order_status, cancellation_reason } = req.body;
  const currentDate = new Date().toISOString();

  const { data: orderData, error: orderError } = await updateOrderStatus(
    id,
    order_status,
    currentDate,
    cancellation_reason,
  );

  if (orderError) {
    console.error(orderError.message);
    return res.status(500).json({ message: orderError.message });
  }

  if (orderData?.restaurant_id) {
    broadcastToRestaurant(orderData.restaurant_id, {
      type: "order_status_updated",
      order: orderData,
    });
  }

  if (orderData?.driver_id) {
    for (const ws of driverClients.values()) {
      if (ws.driver_id === orderData.driver_id) {
        ws.send(
          JSON.stringify({
            type: "order_status_updated",
            order_id: orderData.order_id,
            order_status: orderData.order_status,
          }),
        );
        console.log(
          `📢 Sent order status update for order ${orderData.order_id} to driver ${ws.driver_id}`,
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
    const { data: orderData, error: orderError } = await updateOrderStatus(
      id,
      newOrderStatus,
      currentDate,
    );

    if (orderError) {
      return res.status(500).json({ message: orderError.message });
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
          }),
        );
        console.log(
          `📢 Sent order status update for order ${orderIdToUpdate} to driver ${ws.driver_id}`,
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
    }),
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
        }),
      );
      console.log(
        `📢 Sent order status update for order ${orderIdToUpdate} to driver ${ws.driver_id}`,
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

    data.forEach((order: any) => {
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
          }),
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
