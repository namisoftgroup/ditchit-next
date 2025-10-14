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
  const [selectCountryBounds, setSelectCountryBounds] = useState(
    country?.code || ""
  );
  const [lastValidPosition, setLastValidPosition] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: country?.center_lat,
    lng: country?.center_lng,
  });
  // ✅ state جديد لحفظ آخر address صالح داخل الدولة
  const [lastValidAddress, setLastValidAddress] = useState("");

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
          // ✅ شغل التحقق قبل التحديث
          updateAddressFromCoords(lat, lng);
        },
        () => {
          const lat = country?.center_lat ?? 56.58856249999999;
          const lng = country?.center_lng ?? -66.3980625;
          // ✅ شغل التحقق قبل التحديث
          updateAddressFromCoords(lat, lng);
        }
      );
    }
  }, [country, countryId]);

  // جلب الإحداثيات من ZIP
  useEffect(() => {
    const fetchCoordinates = async () => {
      if (zipCode && zipCode !== lastZip) {
        const result = await getCoordinates(zipCode);
        if (result) {
          // ✅ شغل التحقق قبل التحديث
          updateAddressFromCoords(result.latitude, result.longitude, result.address);
          setLastZip(zipCode);
        } else {
          toast.error(t("zipcode_error"));
        }
      }
    };
    fetchCoordinates();
  }, [zipCode, lastZip, t]);

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
          const address = results[0].formatted_address;
          // ✅ شغل التحقق قبل التحديث
          updateAddressFromCoords(lat, lng, address);
        }
      });
    }, 600);

    return () => clearTimeout(delayDebounce);
  }, [searchValue]);

  // 🔒 السماح فقط لو الدولة نفسها
  // const canDrag = country?.code === selectCountryBounds;

  // سحب الماركر
  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    const lat = e.latLng?.lat();
    const lng = e.latLng?.lng();
    if (lat && lng) {
      updateAddressFromCoords(lat, lng);
    }
  };

  // سحب الخريطة
  // const handleMapDragEnd = useCallback(() => {
  //   const newCenter = mapRef.current?.getCenter();
  //   if (newCenter) {
  //     const lat = newCenter.lat();
  //     const lng = newCenter.lng();
  //     updateAddressFromCoords(lat, lng);
  //   }
  // }, []);

  // تحويل الإحداثيات إلى عنوان
  const updateAddressFromCoords = async (lat: number, lng: number, preFetchedAddress?: string) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      let address = preFetchedAddress; // لو موجود من zip أو search
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
          // toast.error(detectedCountry === "" ? "Unable to detect country" : "You are outside the selected country");
          toast.error( "You are outside the selected country");

          // ✅ رجع للـ lastValidPosition بدون مسح الـ address
          if (mapRef.current) {
            mapRef.current.panTo(lastValidPosition);
          }
          setMapCenter(lastValidPosition);
          setValue("latitude", lastValidPosition.lat);
          setValue("longitude", lastValidPosition.lng);
          // ✅ احتفظ بالـ lastValidAddress
          setValue("address", lastValidAddress);
          setSearchValue(lastValidAddress);
        } else {
          // ✅ داخل: حدث كل حاجة
          setMapCenter({ lat, lng });
          setValue("latitude", lat);
          setValue("longitude", lng);
          setValue("address", address || "");
          setSearchValue(address || "");
          setSelectCountryBounds(detectedCountry);
          setLastValidPosition({ lat, lng });
          setLastValidAddress(address || ""); // حدث الـ lastValidAddress
        }
      } else {
        // ✅ فشل: رجع بدون مسح
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