// components/user-profile/LikesSection.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface Post { id: string; title: string; }
interface Like {
  id: string;
  postId: string;
  createdAt: string;
  post?: Post;
}
interface Props {
  likes: Like[];
}

export default function LikesSection({ likes }: Props) {
  if (!likes.length) return <p className="text-muted-foreground">No liked posts yet.</p>;

  return (
    <div className="space-y-3">
      {likes.map((like) => (
        <Card key={like.id}>
          <CardContent className="p-4 space-y-1">
            <p className="text-xs text-muted-foreground">
              Liked on: {new Date(like.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm">
              <Link href={`/posts/${like.postId}`}>
                <span className="text-blue-600 dark:text-blue-400 hover:underline">
                  {like.post?.title || like.postId}
                </span>
              </Link>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
