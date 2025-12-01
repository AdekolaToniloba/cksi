import { prisma } from "@/lib/prisma";
import BlogForm from "@/components/blog/blog-form";
import { notFound } from "next/navigation";

interface PageProps {
  params: { id: string };
}

export default async function EditBlogPage({ params }: PageProps) {
  const post = await prisma.blogPost.findUnique({
    where: { id: params.id },
  });

  if (!post) return notFound();

  // Transform database object to match form schema if necessary
  const formData = {
    ...post,
    tags: post.tags, // Already string[] in prisma, matches our types
    status: post.status as "DRAFT" | "PUBLISHED", // Ensure explicit cast
  };

  return <BlogForm initialData={formData} isEditMode />;
}
