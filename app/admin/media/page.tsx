"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Upload,
  Copy,
  Check,
  Image as ImageIcon,
  X,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface UploadedFile {
  url: string;
  publicId: string;
  originalName: string;
  format: string;
  width: number;
  height: number;
}

export default function MediaUploadPage() {
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [folderName, setFolderName] = useState("general");

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      setIsUploading(true);
      const file = acceptedFiles[0]; // Handle one file at a time for simplicity

      const formData = new FormData();
      formData.append("file", file);
      formData.append("eventId", folderName); // Using eventId as folder grouping
      formData.append(
        "mediaType",
        file.type.startsWith("video") ? "VIDEO" : "IMAGE"
      );

      try {
        const res = await fetch("/api/storage/cloudinary/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");

        const data = await res.json();

        const newFile: UploadedFile = {
          url: data.url,
          publicId: data.publicId,
          originalName: file.name,
          format: data.format,
          width: data.width,
          height: data.height,
        };

        setUploadedFiles((prev) => [newFile, ...prev]);
        toast({ title: "Success", description: "File uploaded successfully" });
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          variant: "destructive",
          description: "Failed to upload file",
        });
      } finally {
        setIsUploading(false);
      }
    },
    [folderName, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
      "video/*": [".mp4", ".webm"],
    },
    multiple: false,
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "URL copied to clipboard" });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-blue-950">Media Manager</h1>
        <p className="text-muted-foreground">
          Upload images and videos to generate links for your blog posts and
          pages.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Upload Area */}
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Upload New File</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Folder Name (Optional)</Label>
              <Input
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="e.g. blog-posts"
              />
            </div>

            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
                flex flex-col items-center justify-center gap-4 min-h-[200px]
                ${
                  isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-400 hover:bg-gray-50"
                }
              `}
            >
              <input {...getInputProps()} />
              {isUploading ? (
                <div className="flex flex-col items-center gap-2 text-blue-600">
                  <Loader2 className="h-10 w-10 animate-spin" />
                  <p className="text-sm font-medium">Uploading to Cloud...</p>
                </div>
              ) : (
                <>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-gray-900">Click to upload</p>
                    <p className="text-xs text-gray-500">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    Images & Videos up to 10MB
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results List */}
        <Card className="md:col-span-2 border-none shadow-none bg-transparent">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg">Recent Uploads</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            {uploadedFiles.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-xl border-gray-200">
                <ImageIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">
                  No files uploaded in this session.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {uploadedFiles.map((file, idx) => (
                  <div
                    key={file.publicId + idx}
                    className="flex items-center gap-4 p-4 bg-white rounded-xl border shadow-sm group hover:shadow-md transition-shadow"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-20 w-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border">
                      <Image
                        src={file.url}
                        alt={file.originalName}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-medium text-gray-900 truncate"
                        title={file.originalName}
                      >
                        {file.originalName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {file.width}x{file.height} • {file.format.toUpperCase()}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 truncate max-w-[200px] md:max-w-[300px]">
                          {file.url}
                        </code>
                      </div>
                    </div>

                    {/* Action */}
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => copyToClipboard(file.url)}
                      title="Copy URL"
                      className="h-10 w-10 shrink-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
