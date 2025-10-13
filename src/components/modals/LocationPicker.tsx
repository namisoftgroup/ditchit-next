"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useHomeFilter } from "@/features/listing/store";
import { useTranslations, useLocale } from "next-intl";

const LIBRARIES = ["places"] as const;

const containerStyle = {
  borderRadius: "16px",
  width: "100%",
  height: "300px",
};

type Props = {
  defaultCountry?: string;
  onChange?: (pos: { lat: number; lng: number; address?: string }) => void;
};

export default function LocationSearchMap({ defaultCountry, onChange }: Props) {
  const { filter } = useHomeFilter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: filter.latitude ? Number(filter.latitude) : 40.48648022613869,
    lng: filter.longitude ? Number(filter.longitude) : -101.876634775,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const mapRef = useRef<google.maps.Map | null>(null);
  const t = useTranslations("common");
  const locale = useLocale(); // 👈 من next-intl (ar, en, fr...)

  // ✅ تحميل Google Maps بلغة الترجمة الحالية
  useEffect(() => {
    const loadGoogleMaps = () => {
      return new Promise<void>((resolve, reject) => {
        // حذف أي سكربت سابق
        const existingScript = document.getElementById("google-maps-script");
        if (existingScript) existingScript.remove();

        // تنظيف الكائن القديم
        delete (window as unknown as Record<string, unknown>).google;

        const script = document.createElement("script");
        script.id = "google-maps-script";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${
          process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        }&libraries=${LIBRARIES.join(",")}&language=${locale}`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
          setIsLoaded(true);
          resolve();
        };
        script.onerror = (err) => reject(err);

        document.head.appendChild(script);
      });
    };

    loadGoogleMaps().catch(() => console.error("Failed to load Google Maps"));
  }, [locale]); // 👈 يعيد التحميل لما اللغة تتغير

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // 🔍 البحث
  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) return;
    if (!("google" in window) || !google.maps?.Geocoder) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: searchQuery }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        const newCenter = { lat: location.lat(), lng: location.lng() };
        const formattedAddress = results[0].formatted_address;
        setMapCenter(newCenter);
        mapRef.current?.panTo(newCenter);
        onChange?.({ ...newCenter, address: formattedAddress });
      } else {
        console.log("لم يتم العثور على الموقع.");
      }
    });
  }, [searchQuery, onChange]);

  // 📍 عند سحب الماركر
  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (!("google" in window) || !google.maps?.Geocoder) return;
    const lat = e.latLng?.lat();
    const lng = e.latLng?.lng();
    if (lat && lng) {
      const newPos = { lat, lng };
      setMapCenter(newPos);

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: newPos }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const formattedAddress = results[0].formatted_address;
          setSearchQuery(formattedAddress);
          onChange?.({ ...newPos, address: formattedAddress });
        } else {
          onChange?.(newPos);
        }
      });
    }
  };

  useEffect(() => {
    if (defaultCountry) handleSearch();
  }, [defaultCountry, handleSearch]);

  useEffect(() => {
    if (filter.latitude && filter.longitude) {
      setMapCenter({ lat: Number(filter.latitude), lng: Number(filter.longitude) });
    }
  }, [filter.latitude, filter.longitude]);

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
          zoom={6}
          onLoad={onLoad}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          <Marker position={mapCenter} draggable onDragEnd={handleMarkerDragEnd} />
        </GoogleMap>
      )}
    </div>
  );
}
