// "use client";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogClose,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { useHomeFilter } from "@/features/listing/store";
// import { saveLocationFilters } from "@/features/listing/action";
// import { SHIPPING_METHODS } from "@/utils/constants";
// import { useEffect, useRef, useState, useTransition } from "react";
// import { useTranslations } from "next-intl";
// import { Input } from "../ui/input";
// import { getCoordinates } from "@/utils/getCoordinatesByZipCode";
// import { toast } from "sonner";
// import { Country } from "@/types/country";
// import SelectField from "../shared/SelectField";
// import { getCookie, setCookie } from "@/lib/utils";
// import { User } from "@/types/user";
// import LocationSearchMap from "./LocationPicker";
// import ZipMapSearch from "../shared/ZipMapSearch";

// interface SearchByModalProps {
//   show: boolean;
//   handleClose: () => void;
//   countries: Country[];
//   user: User | null;
// }

// export default function SearchByModal({
//   show,
//   handleClose,
//   countries,
//   user,
// }: SearchByModalProps) {
//   const t = useTranslations("common");

//   // Determine initial country
//   const cookieCountry = getCookie("countryId");
//   const initialCountry =
//     cookieCountry ||
//     (user?.country_id
//       ? String(user?.country_id)
//       : String(countries[0]?.id ?? ""));

//   const { filter, setFilter } = useHomeFilter();
//   const [isPending, startTransition] = useTransition();
//   const [selectedCountry, setSelectedCountry] =
//     useState<string>(initialCountry);

//   const selectedMethod = filter.delivery_method;

//   const [selected, setSelected] = useState<{
//     lat: number;
//     lng: number;
//     address?: string;
//     kilometers: number;
//   } | null>(null);

//   const [countryData, setCountryData] = useState<Country | null>(
//     countries.find((el) => el.id === Number(initialCountry)) || null
//   );

//   // Handle filter updates
//   const onUpdateFilter = ({ key, value }: { key: string; value: string }) => {
//     setFilter({ [key]: value });
//   };

//   // ZIP code logic
//   const zipCodeCache = useRef<{
//     [zipCode: string]: {
//       latitude: number;
//       longitude: number;
//       address: string;
//       timestamp: number;
//     };
//   }>({});
//   const lastZipCodeRequestRef = useRef<number>(0);
//   const zipCodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const prevZipCodeRef = useRef<string>("");

//   const fetchCoordinates = async (zipCode: string) => {
//     if (!zipCode) return;
//     if (zipCode === prevZipCodeRef.current) return;
//     prevZipCodeRef.current = zipCode;

//     if (
//       zipCodeCache.current[zipCode] &&
//       Date.now() - zipCodeCache.current[zipCode].timestamp < 3600000
//     ) {
//       const cached = zipCodeCache.current[zipCode];
//       setFilter({
//         latitude: String(cached.latitude),
//         longitude: String(cached.longitude),
//         address: cached.address,
//       });
//       return;
//     }

//     const now = Date.now();
//     if (now - lastZipCodeRequestRef.current < 1000) return;
//     lastZipCodeRequestRef.current = now;

//     try {
//       const result = await getCoordinates(zipCode);
//       if (result) {
//         zipCodeCache.current[zipCode] = { ...result, timestamp: now };
//         setFilter({
//           latitude: String(result.latitude),
//           longitude: String(result.longitude),
//           address: result.address,
//         });
//       } else {
//         toast.error(
//           t("zipcode_error") ||
//             "Could not fetch coordinates. Please try a valid ZIP."
//         );
//       }
//     } catch {
//       toast.error(
//         t("zipcode_error") ||
//           "Could not fetch coordinates. Please try a valid ZIP."
//       );
//     }
//   };

//   const handleGetLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const zipCode = e.target.value;
//     setFilter({ zip_code: String(zipCode) });

//     if (zipCodeTimeoutRef.current) clearTimeout(zipCodeTimeoutRef.current);

//     zipCodeTimeoutRef.current = setTimeout(() => {
//       fetchCoordinates(zipCode);
//     }, 800);
//   };

//   useEffect(() => {
//     return () => {
//       if (zipCodeTimeoutRef.current) clearTimeout(zipCodeTimeoutRef.current);
//     };
//   }, []);

//   // Save filters and cookie on Change button
//   const handleSeeListings = () => {
//     if (zipCodeTimeoutRef.current) clearTimeout(zipCodeTimeoutRef.current);

//     startTransition(() => {
//       let lat, lng, address;
//       if (selected && selected.lat && selected.lng) {
//         lat = selected.lat;
//         lng = selected.lng;
//         address = selected.address;
//       } else {
//         lat = filter.latitude;
//         lng = filter.longitude;
//         address = filter.address;
//       }

