import {
  adminClients,
  driverClients,
  ExtWebSocket,
  restaurantClients,
} from "../../utils/websocketManager";

export function onCloseHandler(ws: ExtWebSocket) {
  if (ws.driver_id && driverClients.has(ws.driver_id)) {
    driverClients.delete(ws.driver_id);
    console.log(`🛑 Driver ${ws.driver_id} removed`);
  }

  if (ws.restaurant_id && restaurantClients.has(ws.restaurant_id)) {
    restaurantClients.delete(ws.restaurant_id);
    console.log(`🍽️ Restaurant ${ws.restaurant_id} removed`);
  }

  if (ws.branch_id && ws.admin_id && adminClients.has(ws.branch_id)) {
    const clients = adminClients.get(ws.branch_id);
    if (clients) {
      clients.forEach((client) => {
        if (client.admin_id === ws.admin_id) {
          clients.delete(client);
        }
      });

      if (clients.size === 0) {
        adminClients.delete(ws.branch_id);
      }
    }
  }
}
