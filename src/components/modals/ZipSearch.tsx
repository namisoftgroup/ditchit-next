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
          <DialogTitle className="text-[28px] font-bold">ZIP Code</DialogTitle>
          <DialogClose className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" />
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <div className="grid w-full gap-1 relative">
            <Label htmlFor="zip" className="font-bold mb-2">
              Enter ZIP code
            </Label>
            <Input
              id="zip"
              placeholder="Enter ZIP code"
              value={filter.zip_code}
              onChange={handleGetLocation}
              className="px-4 h-[48px] rounded-[12px] border-[var(--lightBorderColor)]"
            />
          </div>

          <div className="flex justify-center items-center relative">
            <span className="bg-white px-3 z-20">OR</span>
            <span className="absolute h-[1px] w-full bg-gray-100 z-0" />
          </div>

          <Input
            id="address"
            readOnly
            placeholder="Address"
            value={filter.address}
            className="px-4 h-[48px] rounded-[12px] border-[var(--lightBorderColor)]"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleBack}
            className="px-4 py-2 rounded-full bg-[var(--darkColor)] text-white"
          >
            Back
          </button>
          <button
            className="w-full px-4 py-2 rounded-full bg-[var(--mainColor)] text-white font-medium"
            onClick={handleSeeListings}
          >
            {isPending ? "loading..." : "Change"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
