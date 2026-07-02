"use client";

import { useCallback, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { NoteImage } from "@/types/note";

interface ImageUploadProps {
  images: NoteImage[];
  onChange: (images: NoteImage[]) => void;
}

export function ImageUpload({ images, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      setUploading(true);
      const newImages: NoteImage[] = [];

      for (const file of Array.from(files)) {
        try {
          const formData = new FormData();
          formData.append("file", file);

          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            console.error("Upload failed:", await res.text());
            continue;
          }

          const data = await res.json();
          newImages.push({ url: data.url, name: data.name || file.name });
        } catch (err) {
          console.error("Upload failed:", err);
        }
      }

      onChange([...images, ...newImages]);
      setUploading(false);
      e.target.value = "";
    },
    [images, onChange]
  );

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label
          htmlFor="image-upload"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "cursor-pointer",
            uploading && "pointer-events-none opacity-50"
          )}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Upload className="h-4 w-4 mr-1" />
          )}
          Upload Image
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden"
        />
        <span className="text-xs text-muted-foreground">
          PNG, JPG, GIF up to 10MB
        </span>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((img, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden border border-border/50 aspect-square">
              <img
                src={img.url}
                alt={img.name || "Uploaded image"}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
