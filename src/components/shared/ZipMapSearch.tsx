"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { toast } from "sonner";
import { getCoordinates } from "@/utils/getCoordinatesByZipCode";
import { useTranslations, useLocale } from "next-intl";
import { Country } from "@/types/country";

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
// console.log("countries" , country);

  // Form values
  const zipCode = watch("zip_code");
  const savedLat = watch("latitude");
  const savedLng = watch("longitude");
  const savedAddress = watch("address");
  const countryChanged = watch("country_changed");

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
    if (typeof window !== "undefined" && window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    const existingScript = document.getElementById("google-maps-script");
    if (existingScript) {
      existingScript.addEventListener("load", () => setIsLoaded(true));
      return;
    }

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
  // SECTION 2: Handle Country Change
  // ============================================
  useEffect(() => {
    if (!country?.code || !country?.center_lat || !country?.center_lng) return;

    if (previousCountryCodeRef.current !== country.code || countryChanged) {
      const newCenter = {
        lat: country.center_lat,
        lng: country.center_lng,
      };

      setMapCenter(newCenter);
      setLastValidPosition(newCenter);
      setSelectCountryBounds(country.code);

      setSearchValue("");
      setLastValidAddress("");
      setValue("latitude", newCenter.lat);
      setValue("longitude", newCenter.lng);
      setValue("address", "");
      setLastZip("");

      isInitializedRef.current = false;
      previousCountryCodeRef.current = country.code;

      if (mapRef.current) {
        mapRef.current.panTo(newCenter);
        mapRef.current.setZoom(6);
      }
    }
  }, [country, setValue, countryChanged]);

  // ============================================
  // CORE FUNCTION: Convert coordinates to address
  // ============================================
  const geocodeCache = useRef<Record<string, any>>({}); // eslint-disable-line @typescript-eslint/no-explicit-any
  const lastGeocodeTimestampRef = useRef<number>(0);
  const THROTTLE_DELAY = 1000;

  const updateAddressFromCoords = useCallback(
    async (lat: number, lng: number, preFetchedAddress?: string) => {
      if (isUpdatingRef.current || !lat || !lng) return;

      const roundedLat = Math.round(lat * 1000000) / 1000000;
      const roundedLng = Math.round(lng * 1000000) / 1000000;
      const cacheKey = `${roundedLat},${roundedLng}`;

      const now = Date.now();
      if (now - lastGeocodeTimestampRef.current < THROTTLE_DELAY) {
        return;
      }

      isUpdatingRef.current = true;
      lastGeocodeTimestampRef.current = now;

      try {
        if (geocodeCache.current[cacheKey] && !preFetchedAddress) {
          const cachedResult = geocodeCache.current[cacheKey];
          handleGeocodeResult(
            cachedResult.results,
            cachedResult.status,
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
    [country?.code, lastValidAddress, lastValidPosition, setValue, t] // eslint-disable-line react-hooks/exhaustive-deps
  );

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

        if (detectedCountry === "" || detectedCountry !== country?.code) {
          toast.error("You are outside the selected country");

          if (mapRef.current) {
            mapRef.current.panTo(lastValidPosition);
          }
          setMapCenter(lastValidPosition);
          setValue("latitude", lastValidPosition.lat);
          setValue("longitude", lastValidPosition.lng);
          setValue("address", lastValidAddress);
          setSearchValue(lastValidAddress);
        } else {
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
    [country?.code, lastValidAddress, lastValidPosition, setValue, t] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // ============================================
  // SECTION 3: Show saved address
  // ============================================
  useEffect(() => {
    if (savedAddress && !searchValue && searchValue !== "") {
      setSearchValue(savedAddress);
      setLastValidAddress(savedAddress);
    }
  }, [savedAddress, searchValue]);

  // ============================================
  // SECTION 4: Initialize with saved coordinates
  // ============================================
  useEffect(() => {
    if (!isLoaded || isInitializedRef.current) return;

    const latNum = Number(savedLat);
    const lngNum = Number(savedLng);

    if (!isNaN(latNum) && !isNaN(lngNum) && latNum !== 0 && lngNum !== 0) {
      const pos = { lat: latNum, lng: lngNum };
      setMapCenter(pos);
      setLastValidPosition(pos);
      updateAddressFromCoords(latNum, lngNum);
      isInitializedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedLat, savedLng, isLoaded]);

  // ============================================
  // SECTION 5: Get current location
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
  }, [country, countryId, isLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  // ============================================
  // SECTION 6: Fetch coordinates from ZIP code
  // ============================================
  const zipCodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (zipCodeTimeoutRef.current) {
      clearTimeout(zipCodeTimeoutRef.current);
    }

    if (!zipCode || zipCode === lastZip) return;

    const cacheKey = `zip_${zipCode}`;
    if (geocodeCache.current[cacheKey]) {
      const cachedResult = geocodeCache.current[cacheKey];
      updateAddressFromCoords(
        cachedResult.latitude,
        cachedResult.longitude,
        cachedResult.address
      );
      setLastZip(zipCode);
      return;
    }

    zipCodeTimeoutRef.current = setTimeout(async () => {
      if (
        isUpdatingRef.current ||
        Date.now() - lastGeocodeTimestampRef.current < THROTTLE_DELAY
      ) {
        return;
      }

      const result = await getCoordinates(zipCode);
      if (result) {
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
    }, 800);

    return () => {
      if (zipCodeTimeoutRef.current) {
        clearTimeout(zipCodeTimeoutRef.current);
      }
    };
  }, [zipCode, lastZip, t, updateAddressFromCoords]);

  // ============================================
  // MANUAL SEARCH FUNCTION
  // ============================================
  const handleSearch = useCallback(() => {
    if (!searchValue.trim() || !window.google || !isLoaded) return;

    const cacheKey = `search_${searchValue.trim()}`;
    if (geocodeCache.current[cacheKey]) {
      const cachedResult = geocodeCache.current[cacheKey];
      const lat = cachedResult.lat;
      const lng = cachedResult.lng;
      updateAddressFromCoords(lat, lng, cachedResult.address);
      return;
    }

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

        geocodeCache.current[cacheKey] = {
          lat,
          lng,
          address,
        };

        updateAddressFromCoords(lat, lng, address);
      } else {
        toast.error("Location not found");
      }
    });
  }, [searchValue, isLoaded, updateAddressFromCoords]);

  // ============================================
  // EVENT HANDLERS
  // ============================================
  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const lastDragPositionRef = useRef<{ lat: number; lng: number } | null>(null);

  const handleMarkerDragEnd = useCallback(
    (e: google.maps.MapMouseEvent) => {
      const lat = e.latLng?.lat();
      const lng = e.latLng?.lng();

      if (lat && lng) {
        const lastPos = lastDragPositionRef.current;
        if (
          lastPos &&
          Math.abs(lastPos.lat - lat) < 0.0001 &&
          Math.abs(lastPos.lng - lng) < 0.0001
        ) {
          return;
        }

        lastDragPositionRef.current = { lat, lng };
        updateAddressFromCoords(lat, lng);
      }
    },
    [updateAddressFromCoords]
  );

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="space-y-2">
      {isLoaded && window.google ? (
        <>
          <div className="relative">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              placeholder={t("common.search")}
              className="form-control w-full rounded-xl border border-gray-300 p-2 pr-10"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label="Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          {mapCenter && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={3}
              onLoad={onLoad}
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
