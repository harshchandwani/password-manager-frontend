"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const VerifyEmailSuccess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [statusMessage, setStatusMessage] = useState("Verifying...");
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const token = searchParams?.get("token");
    if (token) {
      // Send verification request to the backend
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      })
        .then(async response => {
          if (response.ok) {
            setStatusMessage("Email verified successfully. Redirecting...");
            setRedirecting(true);
            setTimeout(() => {
              router.push("/login");
            }, 5000);
          } else {
            const errorData = await response.json();
            setStatusMessage(
              errorData.error || "Verification failed. Please try again."
            );
          }
        })
        .catch(() => {
          setStatusMessage("An error occurred. Please try again.");
        });
    } else {
      setStatusMessage("Invalid verification link.");
    }
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-4">
      <Card className="max-w-sm w-full text-center space-y-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {redirecting ? "Verification Success" : "Email Verification"}
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            {statusMessage}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {redirecting && (
            <p className="text-gray-500">Redirecting in 5 seconds...</p>
          )}
          <Button
            onClick={() => router.push("/login")}
            className="w-full bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-600"
          >
            Login to Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailSuccess;
