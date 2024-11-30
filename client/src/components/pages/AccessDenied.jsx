import React from "react";
import access_denied from "../../assets/images/access_denied.jpg";

const AccessDenied = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Image in the center */}
      <img
        src={access_denied}
        alt="Access Denied"
        className="mb-6 w-100 h-96 object-cover mx-auto"
      />

      {/* Access Denied message */}
      <h1 className="text-3xl font-bold text-red-600 text-center">
        Access Denied
      </h1>
      <p className="mt-4 text-gray-700 text-center">
        You do not have the necessary permissions to access this page.
      </p>

      {/* Button to go back to home */}
      <button
        onClick={() => (window.location.href = "/main")}
        className="mt-6 px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-all"
      >
        Go to Home
      </button>
    </div>
  );
};

export default AccessDenied;
