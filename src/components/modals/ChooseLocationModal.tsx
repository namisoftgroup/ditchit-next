"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { MessagePayload } from "@/features/chat/types";
import useSendMessage from "@/features/chat/useSendMessage";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  GoogleMap,
  Marker,
  StandaloneSearchBox,
  useLoadScript,
} from "@react-google-maps/api";
import { useTranslations } from "next-intl";

type ChooseLocationModalProps = {
  show: boolean;
  roomId: number;
  handleClose: () => void;
  setMessage: (message: MessagePayload) => void;
};

export default function ChooseLocationModal({
  show,
  roomId,
  setMessage,
  handleClose,
}: ChooseLocationModalProps) {
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: 30.0444,
    lng: 31.2357,
  });
  const { sendMessageMutation, isPending } = useSendMessage(setMessage);

  const [searchInput, setSearchInput] = useState("");
  const searchBox = useRef<google.maps.places.SearchBox | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
  });

  const t = useTranslations("chat");
  const reverseGeocodeMarkerPosition = useCallback(
    (position: { lat: number; lng: number }) => {
      if (!isLoaded || !("google" in window) || !google.maps?.Geocoder) return;
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: position }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          setSearchInput(results[0].formatted_address);
        }
      });
    },
    [isLoaded]
  );

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setMarkerPosition(coords);
          reverseGeocodeMarkerPosition(coords);
        },
        (err) => {
          console.warn("Geolocation error:", err);
        }
      );
    }
  }, [reverseGeocodeMarkerPosition]);

  const handleMarkerDragEnd = (position: { lat: number; lng: number }) => {
    setMarkerPosition(position);
    reverseGeocodeMarkerPosition(position);
  };

  const handlePlaceSelect = () => {
    const places = searchBox.current?.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      const loc = place.geometry?.location;
      if (loc) {
        const coords = { lat: loc.lat(), lng: loc.lng() };
        setMarkerPosition(coords);
        setSearchInput(place.formatted_address || place.name || "");
      }
    }
  };

  const handleSendLocation = () => {
    const formData: MessagePayload = {
      type: "location",
      room_id: roomId,
      latitude: markerPosition.lat,
      longitude: markerPosition.lng,
    };

    sendMessageMutation(formData, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  if (!isLoaded) return null;

  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-6 bg-white shadow-xl rounded-[24px] gap-2">
        <DialogHeader className="mb-0">
          <DialogTitle className="text-[14px] font-bold capitalize">
            {t("choose_your_location")}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <GoogleMap
            mapContainerStyle={{
              width: "100%",
              height: "400px",
              borderRadius: "12px",
            }}
            zoom={6}
            center={markerPosition}
          >
            <Marker
              position={markerPosition}
              draggable={true}
              onDragEnd={(e) =>
                handleMarkerDragEnd({
                  lat: e.latLng!.lat(),
                  lng: e.latLng!.lng(),
                })
              }
            />
            <StandaloneSearchBox
              onLoad={(ref) => (searchBox.current = ref)}
              onPlacesChanged={handlePlaceSelect}
            >
              <input
                type="search"
                placeholder={t("search_places")}
                className="absolute top-2 start-1/2 -translate-x-1/2 w-[96%] z-10  rounded-md p-3 bg-white shadow"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </StandaloneSearchBox>
          </GoogleMap>

          <Button
            className="customBtn ms-auto h-auto py-3 me-0 rounded-full"
            onClick={handleSendLocation}
            disabled={isPending}
          >
            {isPending ? t("sending") : t("send_location")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
