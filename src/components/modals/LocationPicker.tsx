// "use client";

// import { useEffect, useState, useRef, useCallback } from "react";
// import { GoogleMap, Marker } from "@react-google-maps/api";
// import { Input } from "@/components/ui/input";
// import { Search } from "lucide-react";
// import { useTranslations, useLocale } from "next-intl";
// import { Country } from "@/types/country";
// import { toast } from "sonner";
// import { getCookie } from "@/lib/utils";

// const LIBRARIES = ["places"] as const;
// const THROTTLE_DELAY = 1000;

// const containerStyle = {
//   borderRadius: "16px",
//   width: "100%",
//   height: "300px",
// };

// type Props = {
//   countryData: Country | undefined;
//   onChange?: (pos: { lat: number; lng: number; address?: string }) => void;
//   debug?: boolean;
// };

// // Simple logger helper
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// const log = (enabled: boolean, ...args: any[]) => {
//   if (enabled) console.log(...args);
// };

// export default function LocationSearchMap({
//   countryData,
//   onChange,
//   debug = false,
// }: Props) {
//   const [isLoaded, setIsLoaded] = useState(false);

//   const latCookies = getCookie("latitude");
//   const lngCookies = getCookie("longitude");
//   const addressCookies = decodeURIComponent(getCookie("address") || "");
//   const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
//     lat: countryData?.center_lat ?? 0,
//     lng: countryData?.center_lng ?? 0,
//   });
//   const [searchQuery, setSearchQuery] = useState(countryData?.title ?? "");

//   const t = useTranslations("common");
//   const locale = useLocale();

//   const mapRef = useRef<google.maps.Map | null>(null);
//   const markerRef = useRef<google.maps.Marker | null>(null);
//   const lastValidPos = useRef<{ lat: number; lng: number; address: string }>({
//     lat: countryData?.center_lat ?? 0,
//     lng: countryData?.center_lng ?? 0,
//     address: countryData?.title ?? "",
//   });
//   // console.log("location picker countryData " , countryData );

//   const geocodeThrottle = useRef<number>(0);
//   const isUpdating = useRef<boolean>(false);

//   // ------------------------------------
//   // ✅ Load Google Maps once
//   // ------------------------------------
//   useEffect(() => {
//     if (typeof window !== "undefined" && window.google?.maps) {
//       log(debug, "[Init] Google Maps already loaded.");
//       setIsLoaded(true);
//       return;
//     }

//     const existingScript = document.getElementById("google-maps-script");
//     if (existingScript) {
//       existingScript.addEventListener("load", () => setIsLoaded(true));
//       return;
//     }

