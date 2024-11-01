"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const AddPasswordPage: React.FC = () => {
  const [website, setWebsite] = useState("");
  const [websiteName, setWebsiteName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login"); // Redirect to login if not authenticated
      return;
    }

    try {
      // Validate email
      if (!emailRegex.test(username)) {
        setError("Invalid email address.");
        return;
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/passwords`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send the token with the request
          },
          body: JSON.stringify({ website, websiteName, username, password }),
        }
      );

      if (response.ok) {
        // Redirect to the dashboard or another page after successful addition
        router.push("/dashboard");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to add password.");
        router.push("/login");
      }
    } catch (error) {
      router.push("/login");
      console.error("An error occurred:", error);
      setError("Failed to add password due to an error.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">New Password</h1>

      {/* Error Message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Website URL */}
        <div>
          <label
            htmlFor="website"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Website URL:
          </label>
          <input
            type="text"
            id="website"
            value={website}
            onChange={e => setWebsite(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Website Name */}
        <div>
          <label
            htmlFor="websiteName"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Website Name:
          </label>
          <input
            type="text"
            id="websiteName"
            value={websiteName}
            onChange={e => setWebsiteName(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Username */}
        <div>
          <label
            htmlFor="username"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Username:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary"
          />
        </div>
        {/* Error Message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full p-3 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-opacity-50"
        >
          Add Password
        </button>
      </form>
    </div>
  );
};

export default AddPasswordPage;
