"use client";

import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { feedService } from "@/services/feedService";
import PostCard from "@/components/feed/PostCard";
import CreatePost from "@/components/feed/CreatePost";
import { PostSkeleton } from "@/components/ui/Skeleton";
import Spinner from "@/components/ui/Spinner";
import { Post } from "@/types";

export default function FeedPage() {
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: ({ pageParam = 0 }) => feedService.getFeed(pageParam as number, 10),
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.number + 1,
    initialPageParam: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const posts = data?.pages.flatMap((page) => page.content) ?? [];

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <CreatePost />

      {isLoading &&
        Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)}

      {isError && (
        <div className="text-center py-12 text-text-muted">
          <p className="text-lg mb-2">Failed to load feed</p>
          <p className="text-sm">Check your connection and try again.</p>
        </div>
      )}

      {posts.map((post: Post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {/* Infinite scroll trigger */}
      <div ref={ref} className="flex justify-center py-4">
        {isFetchingNextPage && <Spinner size="md" />}
        {!hasNextPage && posts.length > 0 && (
          <p className="text-sm text-text-muted">You&apos;re all caught up! 🎉</p>
        )}
      </div>
    </div>
  );
}
