"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Edit, Eye } from "lucide-react";
import Link from "next/link";
import { deleteBlogPost } from "@/actions/blog";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function PostActions({
  id,
  slug,
  isPublished,
}: {
  id: string;
  slug: string;
  isPublished: boolean;
}) {
  const { toast } = useToast();
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure? This cannot be undone.")) return;

    const res = await deleteBlogPost(id);
    if (res.success) {
      toast({ title: "Deleted", description: "Post removed successfully" });
    } else {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to delete",
      });
    }
  }

  return (
    <div className="flex items-center gap-2 ml-4">
      {isPublished && (
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/blog/${slug}`} target="_blank" title="View Live">
            <Eye className="h-4 w-4 text-gray-500" />
          </Link>
        </Button>
      )}
      <Button variant="ghost" size="icon" asChild>
        <Link href={`/admin/blog/edit/${id}`} title="Edit">
          <Edit className="h-4 w-4 text-blue-600" />
        </Link>
      </Button>
      <Button variant="ghost" size="icon" onClick={handleDelete} title="Delete">
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  );
}
