"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate password
      if (!passwordRegex.test(password)) {
        setErrorMessage(
          "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character."
        );
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token); // Store the received JWT token
        router.push("/dashboard"); // Redirect to the dashboard
      } else {
        response
          .json()
          .then(data => {
            toast({
              variant: "destructive",
              description: data.error || "Login Failed!", // Fallback in case 'message' is missing
            });
          })
          .catch(() => {
            toast({
              variant: "destructive",
              description: "An unexpected error occurred. Please try again.",
            });
          });
      }
    } catch (error) {
      setError("Login failed due to an error!");
    }
  };

  return (
    <section className="h-screen flex items-center justify-center bg-black">
      <Card className="mx-auto max-w-md w-full px-4 lg:px-6">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your email and password to login to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Your Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>

          {/* Register link */}
          <p className="mt-4 text-center text-sm font-semibold">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-orange-500 hover:text-orange-600"
            >
              Register
            </a>
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

export default LoginPage;
