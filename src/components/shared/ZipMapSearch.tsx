"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { toast } from "sonner";
import { getCoordinates } from "@/utils/getCoordinatesByZipCode";

const containerStyle = {
  borderRadius: "16px",
  width: "100%",
  height: "250px",
};

export default function ZipMapSearch() {
  const { watch, setValue } = useFormContext();
  const zipCode = watch("zip_code");

  const [mapCenter, setMapCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [lastZip, setLastZip] = useState("");

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

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
        (error) => {
          console.warn("Geolocation error:", error);
          toast.error("Could not detect your location.");
          setMapCenter({ lat: 34.0522, lng: -118.2437 });
        }
      );
    }
  }, [setValue]);

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
          toast.error("Could not fetch coordinates. Please try a valid ZIP.");
        }
      }
    };
    fetchCoordinates();
  }, [lastZip, setValue, zipCode]);

  return (
    <>
      {isLoaded && mapCenter && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={12}
        >
          <Marker position={mapCenter} />
        </GoogleMap>
      )}
    </>
  );
}
