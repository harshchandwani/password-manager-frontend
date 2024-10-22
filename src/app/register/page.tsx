"use client";
import { useState } from "react";
import { json } from "stream/consumers";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      if (response.ok) {
        // Handle success (e.g., redirect to login)
        setError("Registerion Successfully");
      } else {
        // Handle error
        setError("Registration failed!");
      }
    } catch (error) {
      setError("Something went wrong");
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

            {/* Register Form Section */}
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

                {/* Confirm Password input */}
                <div className="relative mb-6">
                  <input
                    type="password"
                    className="peer block w-full lg:w-[450px] rounded border-0 bg-gray-600 px-5 py-2 outline-none transition-all duration-200 focus:placeholder-opacity-100 focus:text-primary dark:text-white dark:focus:text-primary"
                    id="confirmPassword"
                    placeholder=""
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                  />
                  <label
                    htmlFor="confirmPassword"
                    className="pointer-events-none absolute left-5 top-2 text-neutral-500 transition-all duration-200 peer-focus:left-1 peer-focus:top-[-0.5rem] peer-focus:text-sm peer-focus:text-primary dark:text-neutral-400 dark:peer-focus:text-primary"
                  >
                    Confirm Password
                  </label>
                </div>

                {/* Error Message */}
                {error && <p style={{ color: "red" }}>{error}</p>}

                {/* Register button */}
                <div className="text-center">
                  <button
                    type="submit"
                    className="w-full lg:w-[450px] rounded bg-orange-500 px-7 py-3 text-sm font-medium uppercase text-white shadow transition duration-150 ease-in-out hover:bg-orange-600 focus:bg-orange-600 active:bg-orange-700"
                  >
                    Register
                  </button>

                  {/* Login link */}
                  <p className="mt-2 text-sm font-semibold">
                    Already have an account?{" "}
                    <a
                      href="/login"
                      className="text-orange-400 transition duration-150 ease-in-out hover:text-orange-500 focus:text-orange-500 active:text-orange-600"
                    >
                      Login
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

export default RegisterPage;
