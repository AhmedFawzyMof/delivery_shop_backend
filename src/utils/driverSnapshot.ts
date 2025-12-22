export type DriverSnapshot = {
  driver_id: number;
  driver_city: string;
  driver_status: string;
  driver_stationed_at?: number;
  location?: {
    lat: number;
    lng: number;
  };
};
