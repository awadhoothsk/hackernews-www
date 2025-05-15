

"use client";

import React, { useState } from "react";
import { PlusIcon } from "lucide-react";
import { serverUrl } from "@/environment";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export const CreatePost = ({
  onPostCreated,
  floating = false,
}: {
  onPostCreated?: () => void;
  floating?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Title is required!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${serverUrl}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create post");
      }

      setIsOpen(false);
      setFormData({ title: "", content: "" });
      onPostCreated?.();
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
        alert(err.message || "An error occurred while creating the post.");
      } else {
        alert("Unknown error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setFormData({ title: "", content: "" });
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          className={
            floating
              ? "rounded-full h-14 w-14 p-0 shadow-lg bg-primary  hover:bg-primary/90"
              : "w-full sm:w-auto"
          }
        >
          <PlusIcon className={floating ? "h-6 w-6 mx-auto" : "mr-2 h-4 w-4"} />
          {!floating && "Create Post"}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Post</DialogTitle>
          <DialogDescription>
            Write something worth sharing — a thought, idea, or update.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <Input
            name="title"
            placeholder="Post Title"
            value={formData.title}
            onChange={handleChange}
            disabled={isSubmitting}
          />

          <Textarea
            name="content"
            placeholder="Write your post content here..."
            className="resize-none h-32"
            value={formData.content}
            onChange={handleChange}
            disabled={isSubmitting}
          />

          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title.trim()}
            >
              {isSubmitting && <Spinner className="mr-2" />}
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
