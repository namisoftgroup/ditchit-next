"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { toast } from "sonner";
import { getCoordinates } from "@/utils/getCoordinatesByZipCode";
import { useTranslations } from "next-intl";

const containerStyle = {
  borderRadius: "16px",
  width: "100%",
  height: "250px",
};

export default function ZipMapSearch({ countryId }: { countryId: string | undefined }) {
  const t = useTranslations("auth");

  const { watch, setValue } = useFormContext();
  const mapRef = useRef<google.maps.Map | null>(null);
  const zipCode = watch("zip_code");

  const [mapCenter, setMapCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [lastZip, setLastZip] = useState("");

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);
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
          // toast.error(t("location_error"));
          const lat = 37.0902;
          const lng = -95.7129;
          setMapCenter({ lat, lng });
          setValue("latitude", lat);
          setValue("longitude", lng);
        }
      );
    } else {
      const lat = 37.0902;
      const lng = -95.7129;
      setMapCenter({ lat, lng });
      setValue("latitude", lat);
      setValue("longitude", lng);
    }
  }, [setValue, countryId, t]);

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
          toast.error(t("zipcode_error"));
        }
      }
    };
    fetchCoordinates();
  }, [zipCode, lastZip, setValue, t]);

  const handleMapDragEnd = useCallback(() => {
    if (countryId === "1") return;
    const newCenter = mapRef.current?.getCenter();
    if (newCenter) {
      const lat = newCenter.lat();
      const lng = newCenter.lng();
      setValue("latitude", lat);
      setValue("longitude", lng);
    }
  }, [setValue, countryId]);

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
          onLoad={onLoad}
          onDragEnd={handleMapDragEnd}
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
