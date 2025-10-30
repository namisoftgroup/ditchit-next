// "use client";

// import { useEffect, useState, useRef, useCallback } from "react";
// import { GoogleMap, Marker } from "@react-google-maps/api";
// import { Input } from "@/components/ui/input";
// import { Search } from "lucide-react";
// import { useHomeFilter } from "@/features/listing/store";
// import { useTranslations, useLocale } from "next-intl";
// import { Country } from "@/types/country";
// import { toast } from "sonner";

// const LIBRARIES = ["places"] as const;
// const THROTTLE_DELAY = 1000;

// const containerStyle = {
//   borderRadius: "16px",
//   width: "100%",
//   height: "300px",
// };

// type Props = {
//   defaultCountry?: string;
//   onChange?: (pos: { lat: number; lng: number; address?: string }) => void;
//   countryData: Country | undefined;
// };

// // Type for geocode cache entries
// type GeocodeCache = {
//   [key: string]: {
//     address: string;
//     country: string;
//     timestamp: number;
//   };
// };

// // Type for search cache entries
// type SearchCache = {
//   [query: string]: {
//     lat: number;
//     lng: number;
//     address: string;
//     timestamp: number;
//   };
// };

// export default function LocationSearchMap({
//   defaultCountry,
//   onChange,
//   countryData,
// }: Props) {
//   console.log(countryData);

//   const { filter } = useHomeFilter();
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
//     lat: countryData?.center_lat ?? 0,
//     lng: countryData?.center_lng ?? 0,
//   });
//   const [searchQuery, setSearchQuery] = useState("");
//   const mapRef = useRef<google.maps.Map | null>(null);
//   const markerRef = useRef<google.maps.Marker | null>(null);
//   const t = useTranslations("common");
//   const locale = useLocale();

//   // Refs for caching and throttling
//   const geocodeCache = useRef<GeocodeCache>({});
//   const searchCache = useRef<SearchCache>({});
//   const lastGeocodeTimestampRef = useRef<number>(0);
//   const isUpdatingRef = useRef<boolean>(false);
//   const prevSearchQueryRef = useRef<string>("");
//   const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const lastDragPositionRef = useRef<{ lat: number; lng: number } | null>(null);

//   const [, setSelectCountryBounds] = useState(countryData?.code || "");
//   const [lastValidPosition, setLastValidPosition] = useState<{
//     lat: number;
//     lng: number;
//   }>({
//     lat: countryData?.center_lat ?? 0,
//     lng: countryData?.center_lng ?? 0,
//   });
//   const [lastValidAddress, setLastValidAddress] = useState("");

//   // Load Google Maps with current locale
//   useEffect(() => {
//     if (
//       typeof window !== "undefined" &&
//       (window as { google?: { maps?: unknown } }).google?.maps
//     ) {
//       setIsLoaded(true);
//       return;
//     }

//     const existingScript = document.getElementById("google-maps-script");
//     if (existingScript) {
//       existingScript.addEventListener("load", () => setIsLoaded(true));
//       return;
//     }

//     const loadGoogleMaps = () => {
//       return new Promise<void>((resolve, reject) => {
//         const script = document.createElement("script");
//         script.id = "google-maps-script";
//         script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=${LIBRARIES.join(",")}&language=${locale}`;
//         script.async = true;
//         script.defer = true;
//         script.onload = () => resolve();
//         script.onerror = (err) => reject(err);
//         document.head.appendChild(script);
//       });
//     };

//     loadGoogleMaps()
//       .then(() => setIsLoaded(true))
//       .catch(() => toast.error(t("failed_to_load_google_maps")));
//   }, [locale, t]);

//   const onLoad = useCallback((map: google.maps.Map) => {
//     mapRef.current = map;
//   }, []);
//   // Convert coordinates to address with country validation (with caching and throttling)
//   const updateAddressFromCoords = useCallback(
//     async (lat: number, lng: number, preFetchedAddress?: string) => {
//       // Skip if already updating or invalid coordinates
//       if (isUpdatingRef.current || !lat || !lng) {
//         return;
//       }

//       if (!("google" in window) || !google.maps?.Geocoder) {
//         revertToLastValid();
//         return;
//       }

//       // Round coordinates to 6 decimal places for consistent caching
//       const roundedLat = Math.round(lat * 1000000) / 1000000;
//       const roundedLng = Math.round(lng * 1000000) / 1000000;

