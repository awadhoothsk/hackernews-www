"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Likes from "@/app/pages/likes";
import Comments from "@/app/pages/comments";
import { Card, CardContent } from "@/components/ui/card";
import { serverUrl } from "@/environment";

interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
  user: { id: string; username: string; name: string };
}

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${serverUrl}/posts/${id}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch post.");
        }
        const data = await response.json();
        setPost(data.post);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Something went wrong.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (isLoading) return <div className="p-6 text-gray-500">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (!post) return <div className="p-6 text-red-500">Post not found.</div>;

  return (
    <div className="flex justify-center items-start py-10">
      <Card className="w-full max-w-3xl bg-white dark:bg-zinc-900 text-black dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 shadow-md">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400">{post.title}</h1>
          <p className="text-gray-800 dark:text-zinc-300">{post.content}</p>

          <div className="text-sm text-gray-600 dark:text-zinc-400">
            Posted by{" "}
            <span className="font-medium text-blue-500 hover:underline dark:text-blue-400">
              {post.user.username}
            </span>{" "}
            on{" "}
            {new Date(post.createdAt).toLocaleString("en-IN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
              timeZone: "Asia/Kolkata",
            })}
          </div>

          <div className="flex items-center gap-4 mt-4">
            <Likes postId={post.id} />
          </div>

          <div className="mt-6">
            <Comments postId={post.id} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostPage;
