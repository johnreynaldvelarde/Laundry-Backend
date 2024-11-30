import React from "react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const CustomToast = ({ t, type, message }) => {
  // Define animation variants
  const variants = {
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  };

  const toastStyles = {
    success: "bg-green-100 text-green-800 ring-green-500",
    error: "bg-red-100 text-red-800 ring-red-500",
    warning: "bg-yellow-100 text-yellow-800 ring-yellow-500",
  };

  return (
    <AnimatePresence>
      {t.visible && (
        <motion.div
          className={`fixed bottom-4 right-4 max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ${toastStyles[type]}`}
          initial="exit"
          animate="enter"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.3 }}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <svg
                  className={`h-6 w-6 ${
                    type === "success"
                      ? "text-green-500"
                      : type === "error"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {type === "success" && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  )}
                  {type === "error" && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  )}
                  {type === "warning" && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v4m0 4h.01M5.13 4.28a2 2 0 013.74-1.62L12 6l3.13-2.35a2 2 0 013.74 1.62L19 12a2 2 0 01-2 2H7a2 2 0 01-2-2l0-5.72z"
                    />
                  )}
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-base font-medium">{message}</p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomToast;
