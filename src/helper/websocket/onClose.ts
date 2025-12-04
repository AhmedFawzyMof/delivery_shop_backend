import { driverClients, ExtWebSocket, restaurantClients } from "../..";

export function onCloseHandler(ws: ExtWebSocket) {
  if (ws.driver_id && driverClients.has(ws.driver_id)) {
    driverClients.delete(ws.driver_id);
    console.log(`🛑 Driver ${ws.driver_id} removed`);
  }

  if (ws.restaurant_id && restaurantClients.has(ws.restaurant_id)) {
    restaurantClients.delete(ws.restaurant_id);
    console.log(`🍽️ Restaurant ${ws.restaurant_id} removed`);
  }
}
