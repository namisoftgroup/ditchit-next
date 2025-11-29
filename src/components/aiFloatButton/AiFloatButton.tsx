"use client";

import { useState } from "react";
import ChooseValueModal from "./ChooseValueModal";
import ResultValueModal from "./ResultValueModal";

const AiFloatButton = () => {
  const [showModalAi, setShowModalAi] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // Simulate API call or processing
      setTimeout(() => {
        setShowModalAi(false);
        setShowResultModal(true);
      }, 1000);
    }
  };

  const handleGalleryClick = () => {
    // Trigger the hidden file input
    const fileInput = document.getElementById("image-upload");
    fileInput?.click();
  };

  return (
    <>
      {/* Floating AI Button */}
      <div
        onClick={() => setShowModalAi(true)}
        className="fixed bottom-8 right-10 bg-green-500 rounded-full shadow-lg z-50 animate-bounce cursor-pointer"
      >
        <img
          src="/images/avatar.svg"
          alt="AI Chat"
          className="w-12 h-12 cursor-pointer hover:opacity-80"
        />
      </div>

      {/* Hidden file input */}
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />

      {/* First Modal - Image Selection */}
      <ChooseValueModal
        showModalAi={showModalAi}
        setShowModalAi={setShowModalAi}
        handleGalleryClick={handleGalleryClick}
      />
      {/* Second Modal - Result */}
      <ResultValueModal
        showResultModal={showResultModal}
        setShowResultModal={setShowResultModal}
      />
    </>
  );
};

export default AiFloatButton;
