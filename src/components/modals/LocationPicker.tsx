"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useHomeFilter } from "@/features/listing/store";
import { useTranslations, useLocale } from "next-intl";
import { Country } from "@/types/country";
import { toast } from "sonner";

const LIBRARIES = ["places"] as const;

const containerStyle = {
  borderRadius: "16px",
  width: "100%",
  height: "300px",
};

type Props = {
  defaultCountry?: string;
  onChange?: (pos: { lat: number; lng: number; address?: string }) => void;
  countryData: Country | undefined;
};

export default function LocationSearchMap({
  defaultCountry,
  onChange,
  countryData,
}: Props) {
  const { filter } = useHomeFilter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: countryData?.center_lat ?? 0,
    lng: countryData?.center_lng ?? 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const t = useTranslations("common");
  const locale = useLocale();

  const [, setSelectCountryBounds] = useState(
    countryData?.code || ""
  );
  const [lastValidPosition, setLastValidPosition] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: countryData?.center_lat ?? 0,
    lng: countryData?.center_lng ?? 0,
  });
  const [lastValidAddress, setLastValidAddress] = useState("");

  // Load Google Maps with current locale
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      (window as { google?: { maps?: unknown } }).google?.maps
    ) {
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
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=${LIBRARIES.join(",")}&language=${locale}`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = (err) => reject(err);
        document.head.appendChild(script);
      });
    };

    loadGoogleMaps()
      .then(() => setIsLoaded(true))
      .catch(() => toast.error(t("failed_to_load_google_maps")));
  }, [locale, t]);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          updateAddressFromCoords(lat, lng);
        },
        () => {
          const lat = countryData?.center_lat ?? 0;
          const lng = countryData?.center_lng ?? 0;
          updateAddressFromCoords(lat, lng);
        }
      );
    }
  }, [countryData]);

  // Search with country validation
  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) return;
    if (!("google" in window) || !google.maps?.Geocoder) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: searchQuery }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        const formattedAddress = results[0].formatted_address;
        updateAddressFromCoords(lat, lng, formattedAddress);
      } else {
        toast.error(t("location_not_found"));
        revertToLastValid();
      }
    });
  }, [searchQuery, t]);

  // Revert to last valid position and address
  const revertToLastValid = useCallback(() => {
    const pos = { lat: lastValidPosition.lat, lng: lastValidPosition.lng };
    if (mapRef.current) {
      mapRef.current.panTo(pos);
    }
    if (markerRef.current) {
      markerRef.current.setPosition(pos);
    }
    setMapCenter(pos);
    setSearchQuery(lastValidAddress);
    onChange?.({
      ...pos,
      address: lastValidAddress,
    });
  }, [lastValidPosition, lastValidAddress, onChange]);

  // Convert coordinates to address with country validation
  const updateAddressFromCoords = useCallback(
    async (lat: number, lng: number, preFetchedAddress?: string) => {
      if (!("google" in window) || !google.maps?.Geocoder) {
        revertToLastValid();
        return;
      }

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

          if (
            detectedCountry === "" ||
            (countryData?.code && detectedCountry !== countryData.code)
          ) {
            toast.error("You are outside the selected country");
            revertToLastValid();
          } else {
            const newPos = { lat, lng };
            setMapCenter(newPos);
            setSearchQuery(address || "");
            setSelectCountryBounds(detectedCountry);
            setLastValidPosition(newPos);
            setLastValidAddress(address || "");
            onChange?.({
              ...newPos,
              address: address,
            });
          }
        } else {
          toast.error("You are outside the selected country");
          revertToLastValid();
        }
      });
    },
    [countryData?.code, lastValidAddress, lastValidPosition, onChange, t]
  );

  // Handle marker drag end
  const handleMarkerDragEnd = useCallback(
    (e: google.maps.MapMouseEvent) => {
      const lat = e.latLng?.lat();
      const lng = e.latLng?.lng();
      if (lat && lng) {
        updateAddressFromCoords(lat, lng);
      }
    },
    [updateAddressFromCoords]
  );

  // Handle map drag end
  // const handleMapDragEnd = useCallback(() => {
  //   const newCenter = mapRef.current?.getCenter();
  //   if (newCenter) {
  //     const lat = newCenter.lat();
  //     const lng = newCenter.lng();
  //     updateAddressFromCoords(lat, lng);
  //   }
  // }, [updateAddressFromCoords]);

  useEffect(() => {
    if (defaultCountry) handleSearch();
  }, [defaultCountry, handleSearch]);

  useEffect(() => {
    if (filter.latitude && filter.longitude) {
      const newPos = {
        lat: Number(filter.latitude),
        lng: Number(filter.longitude),
      };
      setMapCenter(newPos);
      updateAddressFromCoords(newPos.lat, newPos.lng);
    }
  }, [filter.latitude, filter.longitude, updateAddressFromCoords]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative w-full">
        <Input
          placeholder={t("search")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="pr-10 *:h-[48px] rounded-[12px] border-[var(--lightBorderColor)]"
        />
        <Search
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
          onClick={handleSearch}
        />
      </div>

      {isLoaded && window.google && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={3} // Recommended for clearer movement; adjust if needed
          onLoad={onLoad}
          // onDragEnd={handleMapDragEnd} // Uncommented to handle map drags if needed
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          <Marker
            onLoad={(marker) => (markerRef.current = marker)}
            position={mapCenter}
            draggable
            onDragEnd={handleMarkerDragEnd}
          />
        </GoogleMap>
      )}
    </div>
  );
}
