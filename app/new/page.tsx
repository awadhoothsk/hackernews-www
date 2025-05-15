"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { serverUrl } from "@/environment";

interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const NewPostsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${serverUrl}/posts`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch posts.");
        }
        const data = await response.json();
        setPosts(data.posts);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Something went wrong.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const isToday = (dateString: string) => {
    const postDate = new Date(dateString);
    const today = new Date();
    return (
      postDate.getFullYear() === today.getFullYear() &&
      postDate.getMonth() === today.getMonth() &&
      postDate.getDate() === today.getDate()
    );
  };

  const todaysPosts = posts.filter((post) => isToday(post.createdAt));

  if (isLoading) {
    return <div className="text-center text-gray-600 mt-10">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">Error: {error}</div>;
  }

  if (todaysPosts.length === 0) {
    return <div className="text-center text-gray-600 mt-10">No posts created today.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-6 space-y-4">
      {todaysPosts.map((post) => (
        <div
          key={post.id}
          className="border rounded-lg p-4 shadow hover:shadow-md transition"
        >
          <Link href={`/posts/${post.id}`} className="text-lg font-semibold text-blue-700 hover:underline">
            {post.title}
          </Link>
          <p className="mt-2 text-gray-700">{post.content}</p>
          <div className="text-sm text-gray-500 mt-1">
            Posted today at {new Date(post.createdAt).toLocaleTimeString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewPostsPage;
