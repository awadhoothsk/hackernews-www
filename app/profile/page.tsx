

// "use client";

// import { useEffect, useState } from "react";
// import { serverUrl } from "@/environment";
// import { betterAuthClient } from "@/lib/integrations/better-auth";
// import {
//   Card, CardContent, CardDescription, CardHeader, CardTitle
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Spinner } from "@/components/ui/spinner";
// import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
// import {
//   UserIcon, FileText, MessageSquare, Heart, Trash2
// } from "lucide-react";
// import Link from "next/link";

// interface Post { id: string; title: string; createdAt: string; }
// interface Comment { id: string; content: string; postId: string; createdAt: string; post?: Post; }
// interface Like { id: string; postId: string; createdAt: string; post?: Post; }
// interface UserData {
//   user: {
//     id: string;
//     username: string;
//     name: string;
//     about: string;
//     createdAt: string;
//     updatedAt: string;
//     posts: Post[];
//     comments: Comment[];
//     likes: Like[];
//   };
// }

// const UserProfilePage = () => {
//   const { data } = betterAuthClient.useSession();
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
//   const [view, setView] = useState<"posts" | "comments" | "likes">("posts");

//   const fetchUserInfo = async () => {
//     if (!data?.user?.id) return;

//     try {
//       const res = await fetch(`${serverUrl}/users/me`, {
//         method: "GET",
//         credentials: "include",
//       });
//       const json = await res.json();
//       if (res.ok) setUserData(json);
//     } catch (err) {
//       console.error("Error fetching user info:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserInfo();
//   }, [data?.user?.id]);

//   const deletePost = async (postId: string) => {
//     if (!window.confirm("Are you sure you want to delete this post?")) return;
//     try {
//       setDeletingPostId(postId);
//       const res = await fetch(`${serverUrl}/posts/${postId}`, {
//         method: "DELETE",
//         credentials: "include",
//       });
//       if (res.ok) {
//         setUserData((prev) => prev ? {
//           ...prev,
//           user: {
//             ...prev.user,
//             posts: prev.user.posts.filter((p) => p.id !== postId),
//           },
//         } : null);
//       }
//     } catch (err) {
//       alert(err instanceof Error ? err.message : "Unknown error");
//     } finally {
//       setDeletingPostId(null);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Spinner size={32} className="text-primary" />
//       </div>
//     );
//   }

//   if (!data?.user || !userData) {
//     return (
//       <div className="p-6 text-center text-red-600 dark:text-red-400">
//         You must be logged in to view this page.
//       </div>
//     );
//   }

//   const { username, name, about, createdAt, posts, comments, likes } = userData.user;

//   const renderSection = () => {
//     if (view === "posts") {
//       return posts.length ? (
//         <div className="space-y-3">
//           {posts.map((post) => (
//             <Card key={post.id}>
//               <CardContent className="p-4 flex justify-between items-start">
//                 <div>
//                   <Link href={`/posts/${post.id}`}>
//                     <p className="text-blue-600 dark:text-blue-400 hover:underline font-medium">{post.title}</p>
//                   </Link>
//                   <p className="text-sm text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</p>
//                 </div>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => deletePost(post.id)}
//                   disabled={deletingPostId === post.id}
//                 >
//                   {deletingPostId === post.id ? (
//                     <Spinner size={18} className="text-destructive" />
//                   ) : (
//                     <Trash2 className="w-5 h-5 text-destructive" />
//                   )}
//                 </Button>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       ) : <p className="text-muted-foreground">No posts yet.</p>;
//     }

//     if (view === "comments") {
//       return comments.length ? (
//         <div className="space-y-3">
//           {comments.map((comment) => (
//             <Card key={comment.id}>
//               <CardContent className="p-4 space-y-1">
//                 <p className="text-sm">{comment.content}</p>
//                 <p className="text-xs text-muted-foreground">
//                   {new Date(comment.createdAt).toLocaleDateString()}
//                 </p>
//                 <p className="text-xs">
//                   On post:{" "}
//                   <Link href={`/posts/${comment.postId}`}>
//                     <span className="text-blue-600 dark:text-blue-400 hover:underline">
//                       {comment.post?.title || comment.postId}
//                     </span>
//                   </Link>
//                 </p>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       ) : <p className="text-muted-foreground">No comments yet.</p>;
//     }

//     if (view === "likes") {
//       return likes.length ? (
//         <div className="space-y-3">
//           {likes.map((like) => (
//             <Card key={like.id}>
//               <CardContent className="p-4 space-y-1">
//                 <p className="text-xs text-muted-foreground">
//                   Liked on: {new Date(like.createdAt).toLocaleDateString()}
//                 </p>
//                 <p className="text-sm">
//                   <Link href={`/posts/${like.postId}`}>
//                     <span className="text-blue-600 dark:text-blue-400 hover:underline">
//                       {like.post?.title || like.postId}
//                     </span>
//                   </Link>
//                 </p>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       ) : <p className="text-muted-foreground">No liked posts yet.</p>;
//     }

