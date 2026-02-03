import app from "./app";
import {
  ExtWebSocket,
  driverClients,
  restaurantClients,
  adminClients,
  broadcastToRestaurant,
  broadcastToDriver,
} from "./utils/websocketManager";
import { WebSocketServer } from "ws";
import { startOrderWorker } from "./workers/orderWorker";
import { onMessageHandler } from "./helper/websocket/onMessage";
import { onCloseHandler } from "./helper/websocket/onClose";
import { onErrorHandler } from "./helper/websocket/onError";


const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);

  startOrderWorker().catch((err) => {
    console.error("❌ Worker crashed:", err);
  });
});

const wss = new WebSocketServer({ server });

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

  ws.on("error", (error) => {
    console.error(error.message);
    onErrorHandler(ws);
  });
});

export { wss };

