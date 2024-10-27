"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      if (response.ok) {
        router.push("/verify-email"); // Redirect to the verification process
      } else {
        // Handle error
        setError("Registration failed!");
      }
    } catch (error) {
      setError("Something went wrong");
    }
  };

  return (
    <section className="h-screen flex items-center justify-center">
      <Card className="mx-auto max-w-md w-full px-4 lg:px-6">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Register</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Your Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Display error message if any */}
            {error && <p className="text-red-500 text-center">{error}</p>}

            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>

          {/* Login link */}
          <p className="mt-4 text-center text-sm font-semibold">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-orange-500 hover:text-orange-600 transition duration-150 ease-in-out"
            >
              Login
            </a>
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

export default RegisterPage;
