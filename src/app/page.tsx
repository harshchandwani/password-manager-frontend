"use client"; // Ensure this is a client-side component
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Redirect to the dashboard if the user is authenticated
      router.push("/dashboard");
    } else {
      // Redirect to the login/signup page if no token is found
      router.push("/login");
    }
  }, [router]);

  return null; // You can return null because the page is just for redirection
}
