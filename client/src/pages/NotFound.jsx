import React from "react";
import page_not_found from "../assets/images/page_not_found.jpg";
import { COLORS } from "../constants/color";

const NotFound = () => {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{ backgroundColor: COLORS.white }}
    >
      {/* Image in the center */}
      <img
        src={page_not_found}
        alt="Page Not Found"
        className="mb-6 w-100 h-96 object-cover mx-auto"
      />

      {/* Page Not Found message */}
      <h1
        className="text-3xl font-bold text-center"
        style={{ color: COLORS.secondary }}
      >
        Page Not Found
      </h1>
      <p className="mt-4  text-center" style={{ color: COLORS.primary }}>
        The page you are looking for does not exist.
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

export default NotFound;
