// actions/blog.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { blogPostSchema } from "@/utils/validation";
import { requireAdminAuth } from "@/lib/auth-helpers";
import { z } from "zod";
// import { PostStatus } from "@prisma/client";

// --- Types ---
export type ActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

// --- Actions ---

export async function createBlogPost(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const session = await requireAdminAuth(); // Ensure security

    // parse fields from FormData
    const rawData = {
      title: formData.get("title"),
      excerpt: formData.get("excerpt"),
      content: formData.get("content"),
      category: formData.get("category"),
      status: formData.get("status"),
      imageUrl: formData.get("imageUrl"),
      tags:
        formData
          .get("tags")
          ?.toString()
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean) || [],
    };

    // Validate with Zod
    const validated = blogPostSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        success: false,
        errors: validated.error.flatten().fieldErrors,
        message: "Validation failed",
      };
    }

    // Generate unique slug
    let slug = validated.data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    // Ensure slug uniqueness
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    await prisma.blogPost.create({
      data: {
        ...validated.data,
        slug,
        authorId: session.user.id,
        publishedAt: validated.data.status === "PUBLISHED" ? new Date() : null,
      },
    });

    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    return { success: true, message: "Post created successfully" };
  } catch (error) {
    console.error("Create Post Error:", error);
    return { success: false, message: "Database error occurred" };
  }
}

export async function updateBlogPost(
  id: string,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await requireAdminAuth();

    const rawData = {
      title: formData.get("title"),
      excerpt: formData.get("excerpt"),
      content: formData.get("content"),
      category: formData.get("category"),
      status: formData.get("status"),
      imageUrl: formData.get("imageUrl"),
      tags:
        formData
          .get("tags")
          ?.toString()
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean) || [],
    };

    const validated = blogPostSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        success: false,
        errors: validated.error.flatten().fieldErrors,
        message: "Validation failed",
      };
    }

    const data = validated.data;

    await prisma.blogPost.update({
      where: { id },
      data: {
        ...data,
        publishedAt: data.status === "PUBLISHED" ? new Date() : null, // Only update date if publishing
      },
    });

    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    revalidatePath(`/blog/${id}`); // In case slug didn't change but content did

    return { success: true, message: "Post updated successfully" };
  } catch (error) {
    return { success: false, message: "Failed to update post" };
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await requireAdminAuth();
    await prisma.blogPost.delete({ where: { id } });
    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete post" };
  }
}
