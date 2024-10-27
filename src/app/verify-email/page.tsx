"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const VerifyEmailPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleResendEmail = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/resend-verification-email", {
        email,
      });

      if (response.status === 200) {
        toast({
          description: "Verification email resent successfully.",
        });
      } else {
        toast({
          variant: "destructive",
          description:
            response.data.error || "Failed to resend verification email.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        description:
          error.response?.data?.error || "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-4">
      <Card className="max-w-sm w-full text-center space-y-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            An email has been sent to your inbox. Please verify your email to
            continue. <br></br>
            If Failed Recieving an Email, Please Retry
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Button
            onClick={handleResendEmail}
            disabled={loading || !email}
            className="w-full bg-orange-500 text-white hover:bg-orange-600 focus:bg-orange-600"
          >
            {loading ? "Sending..." : "Resend Verification Email"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;
