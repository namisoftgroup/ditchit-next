import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Check, Upload } from "lucide-react";
import Image from "next/image";

type UploadStatus = "idle" | "uploading" | "success" | "failed";

interface UploadImage {
  file: File;
  preview: string;
  progress: number;
  status: UploadStatus;
}

interface MediaFieldProps {
  customStyle?: string;
  label?: string;
  multiple?: boolean;
  maxFiles?: number;
}

export default function MediaUpload({
  customStyle,
  label,
  multiple = false,
  maxFiles = 4,
}: MediaFieldProps) {
  const [images, setImages] = useState<UploadImage[]>([]);

  const uploadImage = (img: UploadImage, index: number) => {
    const interval = setInterval(() => {
      setImages((prev) => {
        const updated = [...prev];
        const current = updated[index];

        if (!current) return prev;

        if (current.progress >= 100) {
          clearInterval(interval);
          current.status = "success";
        } else {
          current.progress += 10;
          current.status = "uploading";
        }

        return updated;
      });
    }, 200);
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setImages((prev) => {
        const remainingSlots = multiple
          ? maxFiles - prev.length
          : prev.length > 0
            ? 0
            : 1;
        const selectedFiles = acceptedFiles.slice(0, remainingSlots);

        const newImages = selectedFiles.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
          progress: 0,
          status: "idle" as UploadStatus,
        }));

        const updated = [...prev, ...newImages];
        updated.forEach((img, i) => {
          if (img.status === "idle") uploadImage(img, i);
        });

        return updated;
      });
    },
    [multiple, maxFiles]
  );

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple,
  });

  return (
    <div className={`space-y-4 whitespace-nowrap h-full ${customStyle}`}>
      <p className="font-bold text-[14px] mb-2">{label}</p>

      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-100 rounded-md p-4 cursor-pointer"
      >
        <input {...getInputProps()} />

        {images.length === 0 && (
          <div className="flex flex-col items-center gap-[12px]">
            <div className="w-12 h-12 rounded-[8px] bg-[#f5f5f5] flex items-center justify-center">
              <Upload className="text-gray-500" width={16} height={16} />
            </div>
            <p className="text-gray-800 text-center text-[14px]">
              Click or drag images here
            </p>
          </div>
        )}

        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 mt-4">
          {images.map((img, index) => (
            <div
              key={index}
              className="rounded-md bg-white overflow-hidden shadow-[0_0.1875rem_0.75rem_0_rgba(47,43,61,0.14)] flex flex-col items-center relative"
            >
              <div className="relative w-full h-42 p-2">
                <Image
                  src={img.preview}
                  alt={`upload-${index}`}
                  fill
                  className="object-cover"
                />

                {img.status === "uploading" && (
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-white text-xs">
                    {img.progress}%
                  </div>
                )}

                {img.status === "success" && (
                  <div className="absolute inset-0 w-14 h-14 rounded-full bg-[#2f334980] bg-opacity-80 flex items-center justify-center m-auto">
                    <Check className="text-white w-8 h-8" />
                  </div>
                )}

                {img.status === "failed" && (
                  <div className="absolute inset-0 bg-red-500 bg-opacity-40 flex items-center justify-center rounded">
                    <span className="text-white text-xs">Failed</span>
                  </div>
                )}
              </div>

              <div className="text-sm w-full border-t border-gray-200 text-gray-700 p-2">
                <p className="truncate w-full text-[12px] text-gray-500">
                  {img.file.name}
                </p>
                <p className="text-[10px] italic text-gray-400 m-0 font-bold">
                  {(img.file.size / 1024).toFixed(1)} KB
                </p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="w-full px-3 py-2 border-t border-gray-200 text-[var(--grayColor)] text-xs hover:bg-gray-50 transition"
              >
                Remove file
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
