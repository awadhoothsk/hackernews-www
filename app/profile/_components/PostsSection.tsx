

// "use client";

// import { useState } from "react";
// import { Spinner } from "@/components/ui/spinner";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Trash2 } from "lucide-react";
// import Link from "next/link";
// import { serverUrl } from "@/environment";

// interface Post {
//   id: string;
//   title: string;
//   createdAt: string;
// }
// interface Props {
//   posts: Post[];
// }

// export default function PostsSection({ posts: initialPosts }: Props) {
//   const [posts, setPosts] = useState(initialPosts);
//   const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

//   const deletePost = async (postId: string) => {
//     setDeletingPostId(postId);
//     try {
//       const res = await fetch(`${serverUrl}/posts/${postId}`, {
//         method: "DELETE",
//         credentials: "include",
//       });
//       if (res.ok) {
//         setPosts((prev) => prev.filter((post) => post.id !== postId));
//       }
//     } catch (err) {
//       console.error("Error deleting post:", err);
//     } finally {
//       setDeletingPostId(null);
//     }
//   };

//   if (!posts.length) return <p className="text-muted-foreground">No posts yet.</p>;

//   return (
//     <div className="space-y-3">
//       {posts.map((post) => (
//         <Card key={post.id}>
//           <CardContent className="p-4 flex justify-between items-start">
//             <div>
//               <Link href={`/posts/${post.id}`}>
//                 <p className="text-blue-600 dark:text-blue-400 hover:underline font-medium">{post.title}</p>
//               </Link>
//               <p className="text-sm text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</p>
//             </div>
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => deletePost(post.id)}
//               disabled={deletingPostId === post.id}
//             >
//               {deletingPostId === post.id ? (
//                 <Spinner size={18} className="text-destructive" />
//               ) : (
//                 <Trash2 className="w-5 h-5 text-destructive" />
//               )}
//             </Button>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { serverUrl } from "@/environment";

interface Post {
  id: string;
  title: string;
  createdAt: string;
}
interface Props {
  posts: Post[];
}

export default function PostsSection({ posts: initialPosts }: Props) {
  const [posts, setPosts] = useState(initialPosts);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const router = useRouter();

  const deletePost = async (postId: string) => {
    setDeletingPostId(postId);
    try {
      const res = await fetch(`${serverUrl}/posts/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setPosts((prev) => prev.filter((post) => post.id !== postId));
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    } finally {
      setDeletingPostId(null);
    }
  };

  if (!posts.length) return <p className="text-muted-foreground">No posts yet.</p>;

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <Card
          key={post.id}
          onClick={() => router.push(`/posts/${post.id}`)}
          className="cursor-pointer hover:bg-accent transition-colors"
        >
          <CardContent className="p-4 flex justify-between items-start">
            <div>
              <p className="text-blue-600 dark:text-blue-400 font-medium">{post.title}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation(); // prevent routing
                deletePost(post.id);
              }}
              disabled={deletingPostId === post.id}
            >
              {deletingPostId === post.id ? (
                <Spinner size={18} className="text-destructive" />
              ) : (
                <Trash2 className="w-5 h-5 text-destructive" />
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
