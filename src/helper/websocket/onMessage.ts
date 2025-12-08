import WebSocket from "ws";
import {
  adminClients,
  driverClients,
  ExtWebSocket,
  restaurantClients,
} from "../..";
import { OrderModel } from "../../models/order.model";
import { BranchesModel } from "../../models/branches.model";

type SenderType = "restaurant" | "driver" | "admin";

export function getSenderType(jsonData: any): SenderType {
  if (jsonData.restaurant_id) {
    return "restaurant";
  }

  if (jsonData.driver_id) {
    return "driver";
  }

  if (jsonData.admin_id) {
    return "admin";
  }

  return "driver";
}

export async function onMessageHandler(
  ws: ExtWebSocket,
  message: WebSocket.RawData
) {
  const messageData = JSON.parse(message.toString());
  const senderType = getSenderType(messageData);

  if (senderType === "admin") {
    if (messageData.type === "admin_init") {
      ws.branch_id = messageData.branch_id;
      ws.admin_id = messageData.admin_id;
      if (!adminClients.has(messageData.branch_id)) {
        adminClients.set(messageData.branch_id, new Set());
      }

      const clients = adminClients.get(messageData.branch_id)!;
      clients.add(ws);
      console.log(`🛠️ Admin connected from branch ${ws.branch_id}`);
    }
    if (messageData.type === "get_driver_location" && messageData.driver_id) {
      const driver = driverClients.get(Number(messageData.driver_id));
      if (
        driver &&
        driver.driver_location &&
        driver.readyState === WebSocket.OPEN
      ) {
        ws.send(
          JSON.stringify({
            type: "driver_location",
            driver_id: driver.driver_id,
            location: driver.driver_location,
          })
        );
        console.log(
          `📍 Sent current location of driver ${messageData.driver_id} to admin`
        );
      } else {
        ws.send(
          JSON.stringify({
            type: "driver_location",
            driver_id: messageData.driver_id,
            location: null,
            error: "Driver not connected or location unknown",
          })
        );
      }
    }
  }

  if (senderType === "restaurant") {
    if (messageData.type === "restaurant_init") {
      const id = Number(messageData.restaurant_id);
      ws.restaurant_id = id;
      ws.restaurant_location = messageData.location;

      if (!restaurantClients.has(id)) {
        restaurantClients.set(id, ws);
        console.log(`Restaurant ${id} connected`);
      }
    }

    if (messageData.type === "late_preparing_order") {
      const data = await BranchesModel.getBracheByOrderId(messageData.order_id);
      const clients = adminClients.get(data?.branch_id!);
      clients?.forEach((client) => {
        client.send(
          JSON.stringify({
            type: "late_preparing_order",
            restaurant: data?.restaurant_name,
            order_id: messageData.order_id,
          })
        );
      });
    }

    if (messageData.type === "late_pickup_order") {
      const data = await BranchesModel.getBracheByOrderId(messageData.order_id);
      const clients = adminClients.get(data?.branch_id!);
      clients?.forEach((client) => {
        client.send(
          JSON.stringify({
            type: "late_preparing_order",
            restaurant: data?.restaurant_name,
            order_id: messageData.order_id,
          })
        );
      });
    }
  }

  if (senderType === "driver") {
    if (messageData.type === "driver_init") {
      const id = Number(messageData.driver_id);
      ws.driver_id = id;
      ws.driver_name = messageData.driver_name;
      ws.driver_type = messageData.driver_type;
      ws.driver_city = messageData.driver_city;
      ws.driver_location = messageData.location;
      ws.driver_status = messageData.driver_status;
      ws.driver_stationed_at = messageData.driver_stationed_at;
      ws.driver_orders = messageData.driver_orders;
      ws.driver_location = messageData.location;

      if (!driverClients.has(id)) {
        driverClients.set(id, ws);
      }
      console.log(`🚗 Driver ${id} connected via WebSocket`);
    }

    if (messageData.type === "location_update") {
      console.log(
        `📍 Driver ${messageData.driver_id} location:`,
        messageData.location
      );

      const driver = driverClients.get(Number(messageData.driver_id));
      if (driver) {
        driver.driver_location = { ...messageData.location };
      }
    }

    if (messageData.type === "update_orders") {
      const driver = driverClients.get(Number(messageData.driver_id));
      if (driver) {
        driver.driver_stationed_at = messageData.driver_stationed_at;
        driver.driver_status = messageData.driver_status;
        OrderModel.update(messageData.order_id, {
          driver_id: messageData.driver_id,
        });
        driver.driver_orders?.push(messageData.order_id);
      }
    }

    if (messageData.type === "add_order") {
      const driver = driverClients.get(Number(messageData.driver_id));
      if (driver) {
        if (!driver.driver_orders) driver.driver_orders = [];
        if (!driver.driver_orders.includes(messageData.order_id)) {
          driver.driver_stationed_at = messageData.driver_stationed_at;
          driver.driver_orders.push(messageData.order_id);
        }
        console.log(
          `🆕 Driver ${messageData.driver_id} added order ${messageData.order_id}`
        );
      }
    }

    if (messageData.type === "remove_order") {
      const driver = driverClients.get(Number(messageData.driver_id));

      if (driver && driver.driver_orders) {
        driver.driver_orders = driver.driver_orders.filter(
          (id) => id !== messageData.order_id
        );

        console.log(
          `❌ Order ${messageData.order_id} removed from driver ${messageData.driver_id}`
        );
      }
    }

    if (messageData.type === "clear_orders") {
      const driver = driverClients.get(Number(messageData.driver_id));
      if (driver) {
        driver.driver_orders = [];
        console.log(
          `🧹 Cleared all orders for driver ${messageData.driver_id}`
        );
      }
    }

    if (messageData.type === "change_city" && messageData.driver_city) {
      const driver = driverClients.get(Number(messageData.driver_id));
      if (driver) {
        driver.driver_city = messageData.driver_city;
        console.log(
          `🌆 Driver ${messageData.driver_id} city updated to ${messageData.driver_city}`
        );
      }
    }

    if (messageData.type === "get_orders") {
      const driver = driverClients.get(Number(messageData.driver_id));
      if (driver && driver.readyState === WebSocket.OPEN) {
        driver.send(
          JSON.stringify({
            type: "driver_orders",
            orders: driver.driver_orders || [],
          })
        );
        console.log(
          `📦 Sent current orders to driver ${messageData.driver_id}`
        );
      }
    }
  }
}
