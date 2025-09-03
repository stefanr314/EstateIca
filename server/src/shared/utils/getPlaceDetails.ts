import axios from "axios";

export async function getPlaceDetails(placeId: string) {
  // Implementation for fetching place details using the placeId
  const response = await axios.get(
    `https://places.googleapis.com/v1/places/${placeId}?fields=id,displayName,location&languageCode=sr-Latn&key=${process.env.GOOGLE_PLACES_API_KEY}`
  );

  logging.log(response);
  const data = response.data;

  return {
    placeId: data.id,
    name: data.displayName?.text || null,
    lat: data.location?.latitude,
    lng: data.location?.longitude,
  };
}
