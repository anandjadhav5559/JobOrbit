"use client";

import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { feedService } from "@/services/feedService";
import PostCard from "@/components/feed/PostCard";
import { PostSkeleton } from "@/components/ui/Skeleton";
import Spinner from "@/components/ui/Spinner";
import { Bookmark } from "lucide-react";
import { Post } from "@/types";
import { Card } from "@/components/ui/Card";

export default function SavedPostsPage() {
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["saved-posts"],
    queryFn: ({ pageParam = 0 }) => feedService.getSavedPosts(pageParam as number, 10),
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.number + 1,
    initialPageParam: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  const posts = data?.pages.flatMap((p) => p.content) ?? [];

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
        <Bookmark size={24} className="text-violet" />
        Saved Posts
      </h1>

      <div className="space-y-4">
        {isLoading && Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)}

        {posts.map((post: Post) => (
          <PostCard key={post.id} post={post} />
        ))}

        {!isLoading && posts.length === 0 && (
          <Card className="text-center py-16">
            <Bookmark size={48} className="mx-auto mb-4 text-text-muted opacity-30" />
            <h3 className="text-lg font-medium text-text-primary mb-2">No saved posts</h3>
            <p className="text-text-muted text-sm">
              Save posts from your feed to view them here.
            </p>
          </Card>
        )}

        <div ref={ref} className="flex justify-center py-4">
          {isFetchingNextPage && <Spinner size="md" />}
        </div>
      </div>
    </div>
  );
}
