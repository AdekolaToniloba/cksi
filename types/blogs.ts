// types/blog.ts
import { Prisma } from "@prisma/client";

// Validated input type (Zod inference)
export type BlogPostInput = z.infer<typeof blogPostSchema>;

// Output type (Database inference)
export type BlogPostWithAuthor = Prisma.BlogPostGetPayload<{
  include: { author: { select: { name: true; email: true; image: true } } };
}>;
