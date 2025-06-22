// app/admin/gallery/events/[id]/upload/page.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  Video,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

interface UploadFile {
  file: File;
  preview: string;
  title: string;
  description: string;
  mediaType: "IMAGE" | "VIDEO";
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
  cloudinaryUrl?: string;
  publicId?: string;
}

export default function MediaUploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStats, setUploadStats] = useState({
    total: 0,
    completed: 0,
    failed: 0,
  });

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    router.push("/admin/login");
    return null;
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    const newFiles: UploadFile[] = selectedFiles
      .map((file) => {
        const isVideo = file.type.startsWith("video/");
        const isImage = file.type.startsWith("image/");

        if (!isVideo && !isImage) {
          return null;
        }

        // Check file size (100MB limit)
        if (file.size > 100 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is 100MB.`);
          return null;
        }

        return {
          file,
          preview: URL.createObjectURL(file),
          title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
          description: "",
          mediaType: isVideo ? "VIDEO" : "IMAGE",
          progress: 0,
          status: "pending" as const,
        };
      })
      .filter(Boolean) as UploadFile[];

    setFiles((prev) => [...prev, ...newFiles]);

    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const updateFile = (index: number, updates: Partial<UploadFile>) => {
    setFiles((prev) =>
      prev.map((file, i) => (i === index ? { ...file, ...updates } : file))
    );
  };

  const uploadToCloudinary = async (
    file: File,
    eventId: string,
    mediaType: string
  ): Promise<any> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("eventId", eventId);
    formData.append("mediaType", mediaType);

    const response = await fetch("/api/storage/cloudinary/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Upload failed");
    }

    return response.json();
  };

  const uploadSingleFile = async (fileData: UploadFile, index: number) => {
    try {
      updateFile(index, { status: "uploading", progress: 10 });

      // Upload to Cloudinary
      const cloudinaryResult = await uploadToCloudinary(
        fileData.file,
        eventId,
        fileData.mediaType
      );

      updateFile(index, {
        progress: 60,
        cloudinaryUrl: cloudinaryResult.url,
        publicId: cloudinaryResult.publicId,
      });

      // Save to database
      const dbResponse = await fetch(
        `/api/admin/gallery/events/${eventId}/media`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: fileData.title,
            description: fileData.description,
            mediaUrl: cloudinaryResult.url,
            mediaType: fileData.mediaType,
            fileSize: cloudinaryResult.fileSize,
            mimeType: fileData.file.type,
            width: cloudinaryResult.width,
            height: cloudinaryResult.height,
            duration: cloudinaryResult.duration || null,
            cloudinaryPublicId: cloudinaryResult.publicId,
            orderIndex: index,
          }),
        }
      );

      if (!dbResponse.ok) {
        throw new Error("Failed to save media to database");
      }

      updateFile(index, { status: "success", progress: 100 });

      setUploadStats((prev) => ({
        ...prev,
        completed: prev.completed + 1,
      }));
    } catch (error: any) {
      console.error("Upload error:", error);
      updateFile(index, {
        status: "error",
        error: error.message,
        progress: 0,
      });

      setUploadStats((prev) => ({
        ...prev,
        failed: prev.failed + 1,
      }));
    }
  };

  const handleUploadAll = async () => {
    const pendingFiles = files.filter((file) => file.status === "pending");

    if (pendingFiles.length === 0) {
      alert("No pending files to upload");
      return;
    }

    setIsUploading(true);
    setUploadStats({
      total: pendingFiles.length,
      completed: 0,
      failed: 0,
    });

    // Upload files in batches of 3 to avoid overwhelming the server
    for (let i = 0; i < pendingFiles.length; i += 3) {
      const batch = pendingFiles.slice(i, i + 3);
      const batchPromises = batch.map((file) => {
        const originalIndex = files.indexOf(file);
        return uploadSingleFile(file, originalIndex);
      });

      await Promise.allSettled(batchPromises);
    }

    setIsUploading(false);

    // Check if all uploads were successful
    const allSuccess = files.every(
      (file) => file.status === "success" || file.status === "pending"
    );

    if (allSuccess && uploadStats.failed === 0) {
      // Auto-redirect after successful upload
      setTimeout(() => {
        router.push(`/admin/gallery/events/${eventId}`);
      }, 2000);
    }
  };

  const retryUpload = (index: number) => {
    updateFile(index, {
      status: "pending",
      error: undefined,
      progress: 0,
    });
  };

  const formatFileSize = (bytes: number): string => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link href={`/admin/gallery/events/${eventId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Event
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Upload Media</h1>
          <p className="text-muted-foreground">
            Add photos and videos to this event
          </p>
        </div>
      </div>

      {/* Upload Progress Summary */}
      {isUploading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>
                  {uploadStats.completed + uploadStats.failed} /{" "}
                  {uploadStats.total}
                </span>
              </div>
              <Progress
                value={
                  ((uploadStats.completed + uploadStats.failed) /
                    uploadStats.total) *
                  100
                }
                className="h-2"
              />
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div className="font-bold text-blue-600">
                    {uploadStats.total}
                  </div>
                  <div className="text-muted-foreground">Total</div>
                </div>
                <div>
                  <div className="font-bold text-green-600">
                    {uploadStats.completed}
                  </div>
                  <div className="text-muted-foreground">Completed</div>
                </div>
                <div>
                  <div className="font-bold text-red-600">
                    {uploadStats.failed}
                  </div>
                  <div className="text-muted-foreground">Failed</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cloudinary Info */}
      <Card>
        <CardHeader>
          <CardTitle>Storage: Cloudinary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-green-600" />
            Using Cloudinary for optimized media storage and delivery
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            • Automatic format optimization (WebP, AVIF) • Responsive image
            delivery • Video transcoding for web playback • Global CDN for fast
            loading
          </div>
        </CardContent>
      </Card>

      {/* File Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Select Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Click to select images and videos, or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                Supports: JPG, PNG, GIF, MP4, MOV, AVI (Max 100MB per file)
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Files to Upload ({files.length})</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    files.forEach((file) => URL.revokeObjectURL(file.preview));
                    setFiles([]);
                  }}
                  disabled={isUploading}
                >
                  Clear All
                </Button>
                <Button
                  onClick={handleUploadAll}
                  disabled={
                    isUploading ||
                    files.filter((f) => f.status === "pending").length === 0
                  }
                >
                  {isUploading
                    ? "Uploading..."
                    : `Upload All (${
                        files.filter((f) => f.status === "pending").length
                      })`}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((fileData, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex gap-4">
                    {/* Preview */}
                    <div className="relative w-20 h-20 bg-muted rounded overflow-hidden flex-shrink-0">
                      {fileData.mediaType === "IMAGE" ? (
                        <img
                          src={fileData.preview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-1 right-1">
                        {fileData.mediaType === "IMAGE" ? (
                          <ImageIcon className="h-3 w-3 text-white" />
                        ) : (
                          <Video className="h-3 w-3 text-white" />
                        )}
                      </div>
                    </div>

                    {/* File Details */}
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`title-${index}`}>Title</Label>
                          <Input
                            id={`title-${index}`}
                            value={fileData.title}
                            onChange={(e) =>
                              updateFile(index, { title: e.target.value })
                            }
                            disabled={
                              fileData.status === "uploading" ||
                              fileData.status === "success"
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor={`description-${index}`}>
                            Description (Optional)
                          </Label>
                          <Textarea
                            id={`description-${index}`}
                            value={fileData.description}
                            onChange={(e) =>
                              updateFile(index, { description: e.target.value })
                            }
                            disabled={
                              fileData.status === "uploading" ||
                              fileData.status === "success"
                            }
                            rows={1}
                          />
                        </div>
                      </div>

                      {/* File Info */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{fileData.file.name}</span>
                        <span>{formatFileSize(fileData.file.size)}</span>
                        <span>{fileData.mediaType}</span>
                      </div>

                      {/* Progress */}
                      {fileData.status === "uploading" && (
                        <div className="space-y-1">
                          <Progress value={fileData.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            Uploading to Cloudinary... {fileData.progress}%
                          </p>
                        </div>
                      )}

                      {/* Status */}
                      {fileData.status === "success" && (
                        <div className="text-sm text-green-600 font-medium flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Upload successful - Stored on Cloudinary
                        </div>
                      )}

                      {fileData.status === "error" && (
                        <div className="space-y-2">
                          <div className="text-sm text-red-600 font-medium">
                            ✗ Upload failed: {fileData.error}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => retryUpload(index)}
                          >
                            Retry
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        disabled={fileData.status === "uploading"}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      {uploadStats.total > 0 &&
        uploadStats.completed === uploadStats.total &&
        uploadStats.failed === 0 && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              All files uploaded successfully! Redirecting to event gallery...
            </AlertDescription>
          </Alert>
        )}
    </div>
  );
}
