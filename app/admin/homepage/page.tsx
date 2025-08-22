// app/admin/homepage/page.tsx - Updated admin component
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HomepageContent, HeroCarousel, MediaType } from "@/types";
import { MediaUpload } from "@/components/media-upload";
import { Save, Edit, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContentSection {
  section: string;
  title: string;
  items: HomepageContent[];
}

interface HeroFormData {
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  mediaUrl: string;
  mediaType: MediaType;
  cloudinaryId?: string;
  orderIndex: number;
}

export default function HomepageManagement() {
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);
  const [heroItems, setHeroItems] = useState<HeroCarousel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editingHero, setEditingHero] = useState<string | null>(null);
  const [showNewHero, setShowNewHero] = useState(false);

  const [formData, setFormData] = useState<{
    title?: string;
    content?: string;
    orderIndex?: number;
  }>({});

  const [heroFormData, setHeroFormData] = useState<HeroFormData>({
    title: "",
    description: "",
    ctaText: "",
    ctaLink: "",
    mediaUrl: "",
    mediaType: "IMAGE" as MediaType,
    orderIndex: 0,
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchContent();
    fetchHeroItems();
  }, []);

  const fetchContent = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/homepage");
      const result = await response.json();

      if (result.success) {
        const data = result.data;

        if (data.length === 0) {
          const defaultSections = [
            { section: "hero", title: "Hero Section" },
            { section: "about", title: "About Section" },
            { section: "impact", title: "Impact Section" },
            { section: "programs", title: "Programs Section" },
            { section: "testimonials", title: "Testimonials" },
          ];

          setContentSections(defaultSections.map((s) => ({ ...s, items: [] })));
          return;
        }

        const grouped = data.reduce((acc, item) => {
          const existingSection = acc.find(
            (section) => section.section === item.section
          );
          if (existingSection) {
            existingSection.items.push(item);
          } else {
            acc.push({
              section: item.section,
              title: item.section
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase()),
              items: [item],
            });
          }
          return acc;
        }, [] as ContentSection[]);

        setContentSections(grouped);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Failed to fetch homepage content:", error);
      toast({
        title: "Error",
        description: "Failed to load homepage content. Using defaults.",
        variant: "destructive",
      });

      setContentSections([
        { section: "hero", title: "Hero Section", items: [] },
        { section: "about", title: "About Section", items: [] },
        { section: "impact", title: "Impact Section", items: [] },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHeroItems = async () => {
    try {
      const response = await fetch("/api/hero");
      const result = await response.json();

      if (result.success) {
        setHeroItems(result.data);
      } else {
        console.error("Failed to fetch hero items:", result.error);
        setHeroItems([]);
      }
    } catch (error) {
      console.error("Failed to fetch hero items:", error);
      setHeroItems([]);
    }
  };

  const handleEdit = (item: HomepageContent) => {
    setEditingItem(item.id);
    setFormData({
      title: item.title || "",
      content: item.content || "",
      orderIndex: item.orderIndex || 0,
    });
  };

  const handleSave = async (itemId: string) => {
    try {
      const response = await fetch(`/api/homepage/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setContentSections((sections) =>
          sections.map((section) => ({
            ...section,
            items: section.items.map((item) =>
              item.id === itemId
                ? { ...item, ...formData, updatedAt: new Date() }
                : item
            ),
          }))
        );

        setEditingItem(null);
        setFormData({});

        toast({
          title: "Success",
          description: "Content updated successfully.",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Failed to update homepage content:", error);
      toast({
        title: "Error",
        description: "Failed to update content. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateContent = async (section: string) => {
    try {
      const response = await fetch("/api/homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section,
          title: "New Content",
          content: "Add your content here...",
          orderIndex: 0,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setContentSections((sections) =>
          sections.map((s) =>
            s.section === section
              ? { ...s, items: [...s.items, result.data] }
              : s
          )
        );

        toast({
          title: "Success",
          description: "New content created successfully.",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Failed to create homepage content:", error);
      toast({
        title: "Error",
        description: "Failed to create content. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateHero = async () => {
    try {
      if (!heroFormData.title || !heroFormData.mediaUrl) {
        toast({
          title: "Validation Error",
          description: "Title and media are required.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("/api/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(heroFormData),
      });

      const result = await response.json();

      if (result.success) {
        setHeroItems([...heroItems, result.data]);
        setShowNewHero(false);
        setHeroFormData({
          title: "",
          description: "",
          ctaText: "",
          ctaLink: "",
          mediaUrl: "",
          mediaType: "IMAGE" as MediaType,
          orderIndex: 0,
        });

        toast({
          title: "Success",
          description: "Hero item created successfully.",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Failed to create hero item:", error);
      toast({
        title: "Error",
        description: "Failed to create hero item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateHero = async (id: string) => {
    try {
      const response = await fetch(`/api/hero/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(heroFormData),
      });

      const result = await response.json();

      if (result.success) {
        setHeroItems((items) =>
          items.map((item) => (item.id === id ? result.data : item))
        );
        setEditingHero(null);

        toast({
          title: "Success",
          description: "Hero item updated successfully.",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Failed to update hero item:", error);
      toast({
        title: "Error",
        description: "Failed to update hero item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteHero = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hero item?")) return;

    try {
      const response = await fetch(`/api/hero/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setHeroItems((items) => items.filter((item) => item.id !== id));

        toast({
          title: "Success",
          description: "Hero item deleted successfully.",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Failed to delete hero item:", error);
      toast({
        title: "Error",
        description: "Failed to delete hero item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMediaUpload = (result: any) => {
    setHeroFormData((prev) => ({
      ...prev,
      mediaUrl: result.secure_url,
      mediaType:
        result.resource_type === "video"
          ? ("VIDEO" as MediaType)
          : ("IMAGE" as MediaType),
      cloudinaryId: result.public_id || undefined,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8" data-testid="homepage-management">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Homepage Management</h1>
        <p className="text-muted-foreground">
          Manage the content displayed on your homepage
        </p>
      </div>

      {/* Hero Carousel Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Hero Carousel</CardTitle>
            <Button
              onClick={() => setShowNewHero(true)}
              data-testid="add-hero-item"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Hero Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* New Hero Item Form */}
          {showNewHero && (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-lg">Create New Hero Item</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hero-title">Title</Label>
                    <Input
                      id="hero-title"
                      value={heroFormData.title}
                      onChange={(e) =>
                        setHeroFormData({
                          ...heroFormData,
                          title: e.target.value,
                        })
                      }
                      placeholder="Enter hero title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero-cta-text">CTA Button Text</Label>
                    <Input
                      id="hero-cta-text"
                      value={heroFormData.ctaText}
                      onChange={(e) =>
                        setHeroFormData({
                          ...heroFormData,
                          ctaText: e.target.value,
                        })
                      }
                      placeholder="e.g., Learn More"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero-description">Description</Label>
                  <Textarea
                    id="hero-description"
                    value={heroFormData.description}
                    onChange={(e) =>
                      setHeroFormData({
                        ...heroFormData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Enter hero description"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero-cta-link">CTA Link</Label>
                  <Input
                    id="hero-cta-link"
                    value={heroFormData.ctaLink}
                    onChange={(e) =>
                      setHeroFormData({
                        ...heroFormData,
                        ctaLink: e.target.value,
                      })
                    }
                    placeholder="/about or https://external-link.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Media Upload</Label>
                  <MediaUpload
                    onUpload={handleMediaUpload}
                    folder="hero-carousel"
                    acceptedTypes={["image/*", "video/*"]}
                    maxSize={100}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button onClick={handleCreateHero}>
                    <Save className="h-4 w-4 mr-2" />
                    Create Hero Item
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowNewHero(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Existing Hero Items */}
          <div className="space-y-4">
            {heroItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No hero items created yet.</p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => setShowNewHero(true)}
                >
                  Create First Hero Item
                </Button>
              </div>
            ) : (
              heroItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="flex">
                    {/* Media Preview */}
                    <div className="w-48 h-32 bg-gray-100 flex-shrink-0">
                      {item.mediaType === "VIDEO" ? (
                        <video
                          src={item.mediaUrl}
                          className="w-full h-full object-cover"
                          muted
                        />
                      ) : (
                        <img
                          src={item.mediaUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4">
                      {editingHero === item.id ? (
                        <div className="space-y-4">
                          <Input
                            value={heroFormData.title}
                            onChange={(e) =>
                              setHeroFormData({
                                ...heroFormData,
                                title: e.target.value,
                              })
                            }
                            placeholder="Title"
                          />
                          <Textarea
                            value={heroFormData.description}
                            onChange={(e) =>
                              setHeroFormData({
                                ...heroFormData,
                                description: e.target.value,
                              })
                            }
                            placeholder="Description"
                            rows={2}
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              value={heroFormData.ctaText}
                              onChange={(e) =>
                                setHeroFormData({
                                  ...heroFormData,
                                  ctaText: e.target.value,
                                })
                              }
                              placeholder="CTA Text"
                            />
                            <Input
                              value={heroFormData.ctaLink}
                              onChange={(e) =>
                                setHeroFormData({
                                  ...heroFormData,
                                  ctaLink: e.target.value,
                                })
                              }
                              placeholder="CTA Link"
                            />
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleUpdateHero(item.id)}
                            >
                              <Save className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingHero(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold">{item.title}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {item.description}
                              </p>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                                <span>CTA: {item.ctaText}</span>
                                <span>Link: {item.ctaLink}</span>
                                <span>Type: {item.mediaType}</span>
                                <span>Order: {item.orderIndex}</span>
                              </div>
                            </div>

                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingHero(item.id);
                                  setHeroFormData({
                                    title: item.title,
                                    description: item.description,
                                    ctaText: item.ctaText,
                                    ctaLink: item.ctaLink,
                                    mediaUrl: item.mediaUrl,
                                    mediaType: item.mediaType,
                                    cloudinaryId:
                                      item.cloudinaryId || undefined,
                                    orderIndex: item.orderIndex,
                                  });
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteHero(item.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Regular Content Sections */}
      <div className="space-y-8">
        {contentSections.map((section) => (
          <Card key={section.section}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{section.title}</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCreateContent(section.section)}
                  data-testid={`add-content-${section.section}`}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Content
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.items.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  {editingItem === item.id ? (
                    <div className="space-y-4">
                      <Input
                        placeholder="Title"
                        value={formData.title || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        data-testid={`edit-title-${item.id}`}
                      />
                      <Textarea
                        placeholder="Content"
                        value={formData.content || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, content: e.target.value })
                        }
                        rows={6}
                        data-testid={`edit-content-${item.id}`}
                      />
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleSave(item.id)}
                          data-testid={`save-${item.id}`}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingItem(null)}
                          data-testid={`cancel-${item.id}`}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">
                          {item.title || "Untitled"}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(item)}
                          data-testid={`edit-${item.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {item.content || "No content"}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {section.items.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No content in this section yet.</p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => handleCreateContent(section.section)}
                  >
                    Add First Content
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
