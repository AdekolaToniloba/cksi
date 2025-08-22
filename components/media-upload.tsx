// components/media-upload.tsx - Cloudinary upload component
"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Play, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MediaUploadProps {
  onUpload: (result: CloudinaryUploadResult) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  folder?: string;
}

interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  resource_type: "image" | "video";
  format: string;
  width?: number;
  height?: number;
  duration?: number;
  bytes: number;
}

export function MediaUpload({
  onUpload,
  acceptedTypes = ["image/*", "video/*"],
  maxSize = 50,
  folder = "cksi-uploads",
}: MediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedMedia, setUploadedMedia] =
    useState<CloudinaryUploadResult | null>(null);
  const { toast } = useToast();

  const handleFileUpload = useCallback(
    async (file: File) => {
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `File size must be less than ${maxSize}MB`,
          variant: "destructive",
        });
        return;
      }

      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "cksi_preset"
        );
        formData.append("folder", folder);

        const resourceType = file.type.startsWith("video/") ? "video" : "image";
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

        const response = await fetch(cloudinaryUrl, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const result: CloudinaryUploadResult = await response.json();
        setUploadedMedia(result);
        onUpload(result);

        toast({
          title: "Upload successful",
          description: "Media has been uploaded successfully.",
        });
      } catch (error) {
        console.error("Upload error:", error);
        toast({
          title: "Upload failed",
          description: "Failed to upload media. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    },
    [maxSize, folder, onUpload, toast]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    [handleFileUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    [handleFileUpload]
  );

  const removeMedia = () => {
    setUploadedMedia(null);
  };

  if (uploadedMedia) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            {uploadedMedia.resource_type === "video" ? (
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <video
                  src={uploadedMedia.secure_url}
                  className="w-full h-full object-cover"
                  controls
                />
                <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
                  <Play className="w-3 h-3 mr-1" />
                  Video
                </div>
              </div>
            ) : (
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={uploadedMedia.secure_url}
                  alt="Uploaded media"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
                  <ImageIcon className="w-3 h-3 mr-1" />
                  Image
                </div>
              </div>
            )}
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={removeMedia}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <p>ID: {uploadedMedia.public_id}</p>
            <p>Size: {(uploadedMedia.bytes / 1024 / 1024).toFixed(2)} MB</p>
            {uploadedMedia.duration && (
              <p>Duration: {uploadedMedia.duration}s</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={(e) => e.preventDefault()}
        >
          {isUploading ? (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-lg font-medium">Upload Media</p>
                <p className="text-sm text-gray-600">
                  Drag and drop or click to select
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Supports: {acceptedTypes.join(", ")} (Max {maxSize}MB)
                </p>
              </div>
              <Button variant="outline" className="relative">
                Upload File
                <input
                  type="file"
                  accept={acceptedTypes.join(",")}
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
