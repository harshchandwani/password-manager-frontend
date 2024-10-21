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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login"); // Redirect to login if not authenticated
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/passwords", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send the token with the request
        },
        body: JSON.stringify({ website, websiteName, username, password }),
      });

      if (response.ok) {
        // Redirect to the dashboard or another page after successful addition
        router.push("/dashboard");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to add password.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setError("Failed to add password due to an error.");
    }
  };

  return (
    <div>
      <h1>Add New Password</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="website">Website:</label>
          <input
            type="text"
            id="website"
            value={website}
            onChange={e => setWebsite(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="websiteName">Website Name:</label>
          <input
            type="text"
            id="websiteName"
            value={websiteName}
            onChange={e => setWebsiteName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Password</button>
      </form>
    </div>
  );
};

export default AddPasswordPage;