//       setFilter({ latitude: String(lat), longitude: String(lng), address });
//       saveLocationFilters({
//         zip_code: String(filter.zip_code),
//         latitude: String(lat),
//         longitude: String(lng),
//         address,
//         kilometers: String(filter.kilometers),
//       });

//       // Save cookie here
//     });

//     handleClose();
//   };

//   return (
//     <Dialog open={show} onOpenChange={(isOpen) => !isOpen && handleClose()}>
//       <DialogContent className="max-w-md p-6 rounded-lg shadow-xl space-y-6 overflow-y-auto max-h-[95vh]">
//         <DialogHeader className="relative">
//           <DialogTitle className="text-[28px] font-bold">
//             {t("location")}
//           </DialogTitle>
//           <DialogClose className="absolute top-4 end-4 text-gray-400 hover:text-gray-600 focus:outline-none" />
//         </DialogHeader>

//         {/* Delivery Methods */}
//         <div className="flex flex-col gap-1">
//           <label className="font-bold mb-2">{t("delivery_methods")}</label>
//           <RadioGroup
//             defaultValue={selectedMethod}
//             onValueChange={(val) =>
//               onUpdateFilter({ key: "delivery_method", value: val })
//             }
//             className="flex flex-col gap-3"
//           >
//             {SHIPPING_METHODS.map((item) => (
//               <div
//                 key={item.value}
//                 className="flex items-center gap-3 rtl:flex-row-reverse"
//               >
//                 <RadioGroupItem
//                   value={item.value}
//                   id={item.value}
//                   className="border-[1px] border-[var(--darkColor)] data-[state=checked]:bg-[var(--mainColor)] data-[state=checked]:border-[var(--mainColor)] data-[state=checked]:text-white data-[state=checked]:[&>span>svg]:fill-white"
//                 />
//                 <Label htmlFor={item.value}>{t(item.name)}</Label>
//               </div>
//             ))}
//           </RadioGroup>
//         </div>

//         {/* Country Select */}
//         <SelectField
//           label={t("country")}
//           id="country_id"
//           value={selectedCountry}
//           onChange={(val) => {
//             setSelectedCountry(val);
//             const foundCountry =
//               countries.find((el) => el.id === Number(val)) || null;
//             setCountryData(foundCountry);
//             setCookie("countryId", selectedCountry);
//             // reset map/search on country change
//             setSelected({ lat: 0, lng: 0, address: "", kilometers: 60 });
//             setFilter({
//               zip_code: "",
//               latitude: "",
//               longitude: "",
//               address: "",
//               kilometers: 60,
//             });
//           }}
//           options={countries.map((country) => ({
//             label: country.title ?? "",
//             value: country.id?.toString() ?? "",
//           }))}
//           placeholder={t("search")}
//         />

//         {/* ZIP Code / Map */}
//         {selectedCountry === "1" ? (
//           <div className="flex flex-col gap-6">
//             <div className="grid w-full gap-1 relative">
//               <Label htmlFor="zip" className="font-bold mb-2">
//                 {t("enter_zip")}
//               </Label>
//               <Input
//                 id="zip"
//                 placeholder={t("enter_zip")}
//                 value={filter.zip_code}
//                 onChange={handleGetLocation}
//                 className="px-4 h-[48px] rounded-[12px] border-[var(--lightBorderColor)]"
//               />
//             </div>
//             <input
//               id="address"
//               readOnly
//               value={filter.address}
//               className="px-2 text-xs -mt-5 h-[28px] border-[var(--lightBorderColor)] border-t-0 border-r-0 border-l-0 shadow-none"
//             />
//           </div>
//         ) : (
//           <div className="py-2 space-y-4">
//             <h1 className="font-semibold -mt-8 mb-0">{t("search")}</h1>
//            <LocationSearchMap
//               countryData={countryData ?? undefined}
//               onChange={(pos) =>
//                 setSelected({ ...pos, kilometers: filter.kilometers ?? 60 })
//               }
//             />

//           </div>
//         )}

//         {/* Distance Range */}
//         <div className="flex flex-col gap-2">
//           <label htmlFor="distanceRange" className="font-bold">
//             {t("miles")}:
//           </label>
//           <div className="flex items-center gap-4">
//             <input
//               type="range"
//               id="distanceRange"
//               min="0"
//               max="100"
//               step="1"
//               value={filter.kilometers}
//               onChange={(e) =>
//                 onUpdateFilter({ key: "kilometers", value: e.target.value })
//               }
//               className="flex-1 h-[10px] rounded-full bg-[#ddd] accent-[var(--mainColor)] appearance-none"
//             />
//             <div className="relative min-w-[100px] px-6 py-2 bg-[var(--mainColor)] text-white rounded-md flex justify-center items-center gap-1 text-sm">
//               <span className="font-bold">
//                 {filter.kilometers === 100
//                   ? t("maximum")
//                   : `${filter.kilometers} ${t("miles")}`}
//               </span>
//               <div className="absolute w-4 h-4 bg-[var(--mainColor)] rotate-45 start-[-8px] top-1/2 -translate-y-1/2 rounded-sm" />
//             </div>
//           </div>
//         </div>

