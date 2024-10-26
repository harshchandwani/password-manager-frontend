"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">
        {redirecting ? "Verification Success" : "Email Verification"}
      </h1>
      <p className="mt-4">{statusMessage}</p>
      {redirecting && <p className="mt-4">Redirecting in 5 seconds...</p>}
      <button
        onClick={() => router.push("/login")}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Go to Login
      </button>
    </div>
  );
};

export default VerifyEmailSuccess;
