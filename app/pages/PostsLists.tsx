"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { serverUrl } from "@/environment";
import Likes from "./likes";
import Comments from "./comments";

interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const PostList = ({
  posts,
  loading,
  currentUserId,
}: {
  posts?: Post[];
  loading: boolean;
  currentUserId: string;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const POSTS_PER_PAGE = 10;
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-10">
        <Spinner size={40} className="text-muted-foreground" />
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center text-gray-600 text-base mt-10">
        No posts found. Be the first to post!
      </div>
    );
  }

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const paginatedPosts = posts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const deletePost = async (postId: string) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this post?");
    if (!isConfirmed) return;

    try {
      const res = await fetch(`${serverUrl}/posts/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      {paginatedPosts.map((post) => (
        <Card
          key={post.id}
          className="bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
          onClick={() => router.push(`/posts/${post.id}`)}
        >
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/posts/${post.id}`);
                  }}
                  className="text-2xl font-bold text-blue-700 hover:underline focus:outline-none"
                >
                  {post.title}
                </button>
                <p className="text-sm text-gray-600 mt-1">
                  Posted on{" "}
                  {new Date(post.createdAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                    timeZone: "Asia/Kolkata",
                  })}
                </p>
              </div>
              {post.userId === currentUserId && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePost(post.id);
                  }}
                >
                  <Trash2 className="w-5 h-5 text-destructive" />
                </Button>
              )}
            </div>
            <p className="text-base leading-relaxed text-gray-800 dark:text-zinc-300">
              {post.content}
            </p>
            <div
              className="flex gap-4 pt-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Likes postId={post.id} />
              <Comments postId={post.id} />
            </div>
          </CardContent>
        </Card>
      ))}

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious onClick={handlePrev} />
              </PaginationItem>
            )}

            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setCurrentPage(i + 1)}
                  className="cursor-pointer"
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext onClick={handleNext} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default PostList;
