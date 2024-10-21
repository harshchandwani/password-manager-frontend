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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/passwords`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Send the token with the request
            },
          }
        );

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
  const deletePassword = async (id: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login"); // Redirect to login if not authenticated
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/passwords/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send the token with the request
          },
        }
      );

      if (response.ok) {
        // Optionally, add a toast notification for success here
        // e.g., toast.success("Password deleted successfully!");
        // Refresh the password list or remove the deleted password from state
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to delete password.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setError("Failed to delete password due to an error.");
    }
  };

  return (
    <div>
      <h1>Your Passwords</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleLogout}>Logout</button>
      <ul>
        {passwords.map(passwordEntry => (
          <li key={passwordEntry.id}>
            <strong>{passwordEntry.websiteName}</strong>:{" "}
            {passwordEntry.password}
            <button onClick={() => deletePassword(passwordEntry.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardPage;
