"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { toast } from "sonner";
import { getCoordinates } from "@/utils/getCoordinatesByZipCode";
import { useTranslations, useLocale } from "next-intl";
import { Country } from "@/types/country";
type GeocodeCacheEntry = {
  lat?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
  address?: string;
  results?: google.maps.GeocoderResult[];
  status?: google.maps.GeocoderStatus;
};

const containerStyle = {
  borderRadius: "16px",
  width: "100%",
  height: "300px",
};

declare global {
  interface Window {
    google: typeof google;
    initMapScriptLoaded?: boolean;
  }
}

export default function ZipMapSearch({
  country,
  countryId,
}: {
  country: Country;
  countryId: string | undefined;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const { watch, setValue } = useFormContext();

  // Form values
  const zipCode = watch("zip_code");
  const savedLat = watch("latitude");
  const savedLng = watch("longitude");
  const savedAddress = watch("address");
  const countryChanged = watch("country_changed"); // Track country changes

  // State
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(
    () => ({
      lat: country?.center_lat || 0,
      lng: country?.center_lng || 0,
    })
  );
  const [searchValue, setSearchValue] = useState("");
  const [lastZip, setLastZip] = useState("");
  const [, setSelectCountryBounds] = useState(country?.code || "");
  const [lastValidPosition, setLastValidPosition] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: country?.center_lat || 0,
    lng: country?.center_lng || 0,
  });
  const [lastValidAddress, setLastValidAddress] = useState("");

  // Refs
  const mapRef = useRef<google.maps.Map | null>(null);
  const isInitializedRef = useRef(false);
  const isUpdatingRef = useRef(false);
  const previousCountryCodeRef = useRef(country?.code);

  // ============================================
  // SECTION 1: Google Maps Script Loading
  // ============================================
  useEffect(() => {
    // If already loaded, set state and return
    if (typeof window !== "undefined" && window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    // If script exists, wait for it to load
    const existingScript = document.getElementById("google-maps-script");
    if (existingScript) {
      existingScript.addEventListener("load", () => setIsLoaded(true));
      return;
    }

    // Load new script
    const loadGoogleMaps = () => {
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.id = "google-maps-script";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&language=${locale}`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = (err) => reject(err);
        document.head.appendChild(script);
      });
    };

    loadGoogleMaps()
      .then(() => setIsLoaded(true))
      .catch(() => toast.error("Failed to load Google Maps"));
  }, [locale]);

  // ============================================
  // SECTION 2: Handle Country Change - Reset map to new country center
  // ============================================
  useEffect(() => {
    if (!country?.code || !country?.center_lat || !country?.center_lng) return;

    // Force update when country changes or countryChanged is updated
    if (previousCountryCodeRef.current !== country.code || countryChanged) {
      const newCenter = {
        lat: country.center_lat,
        lng: country.center_lng,
      };

      // Reset map to new country center
      setMapCenter(newCenter);
      setLastValidPosition(newCenter);
      setSelectCountryBounds(country.code);

      // Clear previous location data
      setSearchValue("");
      setLastValidAddress("");
      setValue("latitude", newCenter.lat);
      setValue("longitude", newCenter.lng);
      setValue("address", "");
      setLastZip("");

      // Reset initialization flag to allow geolocation for new country
      isInitializedRef.current = false;

      // Update ref to track current country
      previousCountryCodeRef.current = country.code;

      // Pan map if it's already loaded
      if (mapRef.current) {
        mapRef.current.panTo(newCenter);
        mapRef.current.setZoom(6); // Set appropriate zoom level for country view
      }
    }
  }, [country, setValue, countryChanged]);
  // ============================================
  // CORE FUNCTION: Convert coordinates to address & validate country
  // ============================================
  // Cache for geocoding results
  const geocodeCache = useRef<Record<string, GeocodeCacheEntry>>({});

  // Timestamp for throttling
  const lastGeocodeTimestampRef = useRef<number>(0);
  // Minimum time between geocode requests (in ms)
  const THROTTLE_DELAY = 1000;

  const updateAddressFromCoords = useCallback(
    async (lat: number, lng: number, preFetchedAddress?: string) => {
      // Skip if already updating or coordinates are invalid
      if (isUpdatingRef.current || !lat || !lng) return;

      // Round coordinates to 6 decimal places for caching
      const roundedLat = Math.round(lat * 1000000) / 1000000;
      const roundedLng = Math.round(lng * 1000000) / 1000000;
      const cacheKey = `${roundedLat},${roundedLng}`;

      // Check if we're making requests too frequently
      const now = Date.now();
      if (now - lastGeocodeTimestampRef.current < THROTTLE_DELAY) {
        return;
      }

      // Set updating flag
      isUpdatingRef.current = true;
      lastGeocodeTimestampRef.current = now;

      try {
        // Check cache first
        if (geocodeCache.current[cacheKey] && !preFetchedAddress) {
          const cachedResult = geocodeCache.current[cacheKey];
          handleGeocodeResult(
            cachedResult.results ?? null,
            cachedResult.status ?? google.maps.GeocoderStatus.ERROR,
            roundedLat,
            roundedLng,
            cachedResult.address
          );
          isUpdatingRef.current = false;
          return;
        }

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode(
          { location: { lat: roundedLat, lng: roundedLng } },
          (results, status) => {
            let address = preFetchedAddress;
            if (!address && status === "OK" && results && results[0]) {
              address = results[0].formatted_address;
            }

            // Cache the result
            if (status === "OK" && results && results[0]) {
              geocodeCache.current[cacheKey] = {
                results,
                status,
                address,
              };
            }

            handleGeocodeResult(
              results,
              status,
              roundedLat,
              roundedLng,
              address
            );
            isUpdatingRef.current = false;
          }
        );
      } catch (error) {
        console.error("Geocoding error:", error);
        toast.error("Geocode failed");
        isUpdatingRef.current = false;
      }
    },
    [country?.code, lastValidAddress, lastValidPosition, setValue, t]
  );

  // Helper function to handle geocode results
  const handleGeocodeResult = useCallback(
    (
      results: google.maps.GeocoderResult[] | null,
      status: google.maps.GeocoderStatus,
      lat: number,
      lng: number,
      address?: string
    ) => {
      if (status === "OK" && results && results[0]) {
        const bounds = results
          .flatMap((res) =>
            res.address_components
              .filter((add) => add.types.includes("country"))
              .map((add) => add.short_name)
          )
          .filter(Boolean);

        const detectedCountry = bounds[0] ?? "";

        // If not initialized yet, just store the location without country validation
        if (!isInitializedRef.current) {
          setMapCenter({ lat, lng });
          setValue("latitude", lat);
          setValue("longitude", lng);
          setValue("address", address || "");
          setSearchValue(address || "");
          setSelectCountryBounds(detectedCountry);
          setLastValidPosition({ lat, lng });
          setLastValidAddress(address || "");
          isInitializedRef.current = true;
          return;
        }

        // Validate country after initial setup
        if (detectedCountry === "" || detectedCountry !== country?.code) {
          toast.error("You are outside the selected country");

          // Return to last valid position
          if (mapRef.current) {
            mapRef.current.panTo(lastValidPosition);
          }
          setMapCenter(lastValidPosition);
          setValue("latitude", lastValidPosition.lat);
          setValue("longitude", lastValidPosition.lng);
          setValue("address", lastValidAddress);
          setSearchValue(lastValidAddress);
        } else {
          // Location is within country boundaries
          setMapCenter({ lat, lng });
          setValue("latitude", lat);
          setValue("longitude", lng);
          setValue("address", address || "");
          setSearchValue(address || "");
          setSelectCountryBounds(detectedCountry);
          setLastValidPosition({ lat, lng });
          setLastValidAddress(address || "");
        }
      } else {
        toast.error("Geocode failed");
        if (mapRef.current) {
          mapRef.current.panTo(lastValidPosition);
        }
        setMapCenter(lastValidPosition);
        setValue("latitude", lastValidPosition.lat);
        setValue("longitude", lastValidPosition.lng);
        setValue("address", lastValidAddress);
        setSearchValue(lastValidAddress);
      }
    },
    [country?.code, lastValidAddress, lastValidPosition, setValue, t]
  );

  // ============================================
  // SECTION 3: Show saved address in search field (Edit Profile)
  // ============================================
  useEffect(() => {
    if (savedAddress && !searchValue) {
      setSearchValue(savedAddress);
      setLastValidAddress(savedAddress);
    }
  }, [savedAddress, searchValue]);

  // ============================================
  // SECTION 4: Initialize with saved coordinates (Edit Profile)
  // ============================================
  useEffect(() => {
    if (!isLoaded || isInitializedRef.current) return;

    const latNum = Number(savedLat);
    const lngNum = Number(savedLng);

    if (!isNaN(latNum) && !isNaN(lngNum) && latNum !== 0 && lngNum !== 0) {
      const pos = { lat: latNum, lng: lngNum };
      setMapCenter(pos);
      setLastValidPosition(pos);
      // Ensure address is resolved
      updateAddressFromCoords(latNum, lngNum);
      isInitializedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedLat, savedLng, isLoaded]);

  // ============================================
  // SECTION 5: Get current location (Initial Load)
  // ============================================
  useEffect(() => {
    if (!isLoaded || isInitializedRef.current) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          updateAddressFromCoords(lat, lng);
          isInitializedRef.current = true;
        },
        () => {
          const lat = country?.center_lat ?? 56.58856249999999;
          const lng = country?.center_lng ?? -66.3980625;
          updateAddressFromCoords(lat, lng);
          isInitializedRef.current = true;
        }
      );
    }
  }, [country, countryId, isLoaded]);

  // ============================================
  // SECTION 6: Fetch coordinates from ZIP code (with debounce)
  // ============================================
  const zipCodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timeout
    if (zipCodeTimeoutRef.current) {
      clearTimeout(zipCodeTimeoutRef.current);
    }

    // Skip if ZIP code is empty or hasn't changed
    if (!zipCode || zipCode === lastZip) return;

    // Check cache for this ZIP code
    const cacheKey = `zip_${zipCode}`;
    if (geocodeCache.current[cacheKey]) {
      const cachedResult = geocodeCache.current[cacheKey];
      if (cachedResult.latitude !== undefined && cachedResult.longitude !== undefined) {
        updateAddressFromCoords(
          cachedResult.latitude,
          cachedResult.longitude,
          cachedResult.address
        );
      }
      setLastZip(zipCode);
      return;
    }

    // Debounce ZIP code lookup to prevent rapid API calls
    zipCodeTimeoutRef.current = setTimeout(async () => {
      // Only proceed if we're not updating and enough time has passed
      if (
        isUpdatingRef.current ||
        Date.now() - lastGeocodeTimestampRef.current < THROTTLE_DELAY
      ) {
        return;
      }

      const result = await getCoordinates(zipCode);
      if (result) {
        // Cache the result
        geocodeCache.current[cacheKey] = result;

        updateAddressFromCoords(
          result.latitude,
          result.longitude,
          result.address
        );
        setLastZip(zipCode);
      } else {
        toast.error(t("auth.zipcode_error"));
      }
    }, 800); // Debounce time for ZIP code changes

    return () => {
      if (zipCodeTimeoutRef.current) {
        clearTimeout(zipCodeTimeoutRef.current);
      }
    };
  }, [zipCode, lastZip, t, updateAddressFromCoords]);

  // ============================================
  // SECTION 7: Interactive search while typing (Debounced)
  // ============================================
  // Store previous search value to prevent duplicate searches
  const prevSearchValueRef = useRef<string>("");

  useEffect(() => {
    // Skip if search value hasn't changed significantly or is empty
    if (!searchValue.trim() || !window.google || !isLoaded) return;

    // Skip if the search value is too similar to previous search
    if (searchValue.trim() === prevSearchValueRef.current) return;

    // Use a longer debounce time to reduce API calls
    const delayDebounce = setTimeout(() => {
      // Update previous search value
      prevSearchValueRef.current = searchValue.trim();

      // Check cache for this search term
      const cacheKey = `search_${searchValue.trim()}`;
      if (geocodeCache.current[cacheKey]) {
        const cachedResult = geocodeCache.current[cacheKey];
        if (typeof cachedResult.lat === 'number' && typeof cachedResult.lng === 'number') {
          updateAddressFromCoords(cachedResult.lat, cachedResult.lng, cachedResult.address);
          return;
        }
      }

      // Only proceed if we're not updating and enough time has passed
      if (
        isUpdatingRef.current ||
        Date.now() - lastGeocodeTimestampRef.current < THROTTLE_DELAY
      ) {
        return;
      }

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: searchValue.trim() }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const loc = results[0].geometry.location;
          const lat = loc.lat();
          const lng = loc.lng();
          const address = results[0].formatted_address;

          // Cache this search result
          geocodeCache.current[cacheKey] = {
            lat,
            lng,
            address,
          };

          updateAddressFromCoords(lat, lng, address);
        }
      });
    }, 1000); // Increased debounce time from 600ms to 1000ms

    return () => clearTimeout(delayDebounce);
  }, [searchValue, isLoaded, updateAddressFromCoords]);

  // ============================================
  // EVENT HANDLERS
  // ============================================
  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // Track last drag position to prevent redundant updates
  const lastDragPositionRef = useRef<{ lat: number; lng: number } | null>(null);

  const handleMarkerDragEnd = useCallback(
    (e: google.maps.MapMouseEvent) => {
      const lat = e.latLng?.lat();
      const lng = e.latLng?.lng();

      if (lat && lng) {
        // Check if position has changed significantly (at least 0.0001 degree difference)
        const lastPos = lastDragPositionRef.current;
        if (
          lastPos &&
          Math.abs(lastPos.lat - lat) < 0.0001 &&
          Math.abs(lastPos.lng - lng) < 0.0001
        ) {
          return; // Skip if position hasn't changed enough
        }

        // Update last position
        lastDragPositionRef.current = { lat, lng };
        updateAddressFromCoords(lat, lng);
      }
    },
    [updateAddressFromCoords]
  );

  // const handleMapDragEnd = useCallback(() => {
  //   const newCenter = mapRef.current?.getCenter();
  //   if (newCenter) {
  //     const lat = newCenter.lat();
  //     const lng = newCenter.lng();

  //     // Check if position has changed significantly
  //     const lastPos = lastDragPositionRef.current;
  //     if (lastPos &&
  //         Math.abs(lastPos.lat - lat) < 0.0001 &&
  //         Math.abs(lastPos.lng - lng) < 0.0001) {
  //       return; // Skip if position hasn't changed enough
  //     }

  //     // Update last position
  //     lastDragPositionRef.current = {lat, lng};
  //     updateAddressFromCoords(lat, lng);
  //   }
  // }, [updateAddressFromCoords]);

  // Remove debug logging for production

  // ============================================
  // RENDER
  // ============================================
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setSearchValue(newValue);

      // If input is empty, clear the location data
      if (!newValue.trim()) {
        setValue("latitude", country?.center_lat || 0);
        setValue("longitude", country?.center_lng || 0);
        setValue("address", "");
        setMapCenter({
          lat: country?.center_lat || 0,
          lng: country?.center_lng || 0,
        });
        setLastValidPosition({
          lat: country?.center_lat || 0,
          lng: country?.center_lng || 0,
        });
        setLastValidAddress("");
        // Reset the search value cache
        prevSearchValueRef.current = "";
      }
    },
    [country?.center_lat, country?.center_lng, setValue]
  );
  return (
    <div className="space-y-2">
      {isLoaded && window.google ? (
        <>
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange} // ✅ Use the new handler
            placeholder={t("common.search")}
            className="form-control w-full rounded-xl border border-gray-300 p-2 "
          />

          {mapCenter && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={5}
              onLoad={onLoad}
              // onDragEnd={handleMapDragEnd}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
                draggable: true,
              }}
            >
              <Marker
                position={mapCenter}
                draggable
                onDragEnd={handleMarkerDragEnd}
              />
            </GoogleMap>
          )}
        </>
      ) : (
        <p className="text-gray-500 text-sm">{t("common.loading")}</p>
      )}
    </div>
  );
}
