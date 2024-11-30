import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  IconButton,
  Box,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import styles from "../../style";
import X from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import useRegisterForm from "../../hooks/useRegisterForm";
import CustomPopHeaderTitle from "./CustomPopHeaderTitle";
import { COLORS } from "../../constants/color";
import usePopup from "../../hooks/common/usePopup";
import PopupTermsAndCondition from "./PopupTermsAndConditon";

const PopupCreateAccount = ({
  showCreateAccountPopup,
  setShowCreateAccountPopup,
}) => {
  const {
    passwordVisible,
    setPasswordVisible,
    confirmPasswordVisible,
    setConfirmPasswordVisible,
    isVisible,
    firstName,
    setFirstName,
    middleName,
    setMiddleName,
    lastName,
    setLastName,
    userName,
    setUserName,
    email,
    setEmail,
    number,
    setNumber,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isAgreement,
    setIsAgreement,
    handleRegister,
    loading,
  } = useRegisterForm(showCreateAccountPopup, setShowCreateAccountPopup);
  const { isOpen, popupType, openPopup, closePopup, popupData } = usePopup();


  return (
    <Dialog
      open={showCreateAccountPopup}
      onClose={() => setShowCreateAccountPopup(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 16,
        },
      }}
    >
      {/* Header Section */}
      {/* <button
        onClick={() => setShowCreateAccountPopup(false)}
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
      >
        <X />
      </button> */}

      {/* Header */}
      <CustomPopHeaderTitle
        title={"Create an Account"}
        subtitle={"Please fill in the details below to create a new account"}
        onClose={() => setShowCreateAccountPopup(false)}
      />

      <DialogContent>
        <form onSubmit={handleRegister}>
          {/* Fullname */}
          <div className="mb-6 flex gap-4">
            <div className="w-full">
              <label
                htmlFor="first-name"
                className="block mb-2 text-base font-medium text-gray-900 ms-1"
                style={{ color: styles.textColor2 }}
              >
                First Name
              </label>
              <input
                type="text"
                id="first-name"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
                style={{ outlineColor: styles.inputBorderColor1 }}
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="middle-name"
                className="block mb-2 text-base font-medium text-gray-900 ms-1"
                style={{ color: styles.textColor2 }}
              >
                Middle Name
              </label>
              <input
                type="text"
                id="middle-name"
                placeholder="Doe"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                style={{ outlineColor: styles.inputBorderColor1 }}
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="last-name"
                className="block mb-2 text-base font-medium text-gray-900 ms-1"
                style={{ color: styles.textColor2 }}
              >
                Last Name
              </label>
              <input
                type="text"
                id="last-name"
                placeholder="Smith"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
                style={{ outlineColor: styles.inputBorderColor1 }}
              />
            </div>
          </div>

          {/*Username*/}
          <div className="mb-6">
            <label
              htmlFor="usename"
              className="block mb-2 text-base font-medium text-gray-900 ms-1 "
              style={{ color: styles.textColor2 }}
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="@johnSmith16"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
              style={{ outlineColor: styles.inputBorderColor1 }}
            />
          </div>

          {/*Email*/}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block mb-2 text-base font-medium text-gray-900 ms-1 "
              style={{ color: styles.textColor2 }}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              style={{ outlineColor: styles.inputBorderColor1 }}
            />
          </div>

          {/* Mobile */}
          <div className="mb-6">
            <label
              htmlFor="number"
              className="block mb-2 text-base font-medium text-gray-900 ms-1 "
              style={{ color: styles.textColor2 }}
            >
              Mobile Number
            </label>
            <input
              type="tel"
              id="number"
              placeholder="Enter your mobile number"
              value={number}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                setNumber(value);
              }}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
              style={{ outlineColor: styles.inputBorderColor1 }}
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label
              htmlFor="password-input"
              className="block mb-2 text-base font-medium text-gray-900 ms-1"
              style={{ color: styles.textColor2 }}
            >
              Password
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
                style={{ outlineColor: styles.inputBorderColor1 }}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </button>
            </div>
          </div>

          {/* Terms and Condition */}
          <div className="flex items-start mb-6 ms-1">
            <div className="flex items-center h-5">
              <input
                id="agreement"
                type="checkbox"
                checked={isAgreement}
                onChange={(e) => setIsAgreement(e.target.checked)}
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                required
              />
            </div>
            <label
              htmlFor="agreement"
              className="ms-2 text-sm font-medium text-gray-900"
            >
              I agree with the{" "}
              <a
                href="#"
                className=" hover:underline"
                style={{ color: COLORS.secondary }}
                onClick={() => openPopup("termsConditon")}
              >
                terms and conditions
              </a>
              .
            </label>
          </div>

          {/* Create button section */}
          <div className="mb-3">
            <button
              className="w-full text-white p-2 rounded-md font-semibold"
              style={{ background: styles.buttonColor1 }}
            >
              Create Account
            </button>
          </div>
        </form>
      </DialogContent>
       {isOpen && popupType === "termsConditon" && (
        <PopupTermsAndCondition open={isOpen} onClose={closePopup} />
      )}
    </Dialog>
  );
};

export default PopupCreateAccount;