//       // Create cache key
//       const cacheKey = `${roundedLat},${roundedLng}`;

//       // Check if we need to throttle
//       const now = Date.now();
//       if (now - lastGeocodeTimestampRef.current < THROTTLE_DELAY) {
//         return;
//       }

//       // Set updating flag and update timestamp
//       isUpdatingRef.current = true;
//       lastGeocodeTimestampRef.current = now;

//       // Check cache first
//       if (geocodeCache.current[cacheKey]) {
//         const cachedResult = geocodeCache.current[cacheKey];

//         // If the cached result is for the correct country, use it
//         if (!countryData?.code || cachedResult.country === countryData.code) {
//           const newPos = { lat: roundedLat, lng: roundedLng };
//           setMapCenter(newPos);
//           setSearchQuery(cachedResult.address);
//           setSelectCountryBounds(cachedResult.country);
//           setLastValidPosition(newPos);
//           setLastValidAddress(cachedResult.address);
//           onChange?.({
//             ...newPos,
//             address: cachedResult.address,
//           });
//           isUpdatingRef.current = false;
//           return;
//         }
//       }

//       // If not in cache or wrong country, proceed with geocoding
//       try {
//         const geocoder = new google.maps.Geocoder();
//         geocoder.geocode(
//           { location: { lat: roundedLat, lng: roundedLng } },
//           (results, status) => {
//             let address = preFetchedAddress;
//             if (!address && status === "OK" && results && results[0]) {
//               address = results[0].formatted_address;
//             }

//             if (status === "OK" && results && results[0]) {
//               const bounds = results
//                 .flatMap((res) =>
//                   res.address_components
//                     .filter((add) => add.types.includes("country"))
//                     .map((add) => add.short_name)
//                 )
//                 .filter(Boolean);

//               const detectedCountry = bounds[0] ?? "";

//               // Cache the result
//               geocodeCache.current[cacheKey] = {
//                 address: address || "",
//                 country: detectedCountry,
//                 timestamp: now,
//               };

//               if (
//                 detectedCountry === "" ||
//                 (countryData?.code && detectedCountry !== countryData.code)
//               ) {
//                 toast.error("You are outside the selected country");
//                 revertToLastValid();
//               } else {
//                 const newPos = { lat: roundedLat, lng: roundedLng };
//                 setMapCenter(newPos);
//                 setSearchQuery(address || "");
//                 setSelectCountryBounds(detectedCountry);
//                 setLastValidPosition(newPos);
//                 setLastValidAddress(address || "");
//                 onChange?.({
//                   ...newPos,
//                   address: address,
//                 });
//               }
//             } else {
//               toast.error(t("geocode_failed") || "Failed to geocode location");
//               revertToLastValid();
//             }

//             isUpdatingRef.current = false;
//           }
//         );
//       } catch (error) {
//         console.log(error);
//         toast.error(t("geocode_failed") || "Failed to geocode location");
//         revertToLastValid();
//         isUpdatingRef.current = false;
//       }
//     },
//     [countryData?.code, lastValidAddress, lastValidPosition, onChange, t] // eslint-disable-line react-hooks/exhaustive-deps
//   );
//   // Get current location
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           const lat = pos.coords.latitude;
//           const lng = pos.coords.longitude;
//           updateAddressFromCoords(lat, lng);
//         },
//         () => {
//           const lat = countryData?.center_lat ?? 0;
//           const lng = countryData?.center_lng ?? 0;
//           updateAddressFromCoords(lat, lng);
//         }
//       );
//     }
//   }, [countryData]); // eslint-disable-line react-hooks/exhaustive-deps

//   // Search with country validation, debouncing and caching
//   const handleSearch = useCallback(() => {
//     if (!searchQuery.trim()) return;
//     if (!("google" in window) || !google.maps?.Geocoder) return;

//     // Skip if same as previous search
//     if (searchQuery === prevSearchQueryRef.current) return;
//     prevSearchQueryRef.current = searchQuery;

//     // Check cache first
//     const cacheKey = `search_${searchQuery.trim().toLowerCase()}`;
//     if (searchCache.current[cacheKey]) {
//       const cachedResult = searchCache.current[cacheKey];
//       // Only use cache if it's recent (less than 1 hour old)
//       if (Date.now() - cachedResult.timestamp < 3600000) {
//         updateAddressFromCoords(
//           cachedResult.lat,
//           cachedResult.lng,
//           cachedResult.address
//         );
//         return;
//       }
//     }

