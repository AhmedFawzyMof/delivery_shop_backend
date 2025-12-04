import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { WebSocketServer, WebSocket } from "ws";
import { startOrderWorker } from "./workers/orderWorker";
import restaurantRoutes from "./router/restaurant.router";
import driverRoutes from "./router/driver.router";
import orderRoutes from "./router/order.router";
import authRoutes from "./router/auth.router";
import citiesRouter from "./router/cities.router";
import branchesRouter from "./router/branch.router";
import adminRoutes from "./router/admin.router";
import roleRouter from "./router/role.router";
import contactRouter from "./router/contact.router";

import path from "path";
import { onMessageHandler } from "./helper/websocket/onMessage";
import { onCloseHandler } from "./helper/websocket/onClose";
import { onErrorHandler } from "./helper/websocket/onError";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(express.static("public"));

app.use("/api/restaurants", restaurantRoutes);
app.use("/api/driver", driverRoutes);
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

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);

  startOrderWorker().catch((err) => {
    console.error("❌ Worker crashed:", err);
  });
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
  admin_id?: number;
  branch_id?: number;
}

const wss = new WebSocketServer({ server });
const restaurantClients = new Map<number, ExtWebSocket>();
const driverClients = new Map<number, ExtWebSocket>();
const adminClients = new Map<
  { admin_id: number; branch_id: number },
  ExtWebSocket
>();

wss.on("connection", (ws: ExtWebSocket) => {
  console.log("🔗 WebSocket connected");

  ws.on("message", (msg) => {
    try {
      onMessageHandler(ws, msg);
    } catch (err) {
      console.error("Invalid WebSocket message:", err);
    }
  });

  ws.on("close", () => {
    onCloseHandler(ws);
  });

  ws.on("error", () => {
    onErrorHandler(ws);
  });
});

function broadcastToRestaurant(restaurant_id: number, message: object) {
  const payload = JSON.stringify(message);
  const client = restaurantClients.get(restaurant_id);

  if (client && client.readyState === WebSocket.OPEN) {
    client.send(payload);
  }
}

function broadcastToDriver(driver_id: number, message: object) {
  const payload = JSON.stringify(message);
  const client = driverClients.get(driver_id);

  if (client && client.readyState === WebSocket.OPEN) {
    client.send(payload);
  }

  console.log(`📢 Sent to ${driver_id} driver`);
}

export {
  wss,
  broadcastToRestaurant,
  broadcastToDriver,
  driverClients,
  restaurantClients,
  adminClients,
  ExtWebSocket,
};
