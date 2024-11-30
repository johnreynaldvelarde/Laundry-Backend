import React from "react";
import styles from "../../style";
import X from "@mui/icons-material/Close";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import useLoginForm from "../../hooks/useLoginForm";
import { COLORS } from "../../constants/color";
import { Eye, EyeSlash } from "@phosphor-icons/react";

const PopupLogin = ({ showLoginPopup, setLoginShowPopup }) => {
  const {
    passwordVisible,
    setPasswordVisible,
    loginUsername,
    setLoginUsername,
    loginPassword,
    setLoginPassword,
    rememberMe,
    setRememberMe,
    errorMessage,
    handleLogin,
    handleForgotPassword,
    handleInputChange,
    isVisible,
    loading,
  } = useLoginForm(setLoginShowPopup, showLoginPopup);

  return (
    <>
      {showLoginPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity duration-300 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setLoginShowPopup(false)}
          ></div>

          {/* Login Popup */}
          <div
            className={`relative bg-white p-8 rounded-lg shadow-lg z-50 transition-transform duration-300 ${
              isVisible ? "scale-100" : "scale-90 opacity-0"
            } w-[80%] max-w-md`}
          >
            <button
              onClick={() => setLoginShowPopup(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            >
              <X />
            </button>
            <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
            <p className="text-sm text-gray-600 mb-6">
              Welcome back, you've been missed
            </p>
            <form onSubmit={handleLogin}>
              {errorMessage && (
                <div className="mb-4 p-2 bg-red-100 text-red-700">
                  {errorMessage}
                </div>
              )}
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium mb-2 ms-1"
                  style={{ color: styles.textColor2 }}
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={loginUsername}
                  onChange={handleInputChange(setLoginUsername)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none sm:text-sm custom-focus-ring"
                  required
                />
              </div>
              <div className="mb-4 relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-2 ms-1"
                  style={{ color: styles.textColor2 }}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    value={loginPassword}
                    onChange={handleInputChange(setLoginPassword)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none sm:text-sm pr-10 custom-focus-ring"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                  >
                    {passwordVisible ? (
                      <Eye weight="duotone" size={25} color={COLORS.primary} />
                    ) : (
                      <EyeSlash
                        weight="duotone"
                        size={25}
                        color={COLORS.primary}
                      />
                    )}
                  </button>
                </div>
              </div>
              <div className="hidden items-center mb-4">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me for 30 days
                </label>
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 text-white font-semibold rounded-lg flex items-center justify-center mb-4 mt-7"
                style={{ background: styles.buttonColor1 }}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>
            <div className="text-center mb-4">
              <button
                onClick={handleForgotPassword}
                className="text-sm text-blue-500 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PopupLogin;
