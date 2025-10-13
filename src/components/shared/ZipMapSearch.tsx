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
  const locale = useLocale(); // اللغة الحالية (مثلاً: ar, en, fr)
  const { watch, setValue } = useFormContext();
  const zipCode = watch("zip_code");

  const [isLoaded, setIsLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState<{
    lat: number;
    lng: number;
  }>(() => ({
    lat: country?.center_lat,
    lng: country?.center_lng,
  }));
  const [searchValue, setSearchValue] = useState("");
  const [lastZip, setLastZip] = useState("");
const [selectCountryBounds, setSelectCountryBounds] = useState(country?.code || "");

  const mapRef = useRef<google.maps.Map | null>(null);

  // ✅ تحميل سكربت Google Maps بلغة ديناميكية
  useEffect(() => {
    // 1️⃣ إذا كانت مكتبة Google Maps Loaded مسبقًا ➜ لا تعيد التحميل
    if (typeof window !== "undefined" && window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    const existingScript = document.getElementById("google-maps-script");
    if (existingScript) {
      // إذا كان السكربت قيد التحميل حاليًا انتظر لحين الانتهاء
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
  }, [locale]); // 👈 كلما تتغير اللغة يعاد تحميل السكربت إذا لم يكن موجودًا بالفعل

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
          const lat = country?.center_lat ?? 56.58856249999999;
          const lng = country?.center_lng ?? -66.3980625;
          setMapCenter({ lat, lng });
          setValue("latitude", lat);
          setValue("longitude", lng);
        }
      );
    }
  }, [setValue, country, countryId]);

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
  // 🔒 السماح فقط لو الدولة نفسها
  const canDrag = country?.code === selectCountryBounds;

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
        const bounds = results
          .flatMap((res) =>
            res.address_components
              .filter((add) => add.types.includes("country"))
              .map((add) => add.short_name)
          )
          .filter(Boolean);
        setSelectCountryBounds(bounds[0] ?? "");

        setValue("address", address);
        setSearchValue(address);
        if (bounds[0] !== country?.code) {
          toast.error("You are outside the selected country");
        }
      }
    });
  };
  console.log(country, selectCountryBounds, mapCenter);

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
              // ✅ هنا الشرط
              onDragEnd={() => {
                if (canDrag) {
                  handleMapDragEnd();
                } else {
                  // If dragging is not allowed, snap back to the previous center
                  if (mapRef.current) {
                    mapRef.current.panTo(mapCenter);
                  }
                }
              }}
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
