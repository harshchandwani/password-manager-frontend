"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CircleX } from "lucide-react";

const AddEditPasswordPage = ({ params }: { params: { id?: string } }) => {
  const [website, setWebsite] = useState("");
  const [websiteName, setWebsiteName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const id = params.id;
  console.log(id);
  const websiteRegex =
    /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;

  useEffect(() => {
    if (id) {
      // Fetch existing password details for editing
      const fetchPassword = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/passwords/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setWebsite(data.website);
            setWebsiteName(data.websiteName);
            setUsername(data.username);
            setPassword(data.password);
          } else {
            setError("Failed to load password details.");
          }
        } catch (error) {
          setError("An error occurred while fetching password details.");
        }
      };
      fetchPassword();
    }
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      if (!websiteRegex.test(website)) {
        setError("Please enter a valid website URL.");
        return;
      }

      const apiUrl = id
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/passwords/${id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/passwords`;

      const response = await fetch(apiUrl, {
        method: id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ website, websiteName, username, password }),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to save password.");
      }
    } catch (error) {
      setError("An error occurred while saving the password.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {id ? "Edit Password" : "New Password"}
        </h1>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          <CircleX />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Fields */}
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
            className="w-full p-1 border text-black text-sm border-gray-300 rounded-lg bg-gray-50"
          />
        </div>

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
            className="w-full p-1 border text-black text-sm border-gray-300 rounded-lg bg-gray-50"
          />
        </div>

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
            className="w-full p-1 border text-black text-sm border-gray-300 rounded-lg bg-gray-50"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Password:
          </label>
          <input
            type="text"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full p-1 border text-black text-sm border-gray-300 rounded-lg bg-gray-50"
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full p-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600"
        >
          {id ? "Save Changes" : "Add Password"}
        </button>
      </form>
    </div>
  );
};

export default AddEditPasswordPage;
