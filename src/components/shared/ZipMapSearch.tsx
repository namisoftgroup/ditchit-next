"use client";

import { useEffect, useState, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { toast } from "sonner";
import { getCoordinates } from "@/utils/getCoordinatesByZipCode";

const containerStyle = {
  borderRadius: "16px",
  width: "100%",
  height: "250px",
};

export default function ZipMapSearch({ countryId }: { countryId: string }) {
  const { watch, setValue } = useFormContext();
  const zipCode = watch("zip_code");

  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [lastZip, setLastZip] = useState("");

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  // تحديد الموقع الحالي أو وضع افتراضي
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setMapCenter({ lat, lng });
          setValue("latitude", lat);
          setValue("longitude", lng);
        },
        () => {
          // ✨ لو المستخدم رفض إذن الموقع → نستخدم أمريكا كإفتراضي
          toast.error("لم نتمكن من تحديد موقعك، سيتم استخدام الموقع الافتراضي (الولايات المتحدة الأمريكية)");
          const lat = 37.0902;
          const lng = -95.7129;
          setMapCenter({ lat, lng });
          setValue("latitude", lat);
          setValue("longitude", lng);
        }
      );
    } else {
      // ✨ في حال المتصفح لا يدعم geolocation
      const lat = 37.0902;
      const lng = -95.7129;
      setMapCenter({ lat, lng });
      setValue("latitude", lat);
      setValue("longitude", lng);
    }
  }, [setValue ,countryId]);

  // تحديث الإحداثيات عند تغيير الرمز البريدي
  useEffect(() => {
    const fetchCoordinates = async () => {
      if (zipCode && zipCode !== lastZip) {
        const result = await getCoordinates(zipCode);
        if (result) {
          setValue("latitude", result.latitude);
          setValue("longitude", result.longitude);
          setValue("address", result.address);
          setMapCenter({ lat: result.latitude, lng: result.longitude });
          setLastZip(zipCode);
        } else {
          toast.error("لم يتم العثور على موقع بهذا الرمز البريدي");
        }
      }
    };
    fetchCoordinates();
  }, [zipCode, lastZip, setValue]);

  // عند سحب الخريطة
  const handleMapDragEnd = useCallback(
    (map: google.maps.Map) => {
      if (countryId === "1") return;
      const newCenter = map.getCenter();
      if (newCenter) {
        const lat = newCenter.lat();
        const lng = newCenter.lng();
        setMapCenter({ lat, lng });
        setValue("latitude", lat);
        setValue("longitude", lng);
      }
    },
    [setValue, countryId]
  );

  // عند سحب الماركر
  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (countryId === "1") return;
    const lat = e.latLng?.lat();
    const lng = e.latLng?.lng();
    if (lat && lng) {
      setMapCenter({ lat, lng });
      setValue("latitude", lat);
      setValue("longitude", lng);
    }
  };
  
  return (
    <>
      {isLoaded && mapCenter && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={5} 
          onDragEnd={(map) => handleMapDragEnd(map as unknown as google.maps.Map)}
          options={{
            draggable: countryId !== "1",
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          <Marker
            position={mapCenter}
            draggable={countryId !== "1"}
            onDragEnd={handleMarkerDragEnd}
          />
        </GoogleMap>
      )}
    </>
  );
}
