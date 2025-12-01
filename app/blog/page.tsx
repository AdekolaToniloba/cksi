// app/blog/page.tsx
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import { BlogSearch } from "@/components/blog/blog-search";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Our Blog | CKSI",
  description: "Updates and stories from Couples and Kids Social Initiatives.",
};

interface BlogPageProps {
  // Update type definition to be a Promise
  searchParams: Promise<{
    q?: string;
    category?: string;
    page?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  // 1. Await the searchParams before using them
  const resolvedSearchParams = await searchParams;

  const q = resolvedSearchParams.q;
  const category = resolvedSearchParams.category;
  const pageParam = resolvedSearchParams.page;

  const page = Number(pageParam) || 1;
  const limit = 9;
  const skip = (page - 1) * limit;

  const whereClause = {
    status: "PUBLISHED" as const,
    ...(category && { category: category }),
    ...(q && {
      OR: [
        { title: { contains: q, mode: "insensitive" as const } },
        { excerpt: { contains: q, mode: "insensitive" as const } },
      ],
    }),
  };

  // Parallel Data Fetching
  const [posts, totalPosts, featuredPost] = await Promise.all([
    prisma.blogPost.findMany({
      where: whereClause,
      include: { author: { select: { name: true } } },
      orderBy: { publishedAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.blogPost.count({ where: whereClause }),
    // Only fetch featured if on page 1 and no search filters
    page === 1 && !q && !category
      ? prisma.blogPost.findFirst({
          where: { isFeatured: true, status: "PUBLISHED" },
          include: { author: { select: { name: true } } },
        })
      : null,
  ]);

  const totalPages = Math.ceil(totalPosts / limit);

  // If featured post exists, filter it out of the main grid to avoid duplicates
  const gridPosts = featuredPost
    ? posts.filter((p) => p.id !== featuredPost.id)
    : posts;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Hero */}
      <section className="bg-white border-b py-16 md:py-24">
        <div className="container px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-blue-950 mb-4">
            Our Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stories of impact, health insights, and community updates from
            across Nigeria.
          </p>
        </div>
      </section>

      <div className="container px-4 mt-8">
        {/* Search & Filter Component */}
        <BlogSearch initialQuery={q} initialCategory={category} />

        {/* ... Rest of the component remains exactly the same, just using `gridPosts`, `featuredPost` etc ... */}
        {/* Featured Post Section */}
        {featuredPost && (
          <div className="my-12">
            <h2 className="text-2xl font-bold text-blue-950 mb-6">
              Featured Story
            </h2>
            <Card className="overflow-hidden border-0 shadow-lg group">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-auto min-h-[300px] overflow-hidden">
                  <Image
                    src={featuredPost.imageUrl || "/placeholder.jpg"}
                    alt={featuredPost.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
                  <div className="flex gap-2 mb-4">
                    <Badge
                      variant="secondary"
                      className="bg-red-100 text-red-700 hover:bg-red-200"
                    >
                      {featuredPost.category}
                    </Badge>
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-blue-950 group-hover:text-blue-700 transition-colors">
                    <Link href={`/blog/${featuredPost.slug}`}>
                      {featuredPost.title}
                    </Link>
                  </h3>
                  <p className="text-muted-foreground mb-6 text-lg line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center text-sm text-gray-500 gap-4">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />{" "}
                        {featuredPost.author.name || "CKSI Team"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {featuredPost.publishedAt
                          ? formatDate(featuredPost.publishedAt)
                          : "Draft"}
                      </span>
                    </div>
                    <Button asChild className="rounded-full">
                      <Link href={`/blog/${featuredPost.slug}`}>
                        Read Story <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Main Grid */}
        {gridPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {gridPosts.map((post) => (
              <Card
                key={post.id}
                className="group border-0 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={post.imageUrl || "/placeholder.jpg"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-blue-950 hover:bg-white backdrop-blur-sm shadow-sm">
                      {post.category}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.publishedAt
                        ? formatDate(post.publishedAt)
                        : "Draft"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 5 min read
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2 group-hover:text-blue-700 transition-colors text-xl">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-3 mt-2">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-0">
                  <Button
                    variant="link"
                    className="p-0 h-auto font-semibold text-blue-600 group-hover:text-blue-800"
                    asChild
                  >
                    <Link href={`/blog/${post.slug}`}>
                      Read More{" "}
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg border border-dashed">
            <h3 className="text-lg font-medium text-gray-900">
              No stories found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filters.
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-16">
            {page > 1 && (
              <Button variant="outline" asChild>
                <Link href={`/blog?page=${page - 1}`}>Previous</Link>
              </Button>
            )}
            <span className="flex items-center px-4 font-medium text-sm">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Button variant="outline" asChild>
                <Link href={`/blog?page=${page + 1}`}>Next</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
