import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import Image from "next/image";

const ResultValueModal = ({ showResultModal, setShowResultModal }: any) => {
  return (
    <Dialog open={showResultModal} onOpenChange={setShowResultModal}>
      <DialogContent className="sm:max-w-md p-0">
        <CardContent className="p-0">
          <div className=" mb-4">
            <Image
              src="/images/product.webp"
              alt="product image"
              width={500}
              height={300}
              className="w-full h-[300px] object-cover rounded-md"
            />
          </div>
          <div className="px-4 py-6">

 
          <div className=" mb-4">
            <h3 className=" font-bold  mb-4">Range Rover Vogue</h3>
            <h3 className="text-xs text-gray-500  mb-1">Average prices:</h3>
            <p className=" font-bold ">$10,000</p>
          </div>

          <div className="flex space-x-24 text-sm text-gray-600 mb-6">
            <div className="flex space-x-1 items-center">
              <p className="text-[10px] font-medium">MIN : </p>
              <span className="text-[11px]  text-black font-bold">$10,000</span>
            </div>
            <div className="flex space-x-1 items-center">
              <p className="text-[10px] font-medium">Max : </p>
              <span className="text-[11px] text-black  font-bold">$10,000</span>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button className="flex-1 py-5 rounded-xl text-green-600 border border-green-600 hover:bg-green-600 hover:text-white">
              Sell
            </Button>
            <Button className="flex-1 py-5 rounded-xl text-white bg-green-600   hover:bg-transparent hover:text-green-600 hover:border hover:border-green-600 ">
              List Similar
            </Button>
          </div>
                   </div>
        </CardContent>
      </DialogContent>
    </Dialog>
  );
};

export default ResultValueModal;
