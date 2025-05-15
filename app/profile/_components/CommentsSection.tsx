// components/user-profile/CommentsSection.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface Post { id: string; title: string; }
interface Comment {
  id: string;
  content: string;
  postId: string;
  createdAt: string;
  post?: Post;
}
interface Props {
  comments: Comment[];
}

export default function CommentsSection({ comments }: Props) {
  if (!comments.length) return <p className="text-muted-foreground">No comments yet.</p>;

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <Card key={comment.id}>
          <CardContent className="p-4 space-y-1">
            <p className="text-sm">{comment.content}</p>
            <p className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString()}</p>
            <p className="text-xs">
              On post:{" "}
              <Link href={`/posts/${comment.postId}`}>
                <span className="text-blue-600 dark:text-blue-400 hover:underline">
                  {comment.post?.title || comment.postId}
                </span>
              </Link>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
