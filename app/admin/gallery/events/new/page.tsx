// app/admin/gallery/events/new/page.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { ArrowLeft, Save, Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CreateEventPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    eventDate: "",
    coverImage: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.category) {
      setError("Title and category are required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/gallery/events", {
        method: "POST",
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
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create event");
      }

      const { event } = await response.json();

      // Redirect to the new event's media page
      router.push(`/admin/gallery/events/${event.id}`);
    } catch (error: any) {
      console.error("Error creating event:", error);
      setError(error.message || "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link href="/admin/gallery">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Gallery
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create New Event</h1>
          <p className="text-muted-foreground">
            Create a new gallery event to organize photos and videos
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
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
                  onChange={(e) => handleInputChange("title", e.target.value)}
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
                      <SelectItem key={category.value} value={category.value}>
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
              <Label htmlFor="coverImage">Cover Image URL (Optional)</Label>
              <Input
                id="coverImage"
                value={formData.coverImage}
                onChange={(e) =>
                  handleInputChange("coverImage", e.target.value)
                }
                placeholder="https://example.com/image.jpg"
                type="url"
              />
              <p className="text-sm text-muted-foreground">
                You can add a cover image URL, or upload media after creating
                the event
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Event
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/gallery">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Next Steps Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Upload className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">Next Steps</h3>
              <p className="text-sm text-muted-foreground">
                After creating your event, you'll be redirected to the event
                page where you can:
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• Upload photos and videos to the event</li>
                <li>• Organize media with titles and descriptions</li>
                <li>• Publish the event when ready</li>
                <li>• Edit event details anytime</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
