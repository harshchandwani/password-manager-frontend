"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
const DashboardPage: React.FC = () => {
  const [passwords, setPasswords] = useState([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchPasswords();
  }, [router]);

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
        router.push("/login");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setError("Failed to delete password due to an error.");
      router.push("/login");
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Heading */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Passwords</h1>
        <div className="flex space-x-4">
          {/* Add New Password Button */}
          <button
            onClick={() => router.push("/add-password")} // Redirect to add-password page
            className="bg-orange-500 text-white px-4 py-2 rounded"
          >
            Add New Password
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Table Header */}
      <div className="grid grid-cols-5 gap-4 items-center font-semibold mb-3">
        <div className="text-left">Website Name</div>
        <div className="text-left">Username</div>
        <div className="text-left">Password</div>
        <div className="text-center">Actions</div>
      </div>

      {/* Password Entries */}
      <ul>
        {passwords.map(passwordEntry => (
          <li
            key={passwordEntry.id}
            className="grid grid-cols-5 gap-4 items-center mb-3"
          >
            {/* Website Name */}
            <div className="text-left">{passwordEntry.websiteName}</div>

            {/* Username */}
            <div className="flex items-center">
              <span>{passwordEntry.username}</span>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(passwordEntry.username)
                }
                className="ml-3 bg-blue-500 text-white px-3 py-1 rounded"
              >
                Copy
              </button>
            </div>

            {/* Password with Copy Button */}
            <div
              className="flex items-center bg-white"
              onClick={async () => {
                navigator.clipboard.writeText(passwordEntry.password);
              }}
            >
              <span>{passwordEntry.password}</span>

              <Image src="/copy.png" alt="copy-icon" height={1} width={30} />
            </div>

            {/* Actions: Edit and Delete */}
            <div className="flex justify-center space-x-3">
              <button
                disabled
                className="bg-gray-400 text-white px-3 py-1 rounded cursor-not-allowed"
                title="Edit feature coming soon"
              >
                Edit
              </button>

              <div
                onClick={async () => {
                  await deletePassword(passwordEntry.id); // Delete password
                  fetchPasswords(); // Fetch passwords again after deletion
                }}
                className="cursor-pointer"
              >
                <Image
                  src="/delete-icon.png"
                  alt="delete-icon"
                  height={1}
                  width={30}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardPage;