//     // Skip if we're already updating or need to throttle
//     if (
//       isUpdatingRef.current ||
//       Date.now() - lastGeocodeTimestampRef.current < THROTTLE_DELAY
//     ) {
//       return;
//     }

//     isUpdatingRef.current = true;
//     lastGeocodeTimestampRef.current = Date.now();

//     try {
//       const geocoder = new google.maps.Geocoder();
//       geocoder.geocode({ address: searchQuery }, (results, status) => {
//         if (status === "OK" && results && results[0]) {
//           const location = results[0].geometry.location;
//           const lat = location.lat();
//           const lng = location.lng();
//           const formattedAddress = results[0].formatted_address;

//           // Cache the result
//           searchCache.current[cacheKey] = {
//             lat,
//             lng,
//             address: formattedAddress,
//             timestamp: Date.now(),
//           };

//           updateAddressFromCoords(lat, lng, formattedAddress);
//         } else {
//           toast.error("location not found");
//           revertToLastValid();
//         }
//         isUpdatingRef.current = false;
//       });
//     } catch (error) {
//       console.log(error);

//       toast.error("Failed to geocode location");
//       revertToLastValid();
//       isUpdatingRef.current = false;
//     }
//   }, [searchQuery, t, updateAddressFromCoords]); // eslint-disable-line react-hooks/exhaustive-deps

//   // Revert to last valid position and address
//   const revertToLastValid = useCallback(() => {
//     const pos = { lat: lastValidPosition.lat, lng: lastValidPosition.lng };
//     if (mapRef.current) {
//       mapRef.current.panTo(pos);
//     }
//     if (markerRef.current) {
//       markerRef.current.setPosition(pos);
//     }
//     setMapCenter(pos);
//     setSearchQuery(lastValidAddress);
//     onChange?.({
//       ...pos,
//       address: lastValidAddress,
//     });
//   }, [lastValidPosition, lastValidAddress, onChange]);

//   // Handle marker drag end with position tracking
//   const handleMarkerDragEnd = useCallback(
//     (e: google.maps.MapMouseEvent) => {
//       const lat = e.latLng?.lat();
//       const lng = e.latLng?.lng();

//       if (lat && lng) {
//         // Check if position has changed significantly (at least 0.0001 degree difference)
//         const lastPos = lastDragPositionRef.current;
//         if (
//           lastPos &&
//           Math.abs(lastPos.lat - lat) < 0.0001 &&
//           Math.abs(lastPos.lng - lng) < 0.0001
//         ) {
//           return; // Skip if position hasn't changed enough
//         }

//         // Update last position
//         lastDragPositionRef.current = { lat, lng };
//         updateAddressFromCoords(lat, lng);
//       }
//     },
//     [updateAddressFromCoords]
//   );

//   // // Handle map drag end with throttling
//   // const handleMapDragEnd = useCallback(() => {
//   //   const newCenter = mapRef.current?.getCenter();
//   //   if (newCenter) {
//   //     const lat = newCenter.lat();
//   //     const lng = newCenter.lng();

//   //     // Check if position has changed significantly
//   //     const lastPos = lastDragPositionRef.current;
//   //     if (
//   //       lastPos &&
//   //       Math.abs(lastPos.lat - lat) < 0.0001 &&
//   //       Math.abs(lastPos.lng - lng) < 0.0001
//   //     ) {
//   //       return; // Skip if position hasn't changed enough
//   //     }

//   //     // Update last position
//   //     lastDragPositionRef.current = { lat, lng };
//   //     updateAddressFromCoords(lat, lng);
//   //   }
//   // }, [updateAddressFromCoords]);

//   useEffect(() => {
//     if (defaultCountry) handleSearch();
//   }, [defaultCountry, handleSearch]);

//   useEffect(() => {
//     if (filter.latitude && filter.longitude) {
//       const newPos = {
//         lat: Number(filter.latitude),
//         lng: Number(filter.longitude),
//       };
//       setMapCenter(newPos);
//       updateAddressFromCoords(newPos.lat, newPos.lng);
//     }
//   }, [filter.latitude, filter.longitude, updateAddressFromCoords]);

