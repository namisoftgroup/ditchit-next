export const getCoordinates = async (zip: string, country = "US") => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        zip
      )}&components=country:${country}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      const formattedAddress = data.results[0].formatted_address;
      return {
        latitude: location.lat,
        longitude: location.lng,
        address: formattedAddress,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
};
