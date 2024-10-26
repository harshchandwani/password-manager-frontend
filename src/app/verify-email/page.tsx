import React from "react";

const VerifyEmailPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <h1 className="text-2xl font-bold text-gray-800">Verify Your Email</h1>
      <p className="mt-4 text-gray-600">
        An email has been sent to your inbox. Please verify your email to
        continue.
      </p>

      {/* Resend Email Button (disabled for now) */}
      <button
        disabled
        className="mt-6 px-4 py-2 bg-gray-500 text-white rounded cursor-not-allowed"
      >
        Resend Verification Email
      </button>
    </div>
  );
};

export default VerifyEmailPage;
