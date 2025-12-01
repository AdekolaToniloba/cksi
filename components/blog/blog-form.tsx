"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { blogPostSchema } from "@/utils/validation";
import { createBlogPost, updateBlogPost } from "@/actions/blog";
import TiptapEditor from "./tiptap-editor";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { z } from "zod";

// Infer type from your Zod schema
type BlogPostFormValues = z.infer<typeof blogPostSchema>;

interface BlogFormProps {
  initialData?: BlogPostFormValues & { id?: string }; // id is optional for new posts
  isEditMode?: boolean;
}

export default function BlogForm({
  initialData,
  isEditMode = false,
}: BlogFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: initialData || {
      title: "",
      excerpt: "",
      content: "",
      category: "",
      tags: [],
      imageUrl: "",
      status: "DRAFT",
    },
  });

  async function onSubmit(data: BlogPostFormValues) {
    setIsSubmitting(true);
    const formData = new FormData();

    // Convert object to FormData for Server Action
    Object.entries(data).forEach(([key, value]) => {
      if (key === "tags" && Array.isArray(value)) {
        formData.append(key, value.join(","));
      } else {
        formData.append(key, value as string);
      }
    });

    try {
      let result;
      if (isEditMode && initialData?.id) {
        // Update
        result = await updateBlogPost(
          initialData.id,
          { success: false },
          formData
        );
      } else {
        // Create
        result = await createBlogPost({ success: false }, formData);
      }

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        router.push("/admin/blog");
      } else {
        toast({
          title: "Error",
          description: result.message || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/blog">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-blue-950">
            {isEditMode ? "Edit Blog Post" : "Create New Post"}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode
              ? "Update your existing content"
              : "Share a new story with the world"}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main Column (Left) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Celebrating World Sickle Cell Day"
                        {...field}
                        className="text-lg font-medium"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Story Content</FormLabel>
                    <FormControl>
                      <TiptapEditor
                        content={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Sidebar Column (Right) */}
          <div className="space-y-6">
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-6">
              <h3 className="font-semibold text-blue-950">
                Publishing Settings
              </h3>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="News">News</SelectItem>
                        <SelectItem value="Events">Events</SelectItem>
                        <SelectItem value="Stories">Success Stories</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Excerpt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A brief summary for cards..."
                        className="h-24 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Appears on the blog grid.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditMode ? "Update Post" : "Publish Post"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