//     const script = document.createElement("script");
//     script.id = "google-maps-script";
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=${LIBRARIES.join(",")}&language=${locale}`;
//     script.async = true;
//     script.defer = true;
//     script.onload = () => {
//       log(debug, "[Init] Google Maps script loaded.");
//       setIsLoaded(true);
//     };
//     script.onerror = () => toast.error(t("failed_to_load_google_maps"));
//     document.head.appendChild(script);
//   }, [locale, t, debug]);

//   // ------------------------------------
//   // ✅ On map load
//   // ------------------------------------
//   const onLoad = useCallback(
//     (map: google.maps.Map) => {
//       log(debug, "[Map] Loaded");
//       mapRef.current = map;
//     },
//     [debug]
//   );

//   // ------------------------------------
//   // ✅ When country changes → center + input sync
//   // ------------------------------------
//   useEffect(() => {
//     if (!countryData || !isLoaded) return;

//     const newCenter = {
//       lat: countryData.center_lat,
//       lng: countryData.center_lng,
//     };

//     // only update if actual change
//     setMapCenter((prev) => {
//       if (
//         Math.abs(prev.lat - newCenter.lat) < 1e-5 &&
//         Math.abs(prev.lng - newCenter.lng) < 1e-5
//       ) {
//         return prev; // no change → no render
//       }
//       return newCenter;
//     }); // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [countryData?.id, isLoaded]);

//   // ------------------------------------
//   //  Reverse geocode by coordinates
//   // ------------------------------------
//   const updateAddressFromCoords = useCallback(
//     (lat: number, lng: number) => {
//       if (!isLoaded || !google.maps.Geocoder) return;
//       if (isUpdating.current) return;

//       const now = Date.now();
//       if (now - geocodeThrottle.current < THROTTLE_DELAY) return;
//       geocodeThrottle.current = now;
//       isUpdating.current = true;

//       log(debug, "[Geocode] Requesting reverse geocode for:", { lat, lng });

//       const geocoder = new google.maps.Geocoder();
//       geocoder.geocode({ location: { lat, lng } }, (results, status) => {
//         isUpdating.current = false;
//         if (status !== "OK" || !results?.[0]) {
//           toast.error(t("geocode_failed"));
//           revertToLastValid();
//           return;
//         }

//         const address = results[0].formatted_address;
//         const detectedCountry =
//           results[0].address_components.find((c) => c.types.includes("country"))
//             ?.short_name || "";

//         // const detectedShortName = results[0].address_components[0].short_name || "";
//         // console.log("address , detected country" , address , "==========detected country============", detectedCountry ,"====results=======", results , detectedShortName);

//         log(
//           debug,
//           "[Geocode] Got address:",
//           address,
//           "Country:",
//           detectedCountry
//         );

//         if (countryData?.code && detectedCountry !== countryData.code) {
//           toast.error(t("outside_country") || "Outside selected country");
//           revertToLastValid();
//           return;
//         }

//         const newPos = { lat, lng, address };
//         setMapCenter(newPos);
//         setSearchQuery(address);
//         lastValidPos.current = newPos;
//         onChange?.(newPos);
//       });
//     }, // eslint-disable-next-line react-hooks/exhaustive-deps
//     [isLoaded, onChange, countryData?.code, t, debug]
//   );

//   // ------------------------------------
//   //  Forward geocode search input
//   // ------------------------------------
//   const handleSearch = useCallback(() => {
//     if (!isLoaded || !searchQuery.trim() || !google.maps.Geocoder) return;

//     log(debug, "[Search] Searching for:", searchQuery);
//     const geocoder = new google.maps.Geocoder();

//     geocoder.geocode({ address: searchQuery }, (results, status) => {
//       if (status !== "OK" || !results?.[0]) {
//         toast.error(t("location_not_found"));
//         revertToLastValid();
//         return;
//       }

//       const result = results[0];
//       const location = result.geometry.location;
//       const address = result.formatted_address;
//       const detectedCountry =
//         result.address_components.find((c) => c.types.includes("country"))
//           ?.short_name || "";

//       log(debug, "[Search] Found:", address, "Country:", detectedCountry);

//       if (countryData?.code && detectedCountry !== countryData.code) {
//         toast.error(t("outside_country") || "Outside selected country");
//         revertToLastValid();
//         return;
//       }

//       const newPos = { lat: location.lat(), lng: location.lng(), address };
//       setMapCenter(newPos);
//       setSearchQuery(address);
//       lastValidPos.current = newPos;
//       onChange?.(newPos);

//       mapRef.current?.panTo(newPos);
//       markerRef.current?.setPosition(newPos);
//     }); // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isLoaded, searchQuery, onChange, countryData?.code, t, debug]);

//   // ------------------------------------
//   //  Handle marker drag
//   // ------------------------------------
//   const handleMarkerDragEnd = useCallback(
//     (e: google.maps.MapMouseEvent) => {
//       const lat = e.latLng?.lat();
//       const lng = e.latLng?.lng();
//       if (!lat || !lng) return;
//       log(debug, "[Marker] Drag end:", { lat, lng });
//       updateAddressFromCoords(lat, lng);
//     },
//     [updateAddressFromCoords, debug]
//   );

//   // ------------------------------------
//   //  Revert to last valid
//   // ------------------------------------
//   const revertToLastValid = useCallback(() => {
//     const pos = lastValidPos.current;
//     log(debug, "[Revert] Reverting to last valid:", pos);
//     setMapCenter({ lat: pos.lat, lng: pos.lng });
//     setSearchQuery(pos.address);
//     onChange?.(pos);
//     mapRef.current?.panTo({ lat: pos.lat, lng: pos.lng });
//     markerRef.current?.setPosition({ lat: pos.lat, lng: pos.lng });
//   }, [onChange, debug]);

//   return (
//     <div className="flex flex-col gap-3">
//       {/* Search input */}
//       <div className="relative w-full">
//         <Input
//           placeholder={t("search")}
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="pr-10 h-[48px] rounded-[12px] border-[var(--lightBorderColor)]"
//         />
//         <Search
//           onClick={handleSearch}
//           className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
//         />
//       </div>

//       {/* Map */}
//       {isLoaded && window.google && (
//         <GoogleMap
//           mapContainerStyle={containerStyle}
//           center={mapCenter}
//           zoom={6}
//           onLoad={onLoad}
//           options={{
//             streetViewControl: false,
//             mapTypeControl: false,
//             fullscreenControl: false,
//           }}
//         >
//           <Marker
//             onLoad={(m) => (markerRef.current = m)}
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
import { getCookie } from "@/lib/utils";

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
};

export default function LocationSearchMap({
  countryData,
  onChange,
}: Props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const t = useTranslations("common");
  const locale = useLocale();

  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const geocodeThrottle = useRef<number>(0);
  const isUpdating = useRef<boolean>(false);
  const isInitialLoad = useRef(true);
  const lastCountryId = useRef<number | null>(null);
  const hasManuallySelected = useRef(false);

  // Read cookies once on mount
  const initialCookieValues = useRef({
    lat: getCookie("latitude") ? parseFloat(getCookie("latitude")!) : null,
    lng: getCookie("longitude") ? parseFloat(getCookie("longitude")!) : null,
    address: decodeURIComponent(getCookie("address") || ""),
    countryId: getCookie("countryId"),
  });

  // Check if country has changed from cookies
  const isCountryDifferentFromCookie =
    countryData?.id &&
    initialCookieValues.current.countryId &&
    countryData.id.toString() !== initialCookieValues.current.countryId;

  // Initialize state with priority logic
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(
    isCountryDifferentFromCookie
      ? {
          lat: countryData?.center_lat ?? 0,
          lng: countryData?.center_lng ?? 0,
        }
      : initialCookieValues.current.lat && initialCookieValues.current.lng
      ? {
          lat: initialCookieValues.current.lat,
          lng: initialCookieValues.current.lng,
        }
      : {
          lat: countryData?.center_lat ?? 0,
          lng: countryData?.center_lng ?? 0,
        }
  );

  const [searchQuery, setSearchQuery] = useState(
    isCountryDifferentFromCookie
      ? countryData?.title || ""
      : initialCookieValues.current.address || countryData?.title || ""
  );

  const lastValidPos = useRef<{ lat: number; lng: number; address: string }>(
    isCountryDifferentFromCookie
      ? {
          lat: countryData?.center_lat ?? 0,
          lng: countryData?.center_lng ?? 0,
          address: countryData?.title ?? "",
        }
      : initialCookieValues.current.lat && initialCookieValues.current.lng
      ? {
          lat: initialCookieValues.current.lat,
          lng: initialCookieValues.current.lng,
          address: initialCookieValues.current.address || countryData?.title || "",
        }
      : {
          lat: countryData?.center_lat ?? 0,
          lng: countryData?.center_lng ?? 0,
          address: countryData?.title ?? "",
        }
  );

  // Load Google Maps script
  useEffect(() => {
    if (typeof window !== "undefined" && window.google?.maps) {
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
    script.onload = () => setIsLoaded(true);
    script.onerror = () => toast.error(t("failed_to_load_google_maps"));
    document.head.appendChild(script);
  }, [locale, t]);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // Handle country changes
  useEffect(() => {
    if (!countryData || !isLoaded) return;

    const currentCountryId = countryData.id;
    const isCountryChange = lastCountryId.current !== null && lastCountryId.current !== currentCountryId;

    // Skip update on initial load if we have cookies AND it's not a country change
    if (isInitialLoad.current && initialCookieValues.current.lat && initialCookieValues.current.lng && !isCountryChange) {
      isInitialLoad.current = false;
      lastCountryId.current = currentCountryId;
      return;
    }

    // If user has manually selected a location and country hasn't changed, don't reset
    if (hasManuallySelected.current && !isCountryChange) {
      return;
    }

    isInitialLoad.current = false;
    lastCountryId.current = currentCountryId;

    const countryCenter = {
      lat: countryData.center_lat,
      lng: countryData.center_lng,
    };

    setMapCenter(countryCenter);
    setSearchQuery(countryData.title || "");

    lastValidPos.current = {
      lat: countryCenter.lat,
      lng: countryCenter.lng,
      address: countryData.title || "",
    };

    if (onChange) {
      onChange({
        lat: countryCenter.lat,
        lng: countryCenter.lng,
        address: countryData.title || "",
      });
    }

    // Only reset zoom when actually changing countries
    if (isCountryChange) {
      hasManuallySelected.current = false;
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.setCenter(countryCenter);
          mapRef.current.setZoom(6);
        }
        if (markerRef.current) {
          markerRef.current.setPosition(countryCenter);
        }
      }, 100);
    }
  }, [countryData, isLoaded, onChange]);

  // Reverse geocode by coordinates
  const updateAddressFromCoords = useCallback(
    (lat: number, lng: number) => {
      if (!isLoaded || !google.maps.Geocoder || isUpdating.current) return;

      const now = Date.now();
      if (now - geocodeThrottle.current < THROTTLE_DELAY) return;
      geocodeThrottle.current = now;
      isUpdating.current = true;

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

        if (countryData?.code && detectedCountry !== countryData.code) {
          toast.error(t("outside_country") || "Outside selected country");
          revertToLastValid();
          return;
        }

        hasManuallySelected.current = true;
        const newPos = { lat, lng, address };
        setMapCenter(newPos);
        setSearchQuery(address);
        lastValidPos.current = newPos;
        onChange?.(newPos);
      });
    },
    [isLoaded, onChange, countryData?.code, t]
  );

  // Forward geocode search input
  const handleSearch = useCallback(() => {
    if (!isLoaded || !searchQuery.trim() || !google.maps.Geocoder) return;

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

      if (countryData?.code && detectedCountry !== countryData.code) {
        toast.error(t("outside_country") || "Outside selected country");
        revertToLastValid();
        return;
      }

      hasManuallySelected.current = true;
      const newPos = { lat: location.lat(), lng: location.lng(), address };
      setMapCenter(newPos);
      setSearchQuery(address);
      lastValidPos.current = newPos;
      onChange?.(newPos);

      if (mapRef.current) {
        mapRef.current.panTo(newPos);
      }
      if (markerRef.current) {
        markerRef.current.setPosition(newPos);
      }
    });
  }, [isLoaded, searchQuery, onChange, countryData?.code, t]);

  // Handle marker drag
  const handleMarkerDragEnd = useCallback(
    (e: google.maps.MapMouseEvent) => {
      const lat = e.latLng?.lat();
      const lng = e.latLng?.lng();
      if (!lat || !lng) return;
      updateAddressFromCoords(lat, lng);
    },
    [updateAddressFromCoords]
  );

  // Revert to last valid position
  const revertToLastValid = useCallback(() => {
    const pos = lastValidPos.current;
    setMapCenter({ lat: pos.lat, lng: pos.lng });
    setSearchQuery(pos.address);
    onChange?.(pos);
    if (mapRef.current) {
      mapRef.current.panTo({ lat: pos.lat, lng: pos.lng });
    }
    if (markerRef.current) {
      markerRef.current.setPosition({ lat: pos.lat, lng: pos.lng });
    }
  }, [onChange]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative w-full">
        <Input
          placeholder={t("search")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          className="pr-10 h-[48px] rounded-[12px] border-[var(--lightBorderColor)]"
        />
        <Search
          onClick={handleSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
        />
      </div>

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
            onLoad={(m) => {
              markerRef.current = m;
            }}
            position={mapCenter}
            draggable
            onDragEnd={handleMarkerDragEnd}
          />
        </GoogleMap>
      )}
    </div>
  );
}