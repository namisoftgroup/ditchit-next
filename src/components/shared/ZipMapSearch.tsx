"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { toast } from "sonner";
import { getCoordinates } from "@/utils/getCoordinatesByZipCode";
import { useTranslations, useLocale } from "next-intl";

const containerStyle = {
  borderRadius: "16px",
  width: "100%",
  height: "300px",
};

declare global {
  interface Window {
    google: any;
    initMapScriptLoaded?: boolean;
  }
}

export default function ZipMapSearch({
  countryId,
}: {
  countryId: string | undefined;
}) {
  const t = useTranslations("common");
  const locale = useLocale(); // اللغة الحالية (مثلاً: ar, en, fr)
  const { watch, setValue } = useFormContext();
  const zipCode = watch("zip_code");

  const [isLoaded, setIsLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [lastZip, setLastZip] = useState("");

  const mapRef = useRef<google.maps.Map | null>(null);

  // ✅ تحميل سكربت Google Maps بلغة ديناميكية
  useEffect(() => {
    const loadGoogleMaps = () => {
      return new Promise<void>((resolve, reject) => {
        // احذف أي سكربت سابق
        const existingScript = document.getElementById("google-maps-script");
        if (existingScript) existingScript.remove();

        // احذف كائن google القديم لتجنب الكاش
        delete (window as any).google;
        window.initMapScriptLoaded = false;

        // أنشئ سكربت جديد
        const script = document.createElement("script");
        script.id = "google-maps-script";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${
          process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        }&libraries=places&language=${locale}`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          window.initMapScriptLoaded = true;
          resolve();
        };
        script.onerror = (err) => reject(err);
        document.head.appendChild(script);
      });
    };

    loadGoogleMaps()
      .then(() => setIsLoaded(true))
      .catch(() => toast.error("Failed to load Google Maps"));
  }, [locale]); // 👈 كلما تتغير اللغة يعاد تحميل السكربت

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // تحديد الموقع الحالي
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setMapCenter({ lat, lng });
          setValue("latitude", lat);
          setValue("longitude", lng);
        },
        () => {
          const lat = 37.0902;
          const lng = -95.7129;
          setMapCenter({ lat, lng });
          setValue("latitude", lat);
          setValue("longitude", lng);
        }
      );
    }
  }, [setValue, countryId]);

  // جلب الإحداثيات من ZIP
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

  // البحث التفاعلي أثناء الكتابة
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!searchValue.trim() || !window.google) return;

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: searchValue }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const loc = results[0].geometry.location;
          const lat = loc.lat();
          const lng = loc.lng();
          setMapCenter({ lat, lng });
          setValue("latitude", lat);
          setValue("longitude", lng);
          setValue("address", results[0].formatted_address);
        }
      });
    }, 600);

    return () => clearTimeout(delayDebounce);
  }, [searchValue, setValue]);

  // سحب الماركر
  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    const lat = e.latLng?.lat();
    const lng = e.latLng?.lng();
    if (lat && lng) {
      setMapCenter({ lat, lng });
      setValue("latitude", lat);
      setValue("longitude", lng);
      updateAddressFromCoords(lat, lng);
    }
  };

  // سحب الخريطة
  const handleMapDragEnd = useCallback(() => {
    const newCenter = mapRef.current?.getCenter();
    if (newCenter) {
      const lat = newCenter.lat();
      const lng = newCenter.lng();
      setValue("latitude", lat);
      setValue("longitude", lng);
      updateAddressFromCoords(lat, lng);
    }
  }, [setValue]);

  // تحويل الإحداثيات إلى عنوان
  const updateAddressFromCoords = async (lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const address = results[0].formatted_address;
        setValue("address", address);
        setSearchValue(address);
      }
    });
  };

  return (
    <div className="space-y-2">
      {isLoaded && window.google ? (
        <>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={t("search")}
            className="form-control w-full rounded-md border border-gray-300 p-2"
          />

          {mapCenter && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={12}
              onLoad={onLoad}
              onDragEnd={handleMapDragEnd}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
            >
              <Marker position={mapCenter} draggable onDragEnd={handleMarkerDragEnd} />
            </GoogleMap>
          )}
        </>
      ) : (
        <p className="text-gray-500 text-sm">{t("loading_map") || "جاري تحميل الخريطة..."}</p>
      )}
    </div>
  );
}
