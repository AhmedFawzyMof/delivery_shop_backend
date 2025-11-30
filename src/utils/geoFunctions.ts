import { ExtWebSocket } from "..";

const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

async function findNearbyDrivers(
  lat: number,
  lon: number,
  radiusKm: number,
  city: string,
  drivers: Map<number, ExtWebSocket>
): Promise<ExtWebSocket[]> {
  const nearby: { ws: ExtWebSocket; distance: number }[] = [];

  for (const ws of drivers.values()) {
    if (
      !ws.driver_location ||
      ws.driver_status !== "READY" ||
      ws.driver_city !== city
    )
      continue;

    const { lat: dLat, lng: dLng } = ws.driver_location;
    const distance = haversine(lat, lon, dLat, dLng);

    if (distance <= radiusKm) {
      nearby.push({ ws, distance });
    }
  }

  nearby.sort((a, b) => a.distance - b.distance);
  return nearby.map((d) => d.ws);
}

export default async function searchForDrivers(
  restaurant_id: number,
  order_city: string,
  lat: number,
  lon: number,
  drivers: Map<number, ExtWebSocket>,
  {
    maxDurationMs = 180000,
    startRadiusKm = 2,
    radiusStepKm = 1,
    intervalMs = 5000,
  } = {}
): Promise<ExtWebSocket[]> {
  console.log(order_city);
  const stationedDrivers = Array.from(drivers.values()).filter(
    (ws) =>
      ws.driver_stationed_at === restaurant_id &&
      ws.driver_status === "READY" &&
      ws.driver_city === order_city
  );

  if (stationedDrivers.length > 0) {
    console.log(
      `✅ Found ${stationedDrivers.length} stationed drivers in ${order_city}`
    );
    return stationedDrivers;
  }

  console.log(
    `🔍 No stationed drivers available in ${order_city}, searching by radius...`
  );

  const start = Date.now();
  let radius = startRadiusKm;

  while (Date.now() - start < maxDurationMs) {
    const found = await findNearbyDrivers(
      lat,
      lon,
      radius,
      order_city,
      drivers
    );

    if (found.length > 0) {
      console.log(
        `✅ Found ${found.length} drivers within ${radius}km in ${order_city}`
      );
      return found;
    }

    console.log(`🔍 No drivers in ${radius}km, retrying...`);
    if (radius === 12) {
      break;
    }
    radius += radiusStepKm;

    await new Promise((r) => setTimeout(r, intervalMs));
  }

  console.log("⏰ Timed out — no drivers found after max duration.");
  return [];
}
