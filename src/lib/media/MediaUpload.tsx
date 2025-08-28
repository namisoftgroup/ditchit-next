"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Check, Upload } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { formatFileSize, getFileInfo } from "@/lib/media/helpers";
import Image from "next/image";
import { useTranslations } from "next-intl";

type UploadStatus = "idle" | "uploading" | "success" | "failed";

interface MediaUploadProps {
  name: string;
  label?: string;
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
}

type FilePreview = {
  file: File | string;
  preview: string;
  status: UploadStatus;
  uploaded: boolean;
  name: string;
  size: number;
};

function FilePreviews({
  files,
  onRemove,
}: {
  files: (File | string)[];
  onRemove: (index: number) => void;
}) {
  const [previews, setPreviews] = useState<FilePreview[]>([]);
  const t = useTranslations("common")

  useEffect(() => {
    const loadPreviews = async () => {
      const loadedPreviews = await Promise.all(
        files.map(async (file) => {
          if (typeof file === "string") {
            try {
              const fileInfo = await getFileInfo(file);
              return {
                file,
                preview: file,
                status: "success" as UploadStatus,
                uploaded: true,
                name: fileInfo.name,
                size: fileInfo.size,
              };
            } catch (error) {
              console.error("Error loading file info:", error);
              return {
                file,
                preview: file,
                status: "success" as UploadStatus,
                uploaded: true,
                name: "Unknown file",
                size: 0,
              };
            }
          }

          return {
            file,
            preview: URL.createObjectURL(file as File),
            status: "success" as UploadStatus,
            uploaded: false,
            name: (file as File).name,
            size: (file as File).size,
          };
        })
      );

      setPreviews(loadedPreviews);
    };

    loadPreviews();

    return () => {
      previews.forEach((preview) => {
        if (!preview.uploaded && preview.preview) {
          URL.revokeObjectURL(preview.preview);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  if (previews.length === 0) return null;

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
      {previews.map((img, index) => (
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
              onLoad={() => {
                if (!img.uploaded) {
                  URL.revokeObjectURL(img.preview);
                }
              }}
            />
            <div className="absolute inset-0 w-14 h-14 rounded-full bg-[#2f334980] bg-opacity-80 flex items-center justify-center m-auto">
              <Check className="text-white w-8 h-8" />
            </div>
          </div>

          <div className="text-sm w-full border-t border-gray-200 text-gray-700 p-2">
            <p className="truncate w-full text-[12px] text-gray-500 max-w-[168px]">
              {img.name}
            </p>
            <p className="text-[10px] italic text-gray-400 m-0 font-bold">
              {formatFileSize(img.size)}
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(index);
            }}
            className="w-full px-3 py-2 border-t border-gray-200 text-[var(--grayColor)] text-xs hover:bg-gray-50 transition"
          >
            {t("remove_file")}
          </button>
        </div>
      ))}
    </div>
  );
}

export default function MediaUpload({
  name,
  label,
  multiple = false,
  maxFiles = 1,
  className = "",
}: MediaUploadProps) {
  const { control, setValue, getValues } = useFormContext();
  const t = useTranslations("common");

  const handleAddFiles = useCallback(
    (acceptedFiles: File[]) => {
      const currentFiles = getValues(name);
      const remainingSlots = multiple
        ? maxFiles - (Array.isArray(currentFiles) ? currentFiles.length : 0)
        : 1;

      const newFiles = acceptedFiles.slice(0, remainingSlots);

      const updatedFiles = multiple
        ? [...(Array.isArray(currentFiles) ? currentFiles : []), ...newFiles]
        : newFiles.length > 0
          ? newFiles[0]
          : null;

      setValue(name, updatedFiles, { shouldValidate: true });
    },
    [getValues, setValue, name, multiple, maxFiles]
  );

  const handleRemoveFile = useCallback(
    (index: number) => {
      const current = getValues(name);
      if (multiple && Array.isArray(current)) {
        const updated = current.filter((_, i) => i !== index);
        setValue(name, updated, { shouldValidate: true });
      } else {
        setValue(name, null, { shouldValidate: true });
      }
    },
    [getValues, setValue, name, multiple]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleAddFiles,
    accept: { "image/*": [] },
    multiple,
  });

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const files: (File | string)[] = multiple
          ? Array.isArray(field.value)
            ? field.value
            : []
          : field.value
            ? [field.value]
            : [];

        return (
          <div className={`space-y-4 ${className}`}>
            {label && <p className="font-bold text-[14px] mb-2">{label}</p>}

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-md p-4 cursor-pointer ${
                error ? "border-red-500" : "border-gray-100"
              }`}
            >
              <input {...getInputProps()} />

              {files.length === 0 && (
                <div className="flex flex-col items-center gap-[12px]">
                  <div className="w-12 h-12 rounded-[8px] bg-[#f5f5f5] flex items-center justify-center">
                    <Upload className="text-gray-500" width={16} height={16} />
                  </div>
                  <p className="text-gray-800 text-center text-[14px]">
                    {t("drag_drop")}
                  </p>
                </div>
              )}

              <FilePreviews files={files} onRemove={handleRemoveFile} />
            </div>

            {error && (
              <p className="text-red-500 text-xs mt-1">{error.message ? t(error.message) : undefined}</p>
            )}
          </div>
        );
      }}
    />
  );
}
