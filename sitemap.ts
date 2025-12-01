import { MetadataRoute } from "next";
import { BlogService } from "@/lib/db/blog";
import { GalleryService } from "@/lib/db/gallery";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://cksi.org";

  // Fetch data using your actual services
  // We request a higher limit to ensure we get most posts for the sitemap
  const blogResponse = await BlogService.getPublishedPosts({ limit: 100 });
  const posts = blogResponse.data || [];

  const events = await GalleryService.getEvents();

  // Static routes
  const routes = [
    "",
    "/about",
    "/programs",
    "/contact",
    "/donate",
    "/volunteer",
    "/blog",
    "/gallery",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic Blog Posts
  const blogRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic Event Gallery Pages
  const eventRoutes = events.map((event) => ({
    url: `${baseUrl}/gallery/${event.slug}`,
    lastModified: new Date(event.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...routes, ...blogRoutes, ...eventRoutes];
}
