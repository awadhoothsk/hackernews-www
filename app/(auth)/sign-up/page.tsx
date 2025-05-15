"use client";

import { betterAuthClient } from "@/lib/integrations/better-auth";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import { z } from "zod"; // Import zod

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Zod schema for validation with enhanced password rules
const signUpSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
});

// Define the type of the form fields
interface FormData {
  username: string;
  email: string;
  name: string;
  password: string;
}

// Define the type of errors in the form
interface FormErrors {
  username?: string;
  email?: string;
  name?: string;
  password?: string;
}

const SignUpPage = () => {
  const { data } = betterAuthClient.useSession();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    name: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignUp = async () => {
    setIsLoading(true);

    // Validate form data with Zod
    const validation = signUpSchema.safeParse(formData);

    if (!validation.success) {
      // If validation fails, set errors state and stop the submission
      const newErrors: FormErrors = {};
      validation.error.errors.forEach((err) => {
        const key = err.path[0]; // key will be a string such as 'username', 'email', etc.
        if (key in newErrors) {
          newErrors[key as keyof FormErrors] = err.message; // type assertion here
        }
      });
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await betterAuthClient.signUp.email(
        {
          username: formData.username,
          email: formData.email,
          name: formData.name,
          password: formData.password,
        },
        {
          onRequest: () => setIsLoading(true),
          onSuccess: () => {
            setIsLoading(false);
            router.push("/");
          },
          onError: (ctx) => {
            setIsLoading(false);
            alert(ctx.error.message || "Signup failed. Please try again.");
          },
        }
      );

      if (error) {
        alert(error.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!data?.user && (
        <div className="min-h-[calc(100vh-3rem)] flex items-center justify-center px-4 bg-background text-foreground">
          <Card className="w-full max-w-md shadow-md border rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Create Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className={errors.username ? "border-red-500" : ""}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm">{errors.username}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>
              <Button
                onClick={handleSignUp}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>
            </CardContent>
            <CardFooter className="flex justify-center text-sm">
              <span>
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary underline hover:opacity-80"
                >
                  Log In
                </Link>
              </span>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
};

export default SignUpPage;
