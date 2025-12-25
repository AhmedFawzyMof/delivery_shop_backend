import { parentPort } from "worker_threads";
import { DriverSnapshot } from "../utils/driverSnapshot";

const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

parentPort!.on("message", async (msg) => {
  const { restaurant_id, order_city, lat, lon, drivers, options } = msg;

  const stationed = drivers.filter(
    (d: DriverSnapshot) =>
      d.driver_stationed_at === restaurant_id &&
      d.driver_status === "READY" &&
      d.driver_city === order_city
  );

  if (stationed.length) {
    parentPort!.postMessage({
      type: "RESULT",
      drivers: stationed.map((d: DriverSnapshot) => d.driver_id),
    });
    return;
  }

  let radius = options.startRadiusKm;
  const start = Date.now();

  while (Date.now() - start < options.maxDurationMs) {
    const found = drivers
      .filter(
        (d: DriverSnapshot) =>
          d.location &&
          d.driver_status === "READY" &&
          d.driver_city === order_city &&
          haversine(lat, lon, d.location.lat, d.location.lng) <= radius
      )
      .map((d: DriverSnapshot) => d.driver_id);

    if (found.length) {
      parentPort!.postMessage({ type: "RESULT", drivers: found });
      return;
    }

    if (radius >= 12) break;
    radius += options.radiusStepKm;
    await new Promise((r) => setTimeout(r, options.intervalMs));
  }

  parentPort!.postMessage({ type: "RESULT", drivers: [] });
});
