// app/admin/gallery/events/edit/[id]/page.tsx - COMPLETE VERSION
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Trash2, Upload, ExternalLink } from "lucide-react";
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
  mediaCount: number;
}

export default function EditEventPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<GalleryEvent | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    eventDate: "",
    coverImage: "",
    isPublished: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );

  const categories = [
    { value: "education", label: "Education" },
    { value: "healthcare", label: "Healthcare" },
    { value: "community", label: "Community" },
    { value: "events", label: "Events" },
    { value: "facilities", label: "Facilities" },
  ];

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    router.push("/admin/login");
    return null;
  }

  useEffect(() => {
    if (session?.user && eventId) {
      fetchEvent();
    }
  }, [session, eventId]);

  const fetchEvent = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/gallery/events/${eventId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch event");
      }

      const { event } = await response.json();
      setEvent(event);

      // Populate form
      setFormData({
        title: event.title || "",
        description: event.description || "",
        category: event.category || "",
        location: event.location || "",
        eventDate: event.eventDate ? event.eventDate.split("T")[0] : "",
        coverImage: event.coverImage || "",
        isPublished: event.isPublished || false,
      });

      setCoverImagePreview(event.coverImage);
    } catch (error: any) {
      console.error("Error fetching event:", error);
      setError(error.message || "Failed to fetch event");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.category) {
      setError("Title and category are required");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/admin/gallery/events/${eventId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description || null,
          category: formData.category,
          location: formData.location || null,
          eventDate: formData.eventDate || null,
          coverImage: formData.coverImage || null,
          isPublished: formData.isPublished,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update event");
      }

      const { event: updatedEvent } = await response.json();
      setEvent(updatedEvent);
      setSuccess("Event updated successfully!");

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error("Error updating event:", error);
      setError(error.message || "Failed to update event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this event? This will also delete all associated media. This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/gallery/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      // Redirect to gallery
      router.push("/admin/gallery");
    } catch (error: any) {
      console.error("Error deleting event:", error);
      setError(error.message || "Failed to delete event");
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Update cover image preview when URL changes
    if (field === "coverImage" && typeof value === "string") {
      setCoverImagePreview(value || null);
    }
  };

  const validateImageUrl = (url: string) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const setAsCurrentCoverImage = (mediaUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      coverImage: mediaUrl,
    }));
    setCoverImagePreview(mediaUrl);
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
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
          <Link href={`/admin/gallery/events/${eventId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Event
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Edit Event</h1>
          <p className="text-muted-foreground">
            Update event details and settings
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/gallery/events/${eventId}/upload`}>
              <Upload className="h-4 w-4 mr-2" />
              Add Media
            </Link>
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Event
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription className="text-green-600">
            {success}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="e.g., School Construction - Phase 1"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleInputChange("category", value)
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      placeholder="e.g., Lagos, Nigeria"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventDate">Event Date</Label>
                    <Input
                      id="eventDate"
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) =>
                        handleInputChange("eventDate", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Describe the event and its significance..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverImage">Cover Image URL</Label>
                  <Input
                    id="coverImage"
                    value={formData.coverImage}
                    onChange={(e) =>
                      handleInputChange("coverImage", e.target.value)
                    }
                    placeholder="https://example.com/image.jpg"
                    type="url"
                    className={
                      !validateImageUrl(formData.coverImage)
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {formData.coverImage &&
                    !validateImageUrl(formData.coverImage) && (
                      <p className="text-sm text-red-500">
                        Please enter a valid URL
                      </p>
                    )}
                  <p className="text-sm text-muted-foreground">
                    You can copy image URLs from uploaded media or use external
                    images
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPublished"
                    checked={formData.isPublished}
                    onCheckedChange={(checked) =>
                      handleInputChange("isPublished", checked)
                    }
                  />
                  <Label htmlFor="isPublished">
                    Publish event (make visible to public)
                  </Label>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href={`/admin/gallery/events/${eventId}`}>
                      Cancel
                    </Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cover Image Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Cover Image Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                  {coverImagePreview ? (
                    <Image
                      src={coverImagePreview}
                      alt="Cover preview"
                      fill
                      className="object-cover"
                      onError={() => setCoverImagePreview(null)}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">No cover image</p>
                      </div>
                    </div>
                  )}
                </div>
                {formData.coverImage && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full"
                  >
                    <a
                      href={formData.coverImage}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Original
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Event Info */}
          <Card>
            <CardHeader>
              <CardTitle>Event Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="font-medium text-muted-foreground">
                    Created
                  </div>
                  <div>{new Date(event.createdAt).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="font-medium text-muted-foreground">
                    Updated
                  </div>
                  <div>{new Date(event.updatedAt).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="font-medium text-muted-foreground">Slug</div>
                  <div className="font-mono text-xs break-all">
                    {event.slug}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-muted-foreground">
                    Status
                  </div>
                  <div
                    className={
                      event.isPublished ? "text-green-600" : "text-yellow-600"
                    }
                  >
                    {event.isPublished ? "Published" : "Draft"}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-muted-foreground">
                    Media Count
                  </div>
                  <div>{event.mediaCount || 0} items</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href={`/admin/gallery/events/${eventId}`}>
                    View Event Media
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href={`/admin/gallery/events/${eventId}/upload`}>
                    <Upload className="h-3 w-3 mr-1" />
                    Upload Media
                  </Link>
                </Button>
                {formData.isPublished && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full"
                  >
                    <Link href={`/gallery/${event.slug}`} target="_blank">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Public Page
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
