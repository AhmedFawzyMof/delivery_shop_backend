import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { WebSocketServer, WebSocket } from "ws";

import restaurantRoutes from "./router/restaurant.router";
import driverRoutes from "./router/driver.router";
import userRoutes from "./router/user.router";
import orderRoutes from "./router/order.router";
import authRoutes from "./router/auth.router";
import citiesRouter from "./router/cities.router";
import branchesRouter from "./router/branch.router";
import adminRoutes from "./router/admin.router";
import roleRouter from "./router/role.router";
import contactRouter from "./router/contact.router";

import path from "path";
import { OrderModel } from "./models/order.model";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
      "https://delivery-shop-frontend.vercel.app",
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(express.static("public"));

app.use("/api/restaurants", restaurantRoutes);
app.use("/api/driver", driverRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cities", citiesRouter);
app.use("/api/branches", branchesRouter);
app.use("/api/admins", adminRoutes);
app.use("/api/roles", roleRouter);
app.use("/api/contacts", contactRouter);

app.use((req, res, next) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
  } else {
    next();
  }
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

interface ExtWebSocket extends WebSocket {
  driver_id?: number;
  driver_name?: string;
  driver_type?: string;
  driver_city?: string;
  driver_location?: { lat: number; lng: number };
  driver_status?: string;
  driver_stationed_at?: number;
  restaurant_id?: number;
  restaurant_location?: { lat: number; lng: number };
  driver_orders?: number[];
}

const wss = new WebSocketServer({ server });
const restaurantClients = new Map<number, Set<ExtWebSocket>>();
const driverClients = new Map<number, ExtWebSocket>();

wss.on("connection", (ws: ExtWebSocket) => {
  console.log("🔗 WebSocket connected");

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg.toString());
      if (data.restaurant_id) {
        const id = Number(data.restaurant_id);
        ws.restaurant_id = id;
        ws.restaurant_location = data.location;

        if (!restaurantClients.has(id)) {
          restaurantClients.set(id, new Set());
        }
        restaurantClients.get(id)!.add(ws);
        console.log(`🍽️ Restaurant ${id} connected via WebSocket`);
      }

      if (data.type === "driver_init" && data.driver_id) {
        const id = Number(data.driver_id);
        ws.driver_id = id;
        ws.driver_name = data.driver_name;
        ws.driver_type = data.driver_type;
        ws.driver_city = data.driver_city;
        ws.driver_location = data.location;
        ws.driver_status = data.driver_status;
        ws.driver_stationed_at = data.driver_stationed_at;
        ws.driver_orders = data.driver_orders;

        driverClients.set(id, ws);
        console.log(`🚗 Driver ${id} connected via WebSocket`);
      }

      if (data.type === "location_update" && data.driver_id) {
        console.log(`📍 Driver ${data.driver_id} location:`, data.location);

        const driver = driverClients.get(Number(data.driver_id));
        if (driver) {
          driver.driver_location = { ...data.location };
        }
      }

      if (data.type === "update_orders" && data.driver_id) {
        const driver = driverClients.get(Number(data.driver_id));
        if (driver) {
          driver.driver_stationed_at = data.driver_stationed_at;
          driver.driver_status = data.driver_status;
          OrderModel.update(data.order_id, { driver_id: data.driver_id });
          driver.driver_orders?.push(data.order_id);
        }
      }

      if (data.type === "add_order" && data.driver_id && data.order_id) {
        const driver = driverClients.get(Number(data.driver_id));
        if (driver) {
          if (!driver.driver_orders) driver.driver_orders = [];
          if (!driver.driver_orders.includes(data.order_id)) {
            driver.driver_stationed_at = data.driver_stationed_at;
            driver.driver_orders.push(data.order_id);
          }
          console.log(
            `🆕 Driver ${data.driver_id} added order ${data.order_id}`
          );
        }
      }

      if (data.type === "remove_order" && data.driver_id && data.order_id) {
        const driver = driverClients.get(Number(data.driver_id));
        if (driver && driver.driver_orders) {
          driver.driver_orders = driver.driver_orders.filter(
            (id) => id !== data.order_id
          );
          console.log(
            `❌ Order ${data.order_id} removed from driver ${data.driver_id}`
          );
        }
      }

      if (data.type === "clear_orders" && data.driver_id) {
        const driver = driverClients.get(Number(data.driver_id));
        if (driver) {
          driver.driver_orders = [];
          console.log(`🧹 Cleared all orders for driver ${data.driver_id}`);
        }
      }

      if (data.type === "get_orders" && data.driver_id) {
        const driver = driverClients.get(Number(data.driver_id));
        if (driver && driver.readyState === WebSocket.OPEN) {
          driver.send(
            JSON.stringify({
              type: "driver_orders",
              orders: driver.driver_orders || [],
            })
          );
          console.log(`📦 Sent current orders to driver ${data.driver_id}`);
        }
      }
      if (data.type === "get_driver_location" && data.driver_id) {
        const driver = driverClients.get(Number(data.driver_id));
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
            `📍 Sent current location of driver ${data.driver_id} to admin`
          );
        } else {
          ws.send(
            JSON.stringify({
              type: "driver_location",
              driver_id: data.driver_id,
              location: null,
              error: "Driver not connected or location unknown",
            })
          );
        }
      }
    } catch (err) {
      console.error("Invalid WebSocket message:", err);
    }
  });

  ws.on("close", () => {
    console.log("❌ WebSocket disconnected");
    if (ws.driver_id && driverClients.has(ws.driver_id)) {
      driverClients.delete(ws.driver_id);
      console.log(`🛑 Driver ${ws.driver_id} removed`);
    }

    if (ws.restaurant_id && restaurantClients.has(ws.restaurant_id)) {
      const clients = restaurantClients.get(ws.restaurant_id)!;
      clients.delete(ws);
      if (clients.size === 0) restaurantClients.delete(ws.restaurant_id);
      console.log(`🍽️ Driver removed from restaurant ${ws.restaurant_id}`);
    }
  });
});

function broadcastToRestaurant(restaurant_id: number, message: object) {
  const payload = JSON.stringify(message);
  const clients = restaurantClients.get(restaurant_id);
  if (!clients) return;

  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
}

function broadcastToDriversFiltered(
  filters: Partial<{
    city: string;
    type: string;
    status: string;
    stationed_at: number;
  }>,
  message: object
) {
  const payload = JSON.stringify(message);
  let count = 0;

  for (const ws of driverClients.values()) {
    if (ws.readyState !== WebSocket.OPEN) continue;

    if (
      (filters.city && ws.driver_city !== filters.city) ||
      (filters.type && ws.driver_type !== filters.type) ||
      (filters.status && ws.driver_status !== filters.status) ||
      (filters.stationed_at && ws.driver_stationed_at !== filters.stationed_at)
    ) {
      continue;
    }

    ws.send(payload);
    count++;
  }

  console.log(`📢 Sent to ${count} drivers matching filters`);
}

export {
  wss,
  broadcastToRestaurant,
  broadcastToDriversFiltered,
  driverClients,
  ExtWebSocket,
};
