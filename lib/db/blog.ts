// lib/db/blog.ts
import { db } from "./index";
import {
  BlogPost,
  CreateBlogPostInput,
  UpdateBlogPostInput,
  PostStatus,
  PaginatedResponse,
} from "@/types";
import { generateSlug } from "@/lib/utils";
import { logger } from "@/lib/monitoring/logger";

export class BlogService {
  static async createPost(
    data: CreateBlogPostInput & { authorId: string }
  ): Promise<BlogPost> {
    try {
      const slug = generateSlug(data.title);

      const post = await db.blogPost.create({
        data: {
          ...data,
          slug,
          publishedAt: data.status === PostStatus.PUBLISHED ? new Date() : null,
        },
        include: {
          author: true,
        },
      });

      logger.info("Blog post created", { postId: post.id, title: post.title });
      return post as BlogPost;
    } catch (error) {
      logger.error("Failed to create blog post", { error, data });
      throw new Error("Failed to create blog post");
    }
  }

  static async updatePost(data: UpdateBlogPostInput): Promise<BlogPost> {
    try {
      const updateData: any = { ...data };
      delete updateData.id;

      // Generate new slug if title changed
      if (data.title) {
        updateData.slug = generateSlug(data.title);
      }

      // Set publishedAt if status changed to published
      if (data.status === PostStatus.PUBLISHED) {
        const currentPost = await db.blogPost.findUnique({
          where: { id: data.id },
          select: { status: true, publishedAt: true },
        });

        if (
          currentPost?.status !== PostStatus.PUBLISHED &&
          !currentPost?.publishedAt
        ) {
          updateData.publishedAt = new Date();
        }
      }

      const post = await db.blogPost.update({
        where: { id: data.id },
        data: updateData,
        include: {
          author: true,
        },
      });

      logger.info("Blog post updated", { postId: post.id });
      return post as BlogPost;
    } catch (error) {
      logger.error("Failed to update blog post", { error, postId: data.id });
      throw new Error("Failed to update blog post");
    }
  }

  static async deletePost(id: string): Promise<void> {
    try {
      await db.blogPost.delete({
        where: { id },
      });

      logger.info("Blog post deleted", { postId: id });
    } catch (error) {
      logger.error("Failed to delete blog post", { error, postId: id });
      throw new Error("Failed to delete blog post");
    }
  }

  static async getPost(identifier: string): Promise<BlogPost | null> {
    try {
      const post = await db.blogPost.findFirst({
        where: {
          OR: [{ id: identifier }, { slug: identifier }],
        },
        include: {
          author: true,
        },
      });

      return post as BlogPost | null;
    } catch (error) {
      logger.error("Failed to get blog post", { error, identifier });
      return null;
    }
  }

  static async getPosts(
    params: {
      page?: number;
      limit?: number;
      status?: PostStatus;
      category?: string;
      search?: string;
    } = {}
  ): Promise<PaginatedResponse<BlogPost>> {
    try {
      const { page = 1, limit = 10, status, category, search } = params;
      const skip = (page - 1) * limit;

      const where: any = {};

      if (status) {
        where.status = status;
      }

      if (category) {
        where.category = category;
      }

      if (search) {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { excerpt: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ];
      }

      const [posts, total] = await Promise.all([
        db.blogPost.findMany({
          where,
          include: {
            author: true,
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        db.blogPost.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: posts as BlogPost[],
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      logger.error("Failed to get blog posts", { error, params });
      throw new Error("Failed to get blog posts");
    }
  }

  static async getPublishedPosts(
    params: {
      page?: number;
      limit?: number;
      category?: string;
    } = {}
  ): Promise<PaginatedResponse<BlogPost>> {
    return this.getPosts({ ...params, status: PostStatus.PUBLISHED });
  }
}
