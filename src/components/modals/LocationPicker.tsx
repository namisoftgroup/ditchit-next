"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type Props = {
  defaultCountry?: string;
  onChange?: (pos: { lat: number; lng: number; address?: string }) => void;
};

const containerStyle = {
  borderRadius: "16px",
  width: "100%",
  height: "300px",
};

export default function LocationSearchMap({ defaultCountry, onChange }: Props) {
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 30.0444, // القاهرة
    lng: 31.2357,
  });
  const [searchQuery, setSearchQuery] = useState(defaultCountry || "");
  const [address, setAddress] = useState<string>("");
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // 🔍 البحث عن موقع جديد
  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: searchQuery }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        const newCenter = { lat: location.lat(), lng: location.lng() };
        const formattedAddress = results[0].formatted_address;
        setMapCenter(newCenter);
        setAddress(formattedAddress);
        mapRef.current?.panTo(newCenter);
        onChange?.({ ...newCenter, address: formattedAddress });
      } else {
        console.log("لم يتم العثور على الموقع.");
      }
    });
  }, [searchQuery, onChange]);

  // 📍 عند سحب المؤشر يدويًا
  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    const lat = e.latLng?.lat();
    const lng = e.latLng?.lng();
    if (lat && lng) {
      const newPos = { lat, lng };
      setMapCenter(newPos);

      // جلب العنوان الجديد من الإحداثيات
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: newPos }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const formattedAddress = results[0].formatted_address;
          setAddress(formattedAddress);
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

  return (
    <div className="flex flex-col gap-3">
      <div className="relative w-full">
        <Input
          placeholder="اكتب اسم الدولة أو العنوان..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="pr-10  *:h-[48px] rounded-[12px] border-[var(--lightBorderColor)]"
        />
        <Search
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
          onClick={handleSearch}
        />
      </div>

      {isLoaded && (
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
            position={mapCenter}
            draggable
            onDragEnd={handleMarkerDragEnd}
          />
        </GoogleMap>
      )}
    </div>
  );
}
