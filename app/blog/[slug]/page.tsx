import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowLeft, Share2, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import sanitizeHtml from "sanitize-html";

interface Props {
  params: { slug: string };
}

// 1. Dynamic SEO Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | CKSI`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.imageUrl ? [{ url: post.imageUrl }] : [],
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: ["CKSI Team"],
    },
  };
}

// 2. The Page Component
export default async function BlogPostPage({ params }: Props) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
    include: {
      author: { select: { name: true, image: true } },
    },
  });

  // Handle 404 or draft posts in production
  if (
    !post ||
    (post.status !== "PUBLISHED" && process.env.NODE_ENV === "production")
  ) {
    return notFound();
  }

  // Calculate estimated read time (avg 200 words/min)
  const wordCount = post.content.replace(/<[^>]+>/g, "").split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);

  // Configure sanitizer options to allow images, links, and styling classes
  const sanitizedContent = sanitizeHtml(post.content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "h1",
      "h2",
      "span",
      "div",
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      "*": ["class", "style"], // Allow styling classes from Tiptap
      img: ["src", "alt", "width", "height"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
  });

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Section with Image or Gradient */}
      <div className="relative h-[400px] md:h-[500px] w-full bg-gray-900">
        {post.imageUrl ? (
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover opacity-80"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-950" />
        )}
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 container px-4 pb-12 md:pb-16 z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-3 mb-6 animate-fade-in">
              <Badge className="bg-blue-600 text-white hover:bg-blue-700 border-none text-sm px-3 py-1">
                {post.category}
              </Badge>
              <span className="flex items-center text-gray-300 text-sm bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDate(post.publishedAt || post.createdAt)}
              </span>
              <span className="flex items-center text-gray-300 text-sm bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                <Clock className="w-4 h-4 mr-2" />
                {readTime} min read
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              {post.title}
            </h1>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
                  {post.author.image ? (
                    <Image
                      src={post.author.image}
                      alt=""
                      width={40}
                      height={40}
                    />
                  ) : (
                    <User className="h-5 w-5 text-white" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-white">
                    {post.author.name || "CKSI Team"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <article className="container px-4 max-w-4xl mx-auto mt-12">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Social Sidebar (Sticky on Desktop) */}
          <div className="hidden md:flex flex-col gap-4 sticky top-24 h-fit w-12">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12 border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-colors"
              title="Share"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div
              className="prose prose-lg md:prose-xl max-w-none text-gray-700 
              prose-headings:text-blue-950 prose-headings:font-bold
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl prose-img:shadow-lg
              prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:bg-blue-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
              prose-li:marker:text-blue-600"
            >
              {/* Safe HTML Rendering with sanitize-html */}
              <div
                dangerouslySetInnerHTML={{
                  __html: sanitizedContent, // <--- UPDATED VARIABLE
                }}
              />
            </div>

            {/* Tags Footer */}
            {post.tags.length > 0 && (
              <div className="mt-16 pt-8 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
                  Related Topics
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog?q=${tag}`}
                      className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Footer */}
            <div className="mt-12 flex justify-between items-center">
              <Button
                variant="ghost"
                asChild
                className="text-gray-600 hover:text-blue-600 pl-0 -ml-4"
              >
                <Link href="/blog">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to all stories
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
