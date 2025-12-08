import {
  adminClients,
  driverClients,
  ExtWebSocket,
  restaurantClients,
} from "../..";

export function onErrorHandler(ws: ExtWebSocket) {
  driverClients.forEach((wsConnection, driver_id, map) => {
    if (
      wsConnection.readyState === wsConnection.CLOSED ||
      wsConnection.readyState === wsConnection.CLOSING
    ) {
      map.delete(driver_id);
    }
  });

  adminClients.forEach((clientsSet, branch_id, map) => {
    clientsSet.forEach((wsConnection) => {
      if (
        wsConnection.readyState === wsConnection.CLOSED ||
        wsConnection.readyState === wsConnection.CLOSING
      ) {
        clientsSet.delete(wsConnection);
      }
    });
    if (clientsSet.size === 0) {
      map.delete(branch_id);
    }
  });
  restaurantClients.forEach((wsConnection, restaurant_id, map) => {
    if (
      wsConnection.readyState === wsConnection.CLOSED ||
      wsConnection.readyState === wsConnection.CLOSING
    ) {
      map.delete(restaurant_id);
    }
  });
}
