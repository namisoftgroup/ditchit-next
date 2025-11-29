import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ChooseValueModal = ({
  showModalAi,
  setShowModalAi,
  handleGalleryClick,
}: any) => {
  return (
    <Dialog open={showModalAi} onOpenChange={setShowModalAi} >
      <DialogContent className="sm:max-w-md py-7">
        <DialogHeader >
          <DialogTitle className="flex items-center justify-center space-x-2 pt-4">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="ml-2 font-bold"> Get Estimated Value Of Item</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-between space-x-8 mt-6 w-2/3 mx-auto">
          {/* Camera Option */}
          <div className="flex flex-col items-center space-y-2 cursor-pointer">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <span className="text-sm text-gray-500 font-medium">Camera</span>
          </div>

          {/* Gallery Option */}
          <div
            className="flex flex-col items-center space-y-2 cursor-pointer"
            onClick={handleGalleryClick}
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-sm text-gray-500 font-medium">Gallery</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChooseValueModal;
