import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Search } from "lucide-react";
import { formatDate } from "@/lib/utils";
import PostActions from "@/components/blog/post-actions"; // Client component for delete
import { requireAdminAuth } from "@/lib/auth-helpers";

export default async function AdminBlogPage() {
  await requireAdminAuth();

  const posts = await prisma.blogPost.findMany({
    include: { author: { select: { name: true, email: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-950">Blog Management</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage your stories.
          </p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 shadow-sm">
          <Link href="/admin/blog/new">
            <Plus className="mr-2 h-4 w-4" /> New Post
          </Link>
        </Button>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader className="border-b bg-gray-50/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">
              All Posts ({posts.length})
            </CardTitle>
            {/* Optional: Server-side filter inputs could go here */}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {posts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                No posts yet
              </h3>
              <p className="text-gray-500 mt-1 mb-4">
                Get started by creating your first story.
              </p>
              <Button variant="outline" asChild>
                <Link href="/admin/blog/new">Create Post</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4 overflow-hidden">
                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt=""
                        className="h-16 w-16 rounded-md object-cover border hidden sm:block"
                      />
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate text-lg">
                          {post.title}
                        </h3>
                        <Badge
                          variant={
                            post.status === "PUBLISHED"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            post.status === "PUBLISHED" ? "bg-green-600" : ""
                          }
                        >
                          {post.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 truncate max-w-md">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span>By {post.author.name || post.author.email}</span>
                        <span>•</span>
                        <span>Updated {formatDate(post.updatedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <PostActions
                    id={post.id}
                    slug={post.slug}
                    isPublished={post.status === "PUBLISHED"}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
