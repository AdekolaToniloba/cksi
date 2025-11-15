// app/admin/gallery/events/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Plus,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  Images,
  Play,
  Star,
  StarOff,
  Check,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface GalleryEvent {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  location: string | null;
  eventDate: string | null;
  coverImage: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MediaItem {
  id: string;
  title: string | null;
  description: string | null;
  mediaUrl: string;
  mediaType: "IMAGE" | "VIDEO";
  fileSize: number | null;
  mimeType: string | null;
  width: number | null;
  height: number | null;
  duration: number | null;
  orderIndex: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function EventMediaViewer() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<GalleryEvent | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [showCoverImageDialog, setShowCoverImageDialog] = useState(false);
  const [settingCoverImage, setSettingCoverImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaTypes = [
    { value: "all", label: "All Media" },
    { value: "IMAGE", label: "Images" },
    { value: "VIDEO", label: "Videos" },
  ];

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user && eventId) {
      fetchEventAndMedia();
    }
  }, [session, eventId]);

  const fetchEventAndMedia = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [eventResponse, mediaResponse] = await Promise.all([
        fetch(`/api/admin/gallery/events/${eventId}`),
        fetch(`/api/admin/gallery/events/${eventId}/media`),
      ]);

      if (!eventResponse.ok || !mediaResponse.ok) {
        throw new Error("Failed to fetch event data");
      }

      const [eventData, mediaData] = await Promise.all([
        eventResponse.json(),
        mediaResponse.json(),
      ]);

      setEvent(eventData.event);
      setMediaItems(mediaData.media || []);
    } catch (error: any) {
      console.error("Error fetching event data:", error);
      setError(error.message || "Failed to fetch event data");

      // Set demo data
      setEvent({
        id: eventId,
        title: "School Construction - Phase 1",
        slug: "school-construction-phase-1",
        description: "Building new classroom blocks in Lagos community",
        category: "education",
        location: "Lagos, Nigeria",
        eventDate: "2024-01-15T00:00:00Z",
        coverImage: "/placeholder.svg",
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setMediaItems([
        {
          id: "1",
          title: "Foundation Work",
          description: "Laying the foundation for the new classroom",
          mediaUrl: "/placeholder.svg",
          mediaType: "IMAGE",
          fileSize: 1024000,
          mimeType: "image/jpeg",
          width: 1920,
          height: 1080,
          duration: null,
          orderIndex: 1,
          isPublished: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetCoverImage = async (mediaUrl: string) => {
    try {
      setSettingCoverImage(true);

      const response = await fetch(`/api/admin/gallery/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverImage: mediaUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to update cover image");
      }

      const { event: updatedEvent } = await response.json();
      setEvent(updatedEvent);
      setShowCoverImageDialog(false);

      // Show success message
      alert("Cover image updated successfully!");
    } catch (error: any) {
      console.error("Error updating cover image:", error);
      alert("Failed to update cover image. Please try again.");
    } finally {
      setSettingCoverImage(false);
    }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    if (!confirm("Are you sure you want to delete this media item?")) return;

    try {
      const response = await fetch(
        `/api/admin/gallery/events/${eventId}/media/${mediaId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete media");
      }

      setMediaItems((prev) => prev.filter((item) => item.id !== mediaId));
    } catch (error: any) {
      console.error("Error deleting media:", error);
      alert("Failed to delete media. Please try again.");
    }
  };

  const toggleMediaPublished = async (
    mediaId: string,
    currentStatus: boolean
  ) => {
    try {
      const response = await fetch(
        `/api/admin/gallery/events/${eventId}/media/${mediaId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isPublished: !currentStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update media status");
      }

      setMediaItems((prev) =>
        prev.map((item) =>
          item.id === mediaId ? { ...item, isPublished: !currentStatus } : item
        )
      );
    } catch (error: any) {
      console.error("Error updating media status:", error);
      alert("Failed to update media status. Please try again.");
    }
  };

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return "Unknown";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const filteredMedia = mediaItems.filter((item) => {
    const matchesType =
      selectedType === "all" || item.mediaType === selectedType;
    const matchesSearch =
      !searchQuery ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Show loading while checking authentication
  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!session?.user) {
    return null;
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Event not found</h1>
          <Button asChild>
            <Link href="/admin/gallery">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Gallery
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const isCoverImage = (mediaUrl: string) => event?.coverImage === mediaUrl;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <Button variant="outline" asChild>
            <Link href="/admin/gallery">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button asChild>
              <Link href={`/admin/gallery/events/${eventId}/upload`}>
                <Plus className="h-4 w-4 mr-2" />
                Add Media
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/admin/gallery/events/edit/${eventId}`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Event
              </Link>
            </Button>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">{event.title}</h1>
            <Badge variant={event.isPublished ? "default" : "secondary"}>
              {event.isPublished ? "Published" : "Draft"}
            </Badge>
          </div>
          {event.description && (
            <p className="text-muted-foreground">{event.description}</p>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Error:</strong> {error}
            <br />
            <span className="text-sm mt-1 block">
              Showing demo data. Please check your API endpoints.
            </span>
          </AlertDescription>
        </Alert>
      )}

      {/* Cover Image Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Cover Image</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCoverImageDialog(true)}
            >
              <Star className="h-4 w-4 mr-2" />
              Set from Media
            </Button>
          </div>
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            {event.coverImage ? (
              <Image
                src={event.coverImage}
                alt="Cover image"
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <Images className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">No cover image set</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Media Type" />
          </SelectTrigger>
          <SelectContent>
            {mediaTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{mediaItems.length}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">
              {mediaItems.filter((item) => item.mediaType === "IMAGE").length}
            </div>
            <div className="text-sm text-muted-foreground">Images</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">
              {mediaItems.filter((item) => item.mediaType === "VIDEO").length}
            </div>
            <div className="text-sm text-muted-foreground">Videos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">
              {mediaItems.filter((item) => item.isPublished).length}
            </div>
            <div className="text-sm text-muted-foreground">Published</div>
          </CardContent>
        </Card>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredMedia.map((item) => (
          <Card
            key={item.id}
            className="overflow-hidden group hover:shadow-lg transition-all relative"
          >
            <div
              className="relative aspect-square cursor-pointer"
              onClick={() => setSelectedMedia(item)}
            >
              {item.mediaType === "IMAGE" ? (
                <Image
                  src={item.mediaUrl}
                  alt={item.title || "Media"}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
              ) : (
                <div className="w-full h-full bg-black flex items-center justify-center">
                  <Play className="h-12 w-12 text-white opacity-70" />
                </div>
              )}

              {/* Cover Image Indicator */}
              {isCoverImage(item.mediaUrl) && (
                <div className="absolute top-2 left-2">
                  <div className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 font-medium">
                    <Star className="h-3 w-3 fill-current" />
                    <span>Cover</span>
                  </div>
                </div>
              )}

              {/* Status Badge */}
              {!item.isPublished && (
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="text-xs">
                    Draft
                  </Badge>
                </div>
              )}

              {/* Action Buttons */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMediaPublished(item.id, item.isPublished);
                  }}
                >
                  {item.isPublished ? "Hide" : "Publish"}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteMedia(item.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {item.title && (
              <div className="p-2">
                <p className="text-xs font-medium line-clamp-1">{item.title}</p>
              </div>
            )}
          </Card>
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Images className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No media found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedType !== "all"
                ? "Try adjusting your search or filter"
                : "This event doesn't have any media yet"}
            </p>
            <Button asChild>
              <Link href={`/admin/gallery/events/${eventId}/upload`}>
                <Plus className="h-4 w-4 mr-2" />
                Add Media
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Cover Image Selection Dialog */}
      <Dialog
        open={showCoverImageDialog}
        onOpenChange={setShowCoverImageDialog}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Cover Image</DialogTitle>
            <DialogDescription>
              Choose an image from your uploaded media to set as the cover image
              for this event
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 py-4">
            {mediaItems
              .filter((item) => item.mediaType === "IMAGE")
              .map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSetCoverImage(item.mediaUrl)}
                  disabled={settingCoverImage}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                    isCoverImage(item.mediaUrl)
                      ? "border-yellow-500 ring-2 ring-yellow-500"
                      : "border-transparent hover:border-primary"
                  }`}
                >
                  <Image
                    src={item.mediaUrl}
                    alt={item.title || "Media"}
                    fill
                    className="object-cover"
                  />
                  {isCoverImage(item.mediaUrl) && (
                    <div className="absolute inset-0 bg-yellow-500/20 flex items-center justify-center">
                      <Check className="h-8 w-8 text-yellow-500" />
                    </div>
                  )}
                </button>
              ))}
          </div>

          {mediaItems.filter((item) => item.mediaType === "IMAGE").length ===
            0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Images className="h-12 w-12 mx-auto mb-4" />
              <p>No images available. Upload some images first.</p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCoverImageDialog(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Media Preview Dialog */}
      <Dialog
        open={!!selectedMedia}
        onOpenChange={() => setSelectedMedia(null)}
      >
        <DialogContent className="max-w-4xl">
          {selectedMedia && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {selectedMedia.title || `Media ${selectedMedia.id.slice(-4)}`}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="relative aspect-video bg-black rounded overflow-hidden">
                  {selectedMedia.mediaType === "IMAGE" ? (
                    <Image
                      src={selectedMedia.mediaUrl}
                      alt={selectedMedia.title || "Media"}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <video
                      src={selectedMedia.mediaUrl}
                      controls
                      className="w-full h-full"
                    />
                  )}
                </div>

                {selectedMedia.description && (
                  <p className="text-sm text-muted-foreground">
                    {selectedMedia.description}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Type:</span>{" "}
                    {selectedMedia.mediaType}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Size:</span>{" "}
                    {formatFileSize(selectedMedia.fileSize)}
                  </div>
                  {selectedMedia.width && selectedMedia.height && (
                    <div>
                      <span className="text-muted-foreground">Dimensions:</span>{" "}
                      {selectedMedia.width}×{selectedMedia.height}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  {selectedMedia.mediaType === "IMAGE" && (
                    <Button
                      onClick={() => {
                        handleSetCoverImage(selectedMedia.mediaUrl);
                        setSelectedMedia(null);
                      }}
                      variant="outline"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Set as Cover Image
                    </Button>
                  )}
                  <Button
                    onClick={() =>
                      toggleMediaPublished(
                        selectedMedia.id,
                        selectedMedia.isPublished
                      )
                    }
                    variant="outline"
                  >
                    {selectedMedia.isPublished ? "Unpublish" : "Publish"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
