import { driverClients, ExtWebSocket } from "../utils/websocketManager";

/**
 * Count active drivers in given cities
 * @param cities - array of city names
 * @returns number of active drivers in these cities
 */
function countActiveDriversByCities(cities: string[]): number {
  let count = 0;

  driverClients.forEach((ws: ExtWebSocket) => {
    if (
      ws.readyState === ws.OPEN &&
      ws.driver_city &&
      cities.includes(ws.driver_city)
    ) {
      count++;
    }
  });

  return count;
}

export { countActiveDriversByCities };
