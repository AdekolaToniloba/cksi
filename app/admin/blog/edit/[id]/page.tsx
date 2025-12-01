import { prisma } from "@/lib/prisma";
import BlogForm from "@/components/blog/blog-form";
import { notFound } from "next/navigation";

// FIX 1: Update PageProps to match Next.js 15 (params is a Promise)
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: PageProps) {
  // FIX 1: Await the params object
  const { id } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!post) return notFound();

  // FIX 2: Handle 'null' vs 'undefined' for optional fields
  const formData = {
    ...post,
    tags: post.tags,
    status: post.status as "DRAFT" | "PUBLISHED",
    // Convert null to undefined (or empty string depending on your form)
    imageUrl: post.imageUrl || undefined,
    imagePublicId: post.imagePublicId || undefined,
  };

  return <BlogForm initialData={formData} isEditMode />;
}
