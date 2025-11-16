export const extractLocationFromGoogleMapsLink = (
  link: string
): { lat: number; lng: number } | null => {
  const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
  const match = link.match(regex);

  if (match && match[1] && match[2]) {
    const latitude = parseFloat(match[1]);
    const longitude = parseFloat(match[2]);
    return { lat: latitude, lng: longitude };
  }

  return null;
};
