"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const DashboardPage: React.FC = () => {
  const [passwords, setPasswords] = useState([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchPasswords = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login"); // Redirect to login if not authenticated
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/passwords", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send the token with the request
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPasswords(data); // Set the retrieved passwords
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to load passwords.");
        }
      } catch (error) {
        console.error("An error occurred:", error);
        setError("Failed to load passwords due to an error.");
      }
    };

    fetchPasswords();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token from local storage
    router.push("/login"); // Redirect to login page
  };

  return (
    <div>
      <h1>Your Passwords</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleLogout}>Logout</button>
      <ul>
        {passwords.map((passwordEntry) => (
          <li key={passwordEntry.id}>
            <strong>{passwordEntry.websiteName}</strong>: {passwordEntry.password}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardPage;
