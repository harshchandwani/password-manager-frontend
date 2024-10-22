"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token); // Store the received JWT token
        router.push("/dashboard"); // Redirect to the dashboard
      } else {
        const errorData = await response.json();
        setError(
          errorData.error || "Login failed! Please check your credentials."
        );
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setError("Login failed due to an error!");
    }
  };

  return (
    <section className="h-screen">
      <div className="h-full flex items-center justify-center">
        {/* Container to limit width and add space on the sides */}
        <div className="max-w-md w-full px-4 lg:px-6">
          <div className="flex flex-wrap items-center justify-center lg:justify-between">
            {/* Image Section */}
            <div className="mb-12 w-full lg:w-6/12 hidden lg:block">
              <img src="" className="w-full" alt="Sample image" />
            </div>

            {/* Login Form Section */}
            <div className="w-full lg:w-5/12">
              <form onSubmit={handleSubmit}>
                {/* Email input */}
                <div className="relative mb-6">
                  <input
                    type="email"
                    className="peer block w-full lg:w-[450px] rounded border-0 bg-gray-600 px-5 py-2 outline-none transition-all duration-200 focus:placeholder-opacity-100 focus:text-primary dark:text-white dark:focus:text-primary"
                    id="email"
                    placeholder=""
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                  <label
                    htmlFor="email"
                    className="pointer-events-none absolute left-5 top-2 text-neutral-500 transition-all duration-200 peer-focus:left-1 peer-focus:top-[-0.5rem] peer-focus:text-sm peer-focus:text-primary dark:text-neutral-400 dark:peer-focus:text-primary"
                  >
                    Email address
                  </label>
                </div>

                {/* Password input */}
                <div className="relative mb-6">
                  <input
                    type="password"
                    className="peer block w-full lg:w-[450px] rounded border-0 bg-gray-600 px-5 py-2 outline-none transition-all duration-200 focus:placeholder-opacity-100 focus:text-primary dark:text-white dark:focus:text-primary"
                    id="password"
                    placeholder=""
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <label
                    htmlFor="password"
                    className="pointer-events-none absolute left-5 top-2 text-neutral-500 transition-all duration-200 peer-focus:left-1 peer-focus:top-[-0.5rem] peer-focus:text-sm peer-focus:text-primary dark:text-neutral-400 dark:peer-focus:text-primary"
                  >
                    Password
                  </label>
                </div>

                {/* Error Message */}
                {error && <p style={{ color: "red" }}>{error}</p>}

                {/* Login button */}
                <div className="text-center">
                  <button
                    type="submit"
                    className="w-full lg:w-[450px] rounded bg-orange-500 px-7 py-3 text-sm font-medium uppercase text-white shadow transition duration-150 ease-in-out hover:bg-orange-600 focus:bg-orange-600 active:bg-orange-700"
                  >
                    Login
                  </button>

                  {/* Register link */}
                  <p className="mt-2 text-sm font-semibold">
                    Don't have an Account?{" "}
                    <a
                      href="/register"
                      className="rounded bg-orange-500 px-7 py-3 text-sm font-medium uppercase text-white shadow transition duration-150 ease-in-out hover:bg-orange-600 focus:bg-orange-600 active:bg-orange-700"
                    >
                      Register
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
