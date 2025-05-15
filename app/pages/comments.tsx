"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { serverUrl } from "@/environment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

interface CommentsProps {
  postId: string;
}

interface Comment {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  postId: string | null;
}

const Comments = ({ postId }: CommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsCount, setCommentsCount] = useState<number>(0);
  const [content, setContent] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch full comments list
  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${serverUrl}/comments/on/${postId}`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);
        setCommentsCount(data.comments.length); // update count after fetch
      }
    } catch {
      console.error("Failed to fetch comments");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  // Fetch only count on mount
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch(`${serverUrl}/comments/on/${postId}`, {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setCommentsCount(data.comments.length);
        }
      } catch {
        console.error("Failed to fetch comment count");
      }
    };

    fetchCount();
  }, [postId]);

  const handleAddComment = async () => {
    try {
      const response = await fetch(`${serverUrl}/comments/on/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content }),
      });

      if (response.status === 401) return router.push("/login");

      if (response.ok) {
        setContent("");
        fetchComments();
      }
    } catch {
      console.error("Failed to add comment");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this comment?");
    if (!isConfirmed) return;

    try {
      const response = await fetch(`${serverUrl}/comments/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.status === 401) return router.push("/login");

      if (response.ok) {
        setComments((prev) => prev.filter((comment) => comment.id !== commentId));
        setCommentsCount((prev) => prev - 1);
      }
    } catch {
      console.error("Failed to delete comment");
    }
  };

  return (
    <div className="w-full">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          if (!showComments) fetchComments();
          setShowComments(!showComments);
        }}
      >
        {showComments ? "Hide Comments" : "Show Comments"} ({commentsCount})
      </Button>

      {showComments && (
        <div className="mt-3 space-y-3">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Write a comment..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Button onClick={handleAddComment}>Comment</Button>
          </div>

          {loading ? (
            <div className="flex justify-center mt-4">
              <Spinner size={20} className="text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-2">
              {comments.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="p-3 flex justify-between">
                    <div>
                      <p className="text-sm">{comment.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-red-500 p-0"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      Delete
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Comments;
