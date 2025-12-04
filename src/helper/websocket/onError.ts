import {
  adminClients,
  driverClients,
  ExtWebSocket,
  restaurantClients,
} from "../..";

export function onErrorHandler(ws: ExtWebSocket) {
  driverClients.forEach((wsConnection, key, map) => {
    if (
      wsConnection.readyState === wsConnection.CLOSED ||
      wsConnection.readyState === wsConnection.CLOSING
    ) {
      map.delete(key);
    }
  });

  adminClients.forEach((wsConnection, key, map) => {
    if (
      wsConnection.readyState === wsConnection.CLOSED ||
      wsConnection.readyState === wsConnection.CLOSING
    ) {
      map.delete(key);
    }
  });
  restaurantClients.forEach((wsConnection, key, map) => {
    if (
      wsConnection.readyState === wsConnection.CLOSED ||
      wsConnection.readyState === wsConnection.CLOSING
    ) {
      map.delete(key);
    }
  });
}