//   // Implement debounced search
//   useEffect(() => {
//     // Clear any existing timeout
//     if (searchTimeoutRef.current) {
//       clearTimeout(searchTimeoutRef.current);
//     }

//     // Skip if search query is empty or same as previous
//     if (!searchQuery.trim() || searchQuery === prevSearchQueryRef.current) {
//       return;
//     }

//     // Set a timeout for debouncing
//     searchTimeoutRef.current = setTimeout(() => {
//       handleSearch();
//     }, 800); // 800ms debounce

//     return () => {
//       if (searchTimeoutRef.current) {
//         clearTimeout(searchTimeoutRef.current);
//       }
//     };
//   }, [searchQuery, handleSearch]);

//   return (
//     <div className="flex flex-col gap-3">
//       <div className="relative w-full">
//         <Input
//           placeholder={t("search")}
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="pr-10 h-[48px] rounded-[12px] border-[var(--lightBorderColor)]"
//         />
//         <Search
//           className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
//           onClick={handleSearch}
//         />
//       </div>

//       {isLoaded && window.google && (
//         <GoogleMap
//           mapContainerStyle={containerStyle}
//           center={mapCenter}
//           zoom={5} // Increased zoom for better country view
//           onLoad={onLoad}
//           // onDragEnd={handleMapDragEnd}
//           options={{
//             streetViewControl: false,
//             mapTypeControl: false,
//             fullscreenControl: false,
//           }}
//         >
//           <Marker
//             onLoad={(marker) => (markerRef.current = marker)}
//             position={mapCenter}
//             draggable
//             onDragEnd={handleMarkerDragEnd}
//           />
//         </GoogleMap>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Country } from "@/types/country";
import { toast } from "sonner";

const LIBRARIES = ["places"] as const;
const THROTTLE_DELAY = 1000;

const containerStyle = {
  borderRadius: "16px",
  width: "100%",
  height: "300px",
};

type Props = {
  countryData: Country | undefined;
  onChange?: (pos: { lat: number; lng: number; address?: string }) => void;
  debug?: boolean;
};

// Simple logger helper
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const log = (enabled: boolean, ...args: any[]) => {
  if (enabled) console.log(...args);
};

