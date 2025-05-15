"use client";

import React, { useEffect, useState } from "react";
import { betterAuthClient } from "@/lib/integrations/better-auth";
import { serverUrl } from "@/environment";
import { CreatePost } from "./pages/CreatePost";
import PostList from "./pages/PostsLists";
import NavigationBar from "@/components/NavigationBar";

// Define the Post type
type Post = {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

const RootPage = () => {
  const { data: session } = betterAuthClient.useSession();

  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts from the server
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${serverUrl}/posts`);
      const data = await res.json();
      setPosts(data.posts);
      setFilteredPosts(data.posts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter posts by search query
  const handleSearch = (query: string) => {
    const filtered = posts.filter((post) =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.content.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPosts(filtered);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <NavigationBar onSearch={handleSearch} />
      <div className="relative flex max-w-7xl mx-auto p-4 gap-6">
        <div className="flex-1">
          <PostList
            posts={filteredPosts}
            loading={loading}
            currentUserId={session?.user?.id || ""}
          />
        </div>

        {session && (
          <>
            <div className="fixed bottom-6 right-6 z-50 md:hidden">
              <CreatePost floating onPostCreated={fetchPosts} />
            </div>
            <div className="hidden md:block sticky top-20 h-fit">
              <CreatePost onPostCreated={fetchPosts} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RootPage;
