export const getCoordinates = async (
  zip: string,
  country = "US",
  lang?: string
) => {
  // 1️⃣ Priority: provided lang param
  // 2️⃣ Document <html lang="xx-YY"> attribute
  // 3️⃣ URL prefix e.g. /en-us/
  // 4️⃣ Browser navigator language
  // 5️⃣ Fallback to "en"

  let detectedLang = lang;

  if (!detectedLang && typeof document !== "undefined") {
    detectedLang = document.documentElement.lang?.split("-")[0];
  }

  if (!detectedLang && typeof window !== "undefined") {
    const pathLocale = window.location.pathname.split("/")[1]; // en-us
    if (/^[a-z]{2}(-[A-Z]{2})?$/.test(pathLocale)) {
      detectedLang = pathLocale.split("-")[0];
    }
  }

  if (!detectedLang && typeof navigator !== "undefined") {
    detectedLang = navigator.language.split("-")[0];
  }

  if (!detectedLang) detectedLang = "en";

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        zip
      )}&components=country:${country}&key=${
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      }&language=${detectedLang}`
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
