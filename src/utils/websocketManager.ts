import { WebSocket } from "ws";

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
  branch_id?: number;
  admin_id?: number;
}

const driverClients = new Map<number, ExtWebSocket>();
const restaurantClients = new Map<number, ExtWebSocket>();
const adminClients = new Map<number, Set<ExtWebSocket>>();

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

function broadcastToAdmin(admin_id: number, message: object) {
  const payload = JSON.stringify(message);
  const clients = adminClients.get(admin_id);

  if (clients) {
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }
}

export {
  ExtWebSocket,
  driverClients,
  restaurantClients,
  adminClients,
  broadcastToRestaurant,
  broadcastToDriver,
  broadcastToAdmin,
};