//         {/* Apply Button */}
//         <div className="flex items-center gap-2 mb-0">
//           <button
//             className="w-full px-4 py-2 rounded-full bg-[var(--mainColor)] text-white font-medium"
//             onClick={handleSeeListings}
//           >
//             {isPending ? t("loading") : t("change")}
//           </button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useHomeFilter } from "@/features/listing/store";
import { saveLocationFilters } from "@/features/listing/action";
import { SHIPPING_METHODS } from "@/utils/constants";
import { useEffect, useRef, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Input } from "../ui/input";
import { getCoordinates } from "@/utils/getCoordinatesByZipCode";
import { toast } from "sonner";
import { Country } from "@/types/country";
import SelectField from "../shared/SelectField";
import { getCookie, setCookie } from "@/lib/utils";
import { User } from "@/types/user";
import LocationSearchMap from "./LocationPicker";

interface SearchByModalProps {
  show: boolean;
  handleClose: () => void;
  countries: Country[];
  user: User | null;
}

export default function SearchByModal({
  show,
  handleClose,
  countries,
  user,
}: SearchByModalProps) {
  const t = useTranslations("common");

  // -------------------------
  // Initial Country & State
  // -------------------------
  const cookieCountry = getCookie("countryId");
  const initialCountry =
    cookieCountry ||
    user?.country_id?.toString() ||
    countries[0]?.id?.toString() ||
    "";

  const { filter, setFilter } = useHomeFilter();
  const [isPending, startTransition] = useTransition();

  const [selectedCountry, setSelectedCountry] =
    useState<string>(initialCountry);
  const [countryData, setCountryData] = useState<Country | null>(
    countries.find((el) => el.id === Number(initialCountry)) || null
  );

  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
    kilometers: number;
  } | null>(null);

  const selectedMethod = filter.delivery_method;

  // -------------------------
  // ZIP Code Handling
  // -------------------------
  const zipCodeCache = useRef<{
    [zipCode: string]: {
      latitude: number;
      longitude: number;
      address: string;
      timestamp: number;
    };
  }>({});
  const zipCodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastZipCodeRef = useRef<string>("");

  const fetchCoordinates = async (zipCode: string) => {
    if (!zipCode || zipCode === lastZipCodeRef.current) return;
    lastZipCodeRef.current = zipCode;

    // Check cache (1 hour validity)
    const cached = zipCodeCache.current[zipCode];
    if (cached && Date.now() - cached.timestamp < 3600000) {
      setFilter({
        latitude: String(cached.latitude),
        longitude: String(cached.longitude),
        address: cached.address,
      });
      return;
    }

    try {
      const result = await getCoordinates(zipCode);
      if (!result) throw new Error("Invalid ZIP");
      zipCodeCache.current[zipCode] = { ...result, timestamp: Date.now() };
      setFilter({
        latitude: String(result.latitude),
        longitude: String(result.longitude),
        address: result.address,
      });
    } catch (err) {
      console.log(err);
      setFilter({ latitude: "", longitude: "", address: "" });
      toast.error(t("zipcode_error") || "Invalid ZIP code");
    }
  };

  const handleZipInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const zipCode = e.target.value;
    setFilter({ zip_code: zipCode });

    // Debounce API call
    if (zipCodeTimeoutRef.current) clearTimeout(zipCodeTimeoutRef.current);
    zipCodeTimeoutRef.current = setTimeout(
      () => fetchCoordinates(zipCode),
      800
    );
  };

  useEffect(() => {
    return () => {
      if (zipCodeTimeoutRef.current) clearTimeout(zipCodeTimeoutRef.current);
    };
  }, []);

  // -------------------------
  // Filter updates helper
  // -------------------------
  const onUpdateFilter = ({ key, value }: { key: string; value: string }) => {
    setFilter({ [key]: value });
  };

  // -------------------------
  // Apply / Save Filters
  // -------------------------
  const handleApplyFilters = () => {
    if (zipCodeTimeoutRef.current) clearTimeout(zipCodeTimeoutRef.current);

    startTransition(() => {
      const lat = selectedLocation?.lat || filter.latitude;
      const lng = selectedLocation?.lng || filter.longitude;
      const address = selectedLocation?.address || filter.address;

      if (!lat || !lng) {
        toast.error(
          t("location_required") || "Please select a valid location."
        );
        return;
      }

      setFilter({ latitude: String(lat), longitude: String(lng), address });
      saveLocationFilters({
        zip_code: String(filter.zip_code),
        latitude: String(lat),
        longitude: String(lng),
        address,
        kilometers: String(filter.kilometers || 60),
      });
      setCookie("countryId", selectedCountry); // Save current country
      handleClose();
    });
  };

  // -------------------------
  // Country change handler
  // -------------------------
  const handleCountryChange = (val: string) => {
    setSelectedCountry(val);
    const foundCountry = countries.find((el) => el.id === Number(val)) || null;
    setCountryData(foundCountry);

    // Reset location data
    setSelectedLocation(null);
    setFilter({
      zip_code: "",
      latitude: "",
      longitude: "",
      address: "",
      kilometers: 60,
      delivery_method: filter.delivery_method,
    });
  };

  // -------------------------
  // Render
  // -------------------------
  return (
    <Dialog open={show} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-md p-6 rounded-lg shadow-xl space-y-6 overflow-y-auto max-h-[95vh]">
        <DialogHeader className="relative">
          <DialogTitle className="text-[28px] font-bold">
            {t("location")}
          </DialogTitle>
          <DialogClose className="absolute top-4 end-4 text-gray-400 hover:text-gray-600 focus:outline-none" />
        </DialogHeader>

        {/* Delivery Methods */}
        <div className="flex flex-col gap-1">
          <Label className="font-bold mb-2">{t("delivery_methods")}</Label>
          <RadioGroup
            value={selectedMethod || ""}
            onValueChange={(val) =>
              onUpdateFilter({ key: "delivery_method", value: val })
            }
            className="flex flex-col gap-3"
          >
            {SHIPPING_METHODS.map((item) => (
              <div
                key={item.value}
                className="flex items-center gap-3 rtl:flex-row-reverse"
              >
                <RadioGroupItem
                  value={item.value}
                  id={item.value}
                  className="border-[1px] border-[var(--darkColor)] data-[state=checked]:bg-[var(--mainColor)] data-[state=checked]:border-[var(--mainColor)] data-[state=checked]:text-white data-[state=checked]:[&>span>svg]:fill-white"
                />
                <Label htmlFor={item.value}>{t(item.name)}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Country Select */}
        <SelectField
          label={t("country")}
          id="country_id"
          value={selectedCountry}
          onChange={handleCountryChange}
          options={countries.map((c) => ({
            label: c.title || "",
            value: c.id?.toString() || "",
          }))}
          placeholder={t("search")}
        />

        {/* ZIP Code / Map */}
        {selectedCountry === "1" ? (
          <div className="flex flex-col gap-6">
            <div className="grid w-full gap-1 relative">
              <Label htmlFor="zip" className="font-bold mb-2">
                {t("enter_zip")}
              </Label>
              <Input
                id="zip"
                placeholder={t("enter_zip")}
                value={filter.zip_code || ""}
                onChange={handleZipInput}
                className="px-4 h-[48px] rounded-[12px] border-[var(--lightBorderColor)]"
              />
            </div>
            <input
              id="address"
              readOnly
              value={filter.address || ""}
              className="px-2 text-xs -mt-5 h-[28px] border-[var(--lightBorderColor)] border-t-0 border-r-0 border-l-0 shadow-none"
            />
          </div>
        ) : (
          <div className="py-2 space-y-4">
            <h1 className="font-semibold -mt-8 mb-0">{t("search")}</h1>
            <LocationSearchMap
              countryData={countryData || undefined}
              onChange={(pos) =>
                setSelectedLocation({
                  ...pos,
                  kilometers: filter.kilometers || 60,
                })
              }
            />
          </div>
        )}

        {/* Distance Range */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="distanceRange" className="font-bold">
            {t("miles")}:
          </Label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              id="distanceRange"
              min="0"
              max="100"
              step="1"
              value={filter.kilometers || 60}
              onChange={(e) =>
                onUpdateFilter({ key: "kilometers", value: e.target.value })
              }
              className="flex-1 h-[10px] rounded-full bg-[#ddd] accent-[var(--mainColor)] appearance-none"
            />
            <div className="relative min-w-[100px] px-6 py-2 bg-[var(--mainColor)] text-white rounded-md flex justify-center items-center gap-1 text-sm">
              <span className="font-bold">
                {filter.kilometers === 100
                  ? t("maximum")
                  : `${filter.kilometers} ${t("miles")}`}
              </span>
              <div className="absolute w-4 h-4 bg-[var(--mainColor)] rotate-45 start-[-8px] top-1/2 -translate-y-1/2 rounded-sm" />
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="flex items-center gap-2 mb-0">
          <button
            className="w-full px-4 py-2 rounded-full bg-[var(--mainColor)] text-white font-medium"
            onClick={handleApplyFilters}
            disabled={isPending}
          >
            {isPending ? t("loading") : t("change")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