export default function LocationSearchMap({
  countryData,
  onChange,
  debug = false,
}: Props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: countryData?.center_lat ?? 0,
    lng: countryData?.center_lng ?? 0,
  });
  const [searchQuery, setSearchQuery] = useState(countryData?.title ?? "");

  const t = useTranslations("common");
  const locale = useLocale();

  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const lastValidPos = useRef<{ lat: number; lng: number; address: string }>({
    lat: countryData?.center_lat ?? 0,
    lng: countryData?.center_lng ?? 0,
    address: countryData?.title ?? "",
  });

  const geocodeThrottle = useRef<number>(0);
  const isUpdating = useRef<boolean>(false);

  // ------------------------------------
  // ✅ Load Google Maps once
  // ------------------------------------
  useEffect(() => {
    if (typeof window !== "undefined" && window.google?.maps) {
      log(debug, "[Init] Google Maps already loaded.");
      setIsLoaded(true);
      return;
    }

    const existingScript = document.getElementById("google-maps-script");
    if (existingScript) {
      existingScript.addEventListener("load", () => setIsLoaded(true));
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=${LIBRARIES.join(",")}&language=${locale}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      log(debug, "[Init] Google Maps script loaded.");
      setIsLoaded(true);
    };
    script.onerror = () => toast.error(t("failed_to_load_google_maps"));
    document.head.appendChild(script);
  }, [locale, t, debug]);

  // ------------------------------------
  // ✅ On map load
  // ------------------------------------
  const onLoad = useCallback(
    (map: google.maps.Map) => {
      log(debug, "[Map] Loaded");
      mapRef.current = map;
    },
    [debug]
  );

  // ------------------------------------
  // ✅ When country changes → center + input sync
  // ------------------------------------
  useEffect(() => {
    if (!countryData || !isLoaded) return;

    const newCenter = {
      lat: countryData.center_lat,
      lng: countryData.center_lng,
    };

    // only update if actual change
    setMapCenter((prev) => {
      if (
        Math.abs(prev.lat - newCenter.lat) < 1e-5 &&
        Math.abs(prev.lng - newCenter.lng) < 1e-5
      ) {
        return prev; // no change → no render
      }
      return newCenter;
    }); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryData?.id, isLoaded]);

  // ------------------------------------
  //  Reverse geocode by coordinates
  // ------------------------------------
  const updateAddressFromCoords = useCallback(
    (lat: number, lng: number) => {
      if (!isLoaded || !google.maps.Geocoder) return;
      if (isUpdating.current) return;

      const now = Date.now();
      if (now - geocodeThrottle.current < THROTTLE_DELAY) return;
      geocodeThrottle.current = now;
      isUpdating.current = true;

      log(debug, "[Geocode] Requesting reverse geocode for:", { lat, lng });

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        isUpdating.current = false;
        if (status !== "OK" || !results?.[0]) {
          toast.error(t("geocode_failed"));
          revertToLastValid();
          return;
        }

        const address = results[0].formatted_address;
        const detectedCountry =
          results[0].address_components.find((c) => c.types.includes("country"))
            ?.short_name || "";

        log(
          debug,
          "[Geocode] Got address:",
          address,
          "Country:",
          detectedCountry
        );

        if (countryData?.code && detectedCountry !== countryData.code) {
          toast.error(
            t("outside_country_warning") || "Outside selected country"
          );
          revertToLastValid();
          return;
        }

        const newPos = { lat, lng, address };
        setMapCenter(newPos);
        setSearchQuery(address);
        lastValidPos.current = newPos;
        onChange?.(newPos);
      });
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoaded, onChange, countryData?.code, t, debug]
  );

  // ------------------------------------
  //  Forward geocode search input
  // ------------------------------------
  const handleSearch = useCallback(() => {
    if (!isLoaded || !searchQuery.trim() || !google.maps.Geocoder) return;

    log(debug, "[Search] Searching for:", searchQuery);
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: searchQuery }, (results, status) => {
      if (status !== "OK" || !results?.[0]) {
        toast.error(t("location_not_found"));
        revertToLastValid();
        return;
      }

      const result = results[0];
      const location = result.geometry.location;
      const address = result.formatted_address;
      const detectedCountry =
        result.address_components.find((c) => c.types.includes("country"))
          ?.short_name || "";

      log(debug, "[Search] Found:", address, "Country:", detectedCountry);

      if (countryData?.code && detectedCountry !== countryData.code) {
        toast.error(t("outside_country_warning") || "Outside selected country");
        revertToLastValid();
        return;
      }

      const newPos = { lat: location.lat(), lng: location.lng(), address };
      setMapCenter(newPos);
      setSearchQuery(address);
      lastValidPos.current = newPos;
      onChange?.(newPos);

      mapRef.current?.panTo(newPos);
      markerRef.current?.setPosition(newPos);
    }); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, searchQuery, onChange, countryData?.code, t, debug]);

  // ------------------------------------
  //  Handle marker drag
  // ------------------------------------
  const handleMarkerDragEnd = useCallback(
    (e: google.maps.MapMouseEvent) => {
      const lat = e.latLng?.lat();
      const lng = e.latLng?.lng();
      if (!lat || !lng) return;
      log(debug, "[Marker] Drag end:", { lat, lng });
      updateAddressFromCoords(lat, lng);
    },
    [updateAddressFromCoords, debug]
  );

  // ------------------------------------
  //  Revert to last valid
  // ------------------------------------
  const revertToLastValid = useCallback(() => {
    const pos = lastValidPos.current;
    log(debug, "[Revert] Reverting to last valid:", pos);
    setMapCenter({ lat: pos.lat, lng: pos.lng });
    setSearchQuery(pos.address);
    onChange?.(pos);
    mapRef.current?.panTo({ lat: pos.lat, lng: pos.lng });
    markerRef.current?.setPosition({ lat: pos.lat, lng: pos.lng });
  }, [onChange, debug]);

  return (
    <div className="flex flex-col gap-3">
      {/* Search input */}
      <div className="relative w-full">
        <Input
          placeholder={t("search")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10 h-[48px] rounded-[12px] border-[var(--lightBorderColor)]"
        />
        <Search
          onClick={handleSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
        />
      </div>

      {/* Map */}
      {isLoaded && window.google && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={6}
          onLoad={onLoad}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          <Marker
            onLoad={(m) => (markerRef.current = m)}
            position={mapCenter}
            draggable
            onDragEnd={handleMarkerDragEnd}
          />
        </GoogleMap>
      )}
    </div>
  );
}
