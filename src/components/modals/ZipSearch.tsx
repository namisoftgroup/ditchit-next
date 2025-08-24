import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useHomeFilter } from "@/features/home/store";
import { saveLocationFilters } from "@/features/listing/action";
import { useTransition } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function ZipSearch({
  show,
  handleClose,
  handleBack,
}: {
  show: boolean;
  handleBack: () => void;
  handleClose: () => void;
}) {
  const { filter } = useHomeFilter();
  const [isPending, startTransition] = useTransition();

  // const onUpdateFilter = ({ key, value }: { key: string; value: string }) => {
  //   setFilter({ [key]: value });
  // };

  const handleSeeListings = () => {
    startTransition(() => {
      saveLocationFilters({
        zip_code: String(filter.zip_code),
      });
    });

    handleClose();
  };

  return (
    <Dialog open={show} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-md p-6 rounded-lg bg-white shadow-xl space-y-6">
        <DialogHeader className="relative">
          <DialogTitle className="text-[28px] font-bold">ZIP Code</DialogTitle>
          <DialogClose className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none" />
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <div className="grid w-full items-center gap-1 relative">
            <Label
              htmlFor="zip"
              className="font-bold flex items-center gap-2 mb-2"
            >
              Enter ZIP code
            </Label>

            <Input
              id="zip"
              className="px-4 h-[48px] rounded-[12px] border-[var(--lightBorderColor)]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mb-0">
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
