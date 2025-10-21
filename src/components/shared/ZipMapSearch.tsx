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
  const t = useTranslations("common");
  const locale = useLocale();
  const { watch, setValue } = useFormContext();
  
  // Form values
  const zipCode = watch("zip_code");
  const savedLat = watch("latitude");
  const savedLng = watch("longitude");
  const savedAddress = watch("address");

  // State
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(() => ({
    lat: country?.center_lat,
    lng: country?.center_lng,
  }));
  const [searchValue, setSearchValue] = useState("");
  const [lastZip, setLastZip] = useState("");
  const [ , setSelectCountryBounds] = useState(country?.code || "");
  const [lastValidPosition, setLastValidPosition] = useState<{ lat: number; lng: number }>({
    lat: country?.center_lat,
    lng: country?.center_lng,
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
    
    // Check if country has changed
    if (previousCountryCodeRef.current !== country.code) {
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
      }
    }
  }, [country, setValue]);

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
  // SECTION 6: Fetch coordinates from ZIP code
  // ============================================
  useEffect(() => {
    const fetchCoordinates = async () => {
      if (zipCode && zipCode !== lastZip) {
        const result = await getCoordinates(zipCode);
        if (result) {
          updateAddressFromCoords(result.latitude, result.longitude, result.address);
          setLastZip(zipCode);
        } else {
          toast.error(t("zipcode_error"));
        }
      }
    };
    fetchCoordinates();
  }, [zipCode, lastZip, t]);

  // ============================================
  // SECTION 7: Interactive search while typing (Debounced)
  // ============================================
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!searchValue.trim() || !window.google) return;

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: searchValue }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const loc = results[0].geometry.location;
          const lat = loc.lat();
          const lng = loc.lng();
          const address = results[0].formatted_address;
          updateAddressFromCoords(lat, lng, address);
        }
      });
    }, 600);

    return () => clearTimeout(delayDebounce);
  }, [searchValue]);

  // ============================================
  // CORE FUNCTION: Convert coordinates to address & validate country
  // ============================================
  const updateAddressFromCoords = async (
    lat: number,
    lng: number,
    preFetchedAddress?: string
  ) => {
    if (isUpdatingRef.current) return;
    isUpdatingRef.current = true;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      let address = preFetchedAddress;
      if (!address && status === "OK" && results && results[0]) {
        address = results[0].formatted_address;
      }

      if (status === "OK" && results && results[0]) {
        const bounds = results
          .flatMap((res) =>
            res.address_components
              .filter((add) => add.types.includes("country"))
              .map((add) => add.short_name)
          )
          .filter(Boolean);

        const detectedCountry = bounds[0] ?? "";

        if (detectedCountry === "" || detectedCountry !== country?.code) {
          toast.error("You are outside the selected country");

          // Revert to last valid position without clearing address
          if (mapRef.current) {
            mapRef.current.panTo(lastValidPosition);
          }
          setMapCenter(lastValidPosition);
          setValue("latitude", lastValidPosition.lat);
          setValue("longitude", lastValidPosition.lng);
          setValue("address", lastValidAddress);
          setSearchValue(lastValidAddress);
        } else {
          // Inside country: update everything
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
        // Geocode failed: revert without clearing
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

      isUpdatingRef.current = false;
    });
  };

  // ============================================
  // EVENT HANDLERS
  // ============================================
  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    const lat = e.latLng?.lat();
    const lng = e.latLng?.lng();
    if (lat && lng) {
      updateAddressFromCoords(lat, lng);
    }
  };

  // Note: handleMapDragEnd is commented in original code
  // const handleMapDragEnd = useCallback(() => {
  //   const newCenter = mapRef.current?.getCenter();
  //   if (newCenter) {
  //     const lat = newCenter.lat();
  //     const lng = newCenter.lng();
  //     updateAddressFromCoords(lat, lng);
  //   }
  // }, []);

  // Debug logging (from original code)
  // console.log( selectCountryBounds);

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="space-y-2">
      {isLoaded && window.google ? (
        <>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={t("search")}
            className="form-control w-full rounded-xl border border-gray-300 p-2 "
          />

          {mapCenter && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={3}
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
        <p className="text-gray-500 text-sm">{t("loading")}</p>
      )}
    </div>
  );
}