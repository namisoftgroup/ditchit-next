import { useTransition } from "react";
import { toast } from "sonner";
import { useHomeFilter } from "@/features/listing/store";
import { getCoordinates } from "@/utils/getCoordinatesByZipCode";
import { saveLocationFilters } from "@/features/listing/action";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";

export default function ZipSearch({
  show,
  handleClose,
  handleBack,
}: {
  show: boolean;
  handleBack: () => void;
  handleClose: () => void;
}) {
  const { filter, setFilter } = useHomeFilter();
  const [isPending, startTransition] = useTransition();
    const t = useTranslations("common");

  const fetchCoordinates = async (zipCode: string) => {
    if (!zipCode) return;

    const result = await getCoordinates(String(zipCode));
    if (result) {
      setFilter({
        latitude: result.latitude,
        longitude: result.longitude,
        address: result.address,
      });
    } else {
      toast.error("Could not fetch coordinates. Please try a valid ZIP.");
    }
  };

  const handleGetLocation = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ zip_code: String(e.target.value) });
    fetchCoordinates(e.target.value);
  };

  const handleSeeListings = () => {
    startTransition(() => {
      saveLocationFilters({
        zip_code: String(filter.zip_code),
        latitude: filter.latitude,
        longitude: filter.longitude,
        address: filter.address,
      });
    });

    handleClose();
  };

  return (
    <Dialog open={show} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-md p-6 rounded-lg bg-white shadow-xl space-y-6">
        <DialogHeader className="relative">
          <DialogTitle className="text-[28px] font-bold">{t("zip_code")}</DialogTitle>
          <DialogClose className="absolute top-4 end-4 text-gray-400 hover:text-gray-600" />
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <div className="grid w-full gap-1 relative">
            <Label htmlFor="zip" className="font-bold mb-2">
             {t("enter_zip")}
            </Label>
            <Input
              id="zip"
              placeholder={t("enter_zip")}
              value={filter.zip_code}
              onChange={handleGetLocation}
              className="px-4 h-[48px] rounded-[12px] border-[var(--lightBorderColor)]"
            />
          </div>

          <div className="flex justify-center items-center relative">
            <span className="bg-white px-3 z-20">{t("or")}</span>
            <span className="absolute h-[1px] w-full bg-gray-100 z-0" />
          </div>

          <Input
            id="address"
            readOnly
            placeholder={t("address")}
            value={filter.address}
            className="px-4 h-[48px] rounded-[12px] border-[var(--lightBorderColor)]"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleBack}
            className="px-4 py-2 rounded-full bg-[var(--darkColor)] text-white whitespace-nowrap"
          >
            {t("back")}
          </button>
          <button
            className="w-full px-4 py-2 rounded-full bg-[var(--mainColor)] text-white font-medium"
            onClick={handleSeeListings}
          >
            {isPending ? t("loading") : t("change")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
