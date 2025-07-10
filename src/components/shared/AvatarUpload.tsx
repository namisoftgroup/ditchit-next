"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Plus, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";

interface AvatarUploadProps {
  initialImage?: string | null;
  onImageChange: (file: File) => void;
}

export function AvatarUpload({
  initialImage,
  onImageChange,
}: AvatarUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialImage || null
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.warning("Please upload an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.warning("File size should be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    onImageChange(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar
          className="w-[150px] h-[150px] cursor-pointer"
          onClick={triggerFileInput}
        >
          {previewUrl ? (
            <AvatarImage
              src={previewUrl}
              alt="Preview"
              className="border-[3px] border-gray-300 rounded-full object-cover"
            />
          ) : (
            <AvatarFallback
              key="fallback"
              className="border-[3px] border-gray-300 text-gray-300"
            >
              <UserRound className="w-12 h-12" />
            </AvatarFallback>
          )}
        </Avatar>

        <div className="flex gap-2 absolute bottom-2 left-2">
          <Button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--mainColor)] text-white border-[3px] border-white"
            onClick={previewUrl ? removeImage : triggerFileInput}
          >
            <Plus width={20} height={20} />
          </Button>
        </div>
      </div>

      <Input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
