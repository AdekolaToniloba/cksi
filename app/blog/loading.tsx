import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Hero Skeleton */}
      <section className="bg-white border-b py-16 md:py-24">
        <div className="container px-4 text-center flex flex-col items-center">
          <Skeleton className="h-12 w-48 md:w-64 mb-6" />
          <Skeleton className="h-6 w-full max-w-xl" />
        </div>
      </section>

      <div className="container px-4 mt-8">
        {/* Search Bar Skeleton */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <Skeleton className="h-10 w-full md:w-64" />
          <Skeleton className="h-10 w-full md:w-40" />
        </div>

        {/* Featured Post Skeleton */}
        <div className="my-12">
          <Skeleton className="h-8 w-48 mb-6" />
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="grid md:grid-cols-2 gap-0">
              <Skeleton className="h-64 md:h-full min-h-[350px]" />
              <div className="p-8 md:p-12 flex flex-col justify-center bg-white space-y-6">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-10 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="flex items-center justify-between mt-8 pt-4">
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-10 w-32 rounded-full" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Blog Grid Skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card
              key={i}
              className="border-0 shadow-md flex flex-col h-full overflow-hidden"
            >
              <Skeleton className="h-52 w-full" />
              <CardHeader className="space-y-4">
                <div className="flex gap-4">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-7 w-full" />
                <div className="space-y-2 pt-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardHeader>
              <CardContent className="mt-auto pt-0">
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