//     return null;
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
//             <UserIcon className="w-6 h-6" />
//             Your Profile
//           </CardTitle>
//           <CardDescription>Welcome back, {username}!</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-2 text-sm">
//           <p><span className="font-semibold">Name:</span> {name || "N/A"}</p>
//           <p><span className="font-semibold">About:</span> {about || "No about section provided."}</p>
//           <p><span className="font-semibold">Joined:</span> {new Date(createdAt).toLocaleDateString()}</p>
//           <div className="flex gap-4 mt-4">
//             <span className="flex items-center gap-1">
//               <FileText className="w-4 h-4" /> Posts: {posts.length}
//             </span>
//             <span className="flex items-center gap-1">
//               <MessageSquare className="w-4 h-4" /> Comments: {comments.length}
//             </span>
//             <span className="flex items-center gap-1">
//               <Heart className="w-4 h-4" /> Likes: {likes.length}
//             </span>
//           </div>
//         </CardContent>
//       </Card>

//       <ToggleGroup
//         type="single"
//         value={view}
//         onValueChange={(val) => setView(val as typeof view)}
//         className="flex justify-center gap-2"
//       >
//         <ToggleGroupItem value="posts">Posts</ToggleGroupItem>
//         <ToggleGroupItem value="comments">Comments</ToggleGroupItem>
//         <ToggleGroupItem value="likes">Liked Posts</ToggleGroupItem>
//       </ToggleGroup>

//       <div>{renderSection()}</div>
//     </div>
//   );
// };

// export default UserProfilePage;

"use client";

import { useEffect, useState, useCallback } from "react";
import { serverUrl } from "@/environment";
import { betterAuthClient } from "@/lib/integrations/better-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Spinner } from "@/components/ui/spinner";
import {
  FileText,
  MessageSquare,
  Heart,
  UserIcon,
} from "lucide-react";
import PostsSection from "./_components/PostsSection";
import CommentsSection from "./_components/CommentsSection";
import LikesSection from "./_components/LikesSection";

interface Post {
  id: string;
  title: string;
  createdAt: string;
}
interface Comment {
  id: string;
  content: string;
  postId: string;
  createdAt: string;
  post?: Post;
}
interface Like {
  id: string;
  postId: string;
  createdAt: string;
  post?: Post;
}
interface UserData {
  user: {
    id: string;
    username: string;
    name: string;
    about: string;
    createdAt: string;
    posts: Post[];
    comments: Comment[];
    likes: Like[];
  };
}

export default function ProfilePage() {
  const { data } = betterAuthClient.useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"posts" | "comments" | "likes">("posts");

  const fetchUserInfo = useCallback(async () => {
    if (!data?.user?.id) return;
    try {
      const res = await fetch(`${serverUrl}/users/me`, {
        method: "GET",
        credentials: "include",
      });
      const json = await res.json();
      if (res.ok) setUserData(json);
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    } finally {
      setLoading(false);
    }
  }, [data?.user?.id]);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size={32} className="text-primary" />
      </div>
    );
  }

  if (!data?.user || !userData) {
    return (
      <div className="p-6 text-center text-red-600 dark:text-red-400">
        You must be logged in to view this page.
      </div>
    );
  }

  const { username, name, about, createdAt, posts, comments, likes } = userData.user;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <UserIcon className="w-6 h-6" />
            Your Profile
          </CardTitle>
          <CardDescription>Welcome back, {username}!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><span className="font-semibold">Name:</span> {name || "N/A"}</p>
          <p><span className="font-semibold">About:</span> {about || "No about section provided."}</p>
          <p><span className="font-semibold">Joined:</span> {new Date(createdAt).toLocaleDateString()}</p>
          <div className="flex gap-4 mt-4">
            <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> Posts: {posts.length}</span>
            <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> Comments: {comments.length}</span>
            <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> Likes: {likes.length}</span>
          </div>
        </CardContent>
      </Card>

      <ToggleGroup
        type="single"
        value={view}
        onValueChange={(val) => setView(val as typeof view)}
        className="flex justify-center gap-2"
      >
        <ToggleGroupItem value="posts">Posts</ToggleGroupItem>
        <ToggleGroupItem value="comments">Comments</ToggleGroupItem>
        <ToggleGroupItem value="likes">Liked Posts</ToggleGroupItem>
      </ToggleGroup>

      <div>
        {view === "posts" && <PostsSection posts={posts} />}
        {view === "comments" && <CommentsSection comments={comments} />}
        {view === "likes" && <LikesSection likes={likes} />}
      </div>
    </div>
  );
}
