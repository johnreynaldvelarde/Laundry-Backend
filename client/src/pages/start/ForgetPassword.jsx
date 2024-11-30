import React, { useState } from "react";
import { COLORS } from "../../constants/color";
import forgetPasswordImage from "../../assets/images/forget-password.jpg";
import backgroundImage from "../../assets/images/forget-password-background_1.jpg";
import { isEmailExist } from "../../services/api/authClient";
import toast from "react-hot-toast";
import emailjs from "emailjs-com";
import { Eye, EyeSlash } from "@phosphor-icons/react";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState(["", "", "", ""]);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [newPassword, setNewPassword] = useState(""); // Step 3: New password state
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm password state
  const [isPasswordReset, setIsPasswordReset] = useState(false); // Track if password is reset
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSendCode = async () => {
    setLoading(true);
    setMessage("");

    if (!email) {
      setMessage("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    setIsCodeSent(true);

    // try {
    //   const response = await isEmailExist.setIsEmailExist({ email });

    //   if (response.success) {
    //     const code = Math.floor(1000 + Math.random() * 9000);
    //     setGeneratedCode(code);

    //     const templateParams = {
    //       to_email: email,
    //       message: code,
    //     };

    //     try {
    //       await emailjs.send(
    //         "service_touybgx", // Your service ID
    //         "template_5iwb032", // Your template ID
    //         templateParams,
    //         "Oq4cYUTNQuMvd3o-M"
    //       );

    //       toast.success("A verification code has been sent to your email.");
    //       setIsCodeSent(true);
    //     } catch (emailError) {
    //       console.error("Error sending email:", emailError);
    //       setMessage(
    //         "There was an error sending the verification email. Please try again."
    //       );
    //     }
    //   } else {
    //     // Handle the case where the email doesn't exist
    //     setMessage(response.message);
    //   }
    // } catch (error) {
    //   console.error("Error:", error);
    //   setMessage(
    //     "There was an error processing your request. Please try again."
    //   );
    // } finally {
    //   setLoading(false);
    // }
  };

  const handleVerifyCode = () => {
    setIsPasswordReset(true);
    // if (verificationCode.includes("")) {
    //   toast.error("Please enter the complete 4-digit verification code.");
    //   return;
    // }

    // if (verificationCode.join("") === String(generatedCode)) {
    //   toast.success(
    //     "Verification successful! You may now reset your password."
    //   );
    //   setIsPasswordReset(true); // Show password reset step after successful verification
    // } else {
    //   toast.error("The code you entered is incorrect. Please try again.");
    // }
  };
  const handlePasswordReset = () => {
    console.log(newPassword);
    console.log(confirmPassword);
    // if (!newPassword) {
    //   toast.error("Please enter a new password.");
    //   return;
    // }

    // if (newPassword !== confirmPassword) {
    //   toast.error("Passwords do not match.");
    //   return;
    // }

    // const passwordPattern =
    //   /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    // if (!passwordPattern.test(newPassword)) {
    //   toast.error(
    //     "Password must be at least 8 characters long, contain at least one letter, one number, and one special character."
    //   );
    //   return;
    // }

    try {
      // const response = await isEmailExist.setIsEmailExist({ email });
      // if (response.success) {
      //   const code = Math.floor(1000 + Math.random() * 9000);
      //   setGeneratedCode(code);
      //   const templateParams = {
      //     to_email: email,
      //     message: code,
      //   };
      //   try {
      //     await emailjs.send(
      //       "service_touybgx", // Your service ID
      //       "template_5iwb032", // Your template ID
      //       templateParams,
      //       "Oq4cYUTNQuMvd3o-M"
      //     );
      //     toast.success("A verification code has been sent to your email.");
      //     setIsCodeSent(true);
      //   } catch (emailError) {
      //     console.error("Error sending email:", emailError);
      //     setMessage(
      //       "There was an error sending the verification email. Please try again."
      //     );
      //   }
      // } else {
      //   // Handle the case where the email doesn't exist
      //   setMessage(response.message);
      // }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }

    // toast.success("Your password has been successfully reset!");

    // window.location.href = "/login";
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value)) {
      // Ensures only single digits (0-9)
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      // Automatically focus next input
      if (index < 3 && value) {
        document.getElementById(`code-input-${index + 1}`).focus();
      }
    }
  };

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          opacity: 0.1,
        }}
      ></div>

      <div className="flex items-center justify-center min-h-screen relative z-10">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
          <img
            src={forgetPasswordImage}
            alt="Forget Password"
            className="w-full h-64 object-cover rounded-t-lg mb-1"
          />
          <h1
            className="text-3xl font-bold text-center"
            style={{ color: COLORS.secondary }}
          >
            Forget your Password
          </h1>
          <p className="mt-2 text-center text-gray-600">
            Enter your email to reset it
          </p>

          {/* Step 1: Enter Email */}
          {!isCodeSent && !isPasswordReset && (
            <>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="mt-6 px-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-1"
              />

              {message && (
                <p
                  className="mt-4 text-center"
                  style={{ color: COLORS.primary }}
                >
                  {message}
                </p>
              )}

              <button
                onClick={handleSendCode}
                className="mt-6 px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-all w-full"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Verification Code"}
              </button>
            </>
          )}

          {/* Step 2: Enter Verification Code */}
          {isCodeSent && !isPasswordReset && (
            <>
              <p className="mt-4 text-center text-gray-600">
                Enter the 4-digit verification code sent to your email
              </p>
              <div className="flex justify-center mt-4 space-x-2">
                {verificationCode.map((num, index) => (
                  <input
                    key={index}
                    id={`code-input-${index}`}
                    type="text"
                    value={num}
                    onChange={(e) => handleChange(e, index)}
                    maxLength="1"
                    className="w-12 h-12 text-center border rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ))}
              </div>
              <button
                onClick={handleVerifyCode}
                className="mt-6 px-6 py-2 text-white bg-green-500 rounded hover:bg-green-600 transition-all w-full"
              >
                Verify Code
              </button>
            </>
          )}

          {/* Step 3: Enter New Password */}
          {isPasswordReset && (
            <>
              {/* New Password Input */}
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"} // Toggle between text and password input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="mt-6 px-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-1"
                />
                <div
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeSlash /> : <Eye />}{" "}
                  {/* Toggle eye icon */}
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="relative mt-4">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none sm:text-sm pr-10 custom-focus-ring"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <Eye weight="duotone" size={25} color={COLORS.primary} />
                  ) : (
                    <EyeSlash
                      weight="duotone"
                      size={25}
                      color={COLORS.primary}
                    />
                  )}
                </button>
                {/* <input
                  type={showConfirmPassword ? "text" : "password"} // Toggle between text and password input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="px-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-1"
                />
                <div
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlash
                      color={COLORS.primary}
                      size={25}
                      weight="duotone"
                    />
                  ) : (
                    <Eye />
                  )}
                  {/* Toggle eye icon
                </div>  */}
              </div>

              {/* Error Message for Mismatched Passwords */}
              {newPassword &&
                confirmPassword &&
                newPassword !== confirmPassword && (
                  <p className="text-red-500 mt-2 text-center">
                    Passwords do not match.
                  </p>
                )}

              {/* Submit Button */}
              <button
                onClick={handlePasswordReset}
                className="mt-6 px-6 py-2 text-white bg-green-500 rounded hover:bg-green-600 transition-all w-full"
                disabled={newPassword !== confirmPassword || newPassword === ""}
              >
                Reset Password
              </button>
            </>
          )}

          <button
            onClick={() => (window.location.href = "/main")}
            className="mt-4 px-6 py-2 text-white bg-gray-500 rounded hover:bg-gray-600 transition-all w-full"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
