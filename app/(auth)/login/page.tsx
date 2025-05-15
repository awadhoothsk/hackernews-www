
"use client";

import { betterAuthClient } from "@/lib/integrations/better-auth";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const LoginPage = () => {
  const { data } = betterAuthClient.useSession();
  const router = useRouter();
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await betterAuthClient.signIn.username({
        username: loginData.username,
        password: loginData.password,
      });

      if ("data" in response && response.data?.user) {
        router.push("/");
      } else {
        alert("Login failed. Please check your username and password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login. Please try again.");
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
              <CardTitle className="text-2xl text-center">Login</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={loginData.username}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                className="w-full"
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <p className="text-sm text-center">
                Don&apos;t have an account?{" "}
                <Link
                  href="/sign-up"
                  className="text-primary underline hover:opacity-80"
                >
                  Create account
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
};

export default LoginPage;
