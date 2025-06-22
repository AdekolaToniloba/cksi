// app/admin/gallery/events/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  AlertTriangle,
  Images,
  Play,
  Download,
  ExternalLink,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
        {
          id: "2",
          title: "Construction Progress",
          description: "Timelapse of the construction process",
          mediaUrl: "/placeholder.svg",
          mediaType: "VIDEO",
          fileSize: 25600000,
          mimeType: "video/mp4",
          width: 1920,
          height: 1080,
          duration: 120,
          orderIndex: 2,
          isPublished: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
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
    if (!bytes) return "Unknown size";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDuration = (seconds: number | null): string => {
    if (!seconds) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link href="/admin/gallery">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{event.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
            <Badge variant="secondary">{event.category}</Badge>
            {event.eventDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(event.eventDate).toLocaleDateString()}
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {event.location}
              </div>
            )}
          </div>
        </div>
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

      {event.description && (
        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground">{event.description}</p>
          </CardContent>
        </Card>
      )}

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
            <div className="text-sm text-muted-foreground">Total Media</div>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredMedia.map((item) => (
          <Card
            key={item.id}
            className="overflow-hidden group hover:shadow-lg transition-shadow"
          >
            <div
              className="relative aspect-square cursor-pointer"
              onClick={() => setSelectedMedia(item)}
            >
              {item.mediaType === "IMAGE" ? (
                <Image
                  src={item.mediaUrl}
                  alt={item.title || "Media item"}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
              ) : (
                <div className="w-full h-full bg-black flex items-center justify-center">
                  <video
                    src={item.mediaUrl}
                    className="w-full h-full object-cover"
                    muted
                    onError={(e) => {
                      const target = e.target as HTMLVideoElement;
                      target.style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="h-12 w-12 text-white opacity-70" />
                  </div>
                </div>
              )}

              {/* Media Type Badge */}
              <div className="absolute top-2 left-2">
                {item.mediaType === "VIDEO" ? (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Play className="h-3 w-3" />
                    {item.duration && formatDuration(item.duration)}
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Images className="h-3 w-3" />
                    IMG
                  </Badge>
                )}
              </div>

              {/* Status Badge */}
              {!item.isPublished && (
                <div className="absolute top-2 right-2">
                  <Badge
                    variant="outline"
                    className="bg-yellow-100 text-yellow-800"
                  >
                    Draft
                  </Badge>
                </div>
              )}

              {/* Action Buttons */}
              <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMediaPublished(item.id, item.isPublished);
                  }}
                  className={
                    item.isPublished ? "text-green-600" : "text-gray-400"
                  }
                >
                  {item.isPublished ? "✓" : "○"}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteMedia(item.id);
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Media Info */}
            <CardContent className="p-3">
              <h4 className="font-medium text-sm line-clamp-1">
                {item.title ||
                  `${item.mediaType.toLowerCase()}-${item.id.slice(-4)}`}
              </h4>
              {item.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {item.description}
                </p>
              )}
              <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                <span>{formatFileSize(item.fileSize)}</span>
                {item.width && item.height && (
                  <span>
                    {item.width}×{item.height}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
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

      {/* Media Preview Dialog */}
      <Dialog
        open={!!selectedMedia}
        onOpenChange={() => setSelectedMedia(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh]">
          {selectedMedia && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>
                    {selectedMedia.title ||
                      `Media ${selectedMedia.id.slice(-4)}`}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={selectedMedia.mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Open
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={selectedMedia.mediaUrl} download>
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </a>
                    </Button>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Media Preview */}
                <div className="relative aspect-video bg-black rounded overflow-hidden">
                  {selectedMedia.mediaType === "IMAGE" ? (
                    <Image
                      src={selectedMedia.mediaUrl}
                      alt={selectedMedia.title || "Media preview"}
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

                {/* Media Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-muted-foreground">
                      Type
                    </div>
                    <div>{selectedMedia.mediaType}</div>
                  </div>
                  <div>
                    <div className="font-medium text-muted-foreground">
                      Size
                    </div>
                    <div>{formatFileSize(selectedMedia.fileSize)}</div>
                  </div>
                  {selectedMedia.width && selectedMedia.height && (
                    <div>
                      <div className="font-medium text-muted-foreground">
                        Dimensions
                      </div>
                      <div>
                        {selectedMedia.width}×{selectedMedia.height}
                      </div>
                    </div>
                  )}
                  {selectedMedia.duration && (
                    <div>
                      <div className="font-medium text-muted-foreground">
                        Duration
                      </div>
                      <div>{formatDuration(selectedMedia.duration)}</div>
                    </div>
                  )}
                </div>

                {selectedMedia.description && (
                  <div>
                    <div className="font-medium text-muted-foreground mb-1">
                      Description
                    </div>
                    <p className="text-sm">{selectedMedia.description}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
