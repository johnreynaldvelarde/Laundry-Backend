import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../contexts/AuthContext";
import { checkCustomerDetails } from "../services/api/checkApi";
import {
  registerService,
  checkUsername,
  loginService,
} from "../services/api/authClient";
import toast from "react-hot-toast";

const useRegisterForm = (showCreateAccountPopup, setShowCreateAccountPopup) => {
  const { fetchUserDetails, setAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(showCreateAccountPopup);
  const navigate = useNavigate();

  // Hold Inputs
  const [data, setData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    userName: "",
    password: "",
    confirmPassword: "",
    isAgreement: "",
  });

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAgreement, setIsAgreement] = useState("");

  useEffect(() => {
    setIsVisible(showCreateAccountPopup);
  }, [showCreateAccountPopup]);

  const Clear = () => {
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setUserName("");
    setEmail("");
    setNumber("");
    setPassword("");
    setConfirmPassword("");
    setIsAgreement(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long!");
      return;
    }

    try {
      const checkResponse = await checkUsername.getCheckUsername({
        username: userName,
      });

      if (
        checkResponse &&
        checkResponse.message &&
        checkResponse.message.includes("already exists")
      ) {
        toast.error("Username already exists ");
        return;
      }

      setLoading(true);

      const response = await registerService.register({
        firstname: firstName,
        middlename: middleName,
        lastname: lastName,
        username: userName,
        password: password,
        email: email,
        mobile_number: number,
        isAgreement: isAgreement,
      });

      if (response.success) {
        toast.success("Registration successful!");

        const { success, userId, userType, roleName, accessToken } =
          await loginService.login({
            username: userName,
            password: password,
          });

        if (success) {
          if (accessToken) {
            setAccessToken(accessToken);
            await fetchUserDetails(accessToken);
          }

          Clear();

          if (userType === "Customer") {
            const customerDetails =
              await checkCustomerDetails.getCheckCustomerDetails(userId);

            if (customerDetails.success !== false) {
              if (
                customerDetails.storeIdIsNull ||
                customerDetails.addressIsNull
              ) {
                navigate("/complete-details");
              } else {
                navigate("/customer-page");
              }
            } else {
              toast.error("Failed to check customer details.");
            }
          } else {
            if (roleName === "Administrator") {
              navigate("/main");
            } else if (roleName === "Manager") {
              navigate("/main");
            } else {
            }
          }

          // if (userType === "Customer") {
          //   const customerDetails =
          //     await checkCustomerDetails.getCheckCustomerDetails(userName);
          //   if (customerDetails.success !== false) {
          //     if (
          //       customerDetails.storeIdIsNull ||
          //       customerDetails.cNumberIsNull ||
          //       customerDetails.cEmailIsNull
          //     ) {
          //       navigate("/complete-details");
          //     } else {
          //       navigate("/customer-page");
          //     }
          //   } else {
          //     // Handle the case where checking customer details fails
          //     toast.error("Failed to check customer details.");
          //   }
          // } else {
          //   // Redirect to main page for non-customer users
          //   navigate("/main");
          // }
        }

        // const loginResponse = await loginService.login({
        //   username: userName,
        //   password: password,
        // });

        // setTimeout(async () => {

        // }, 1000);
      } else {
        toast.error(
          response.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      setLoading(false);
      toast.error("There was an error registering. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    passwordVisible,
    setPasswordVisible,
    confirmPasswordVisible,
    setConfirmPasswordVisible,
    isVisible,
    setIsVisible,
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
    setData,
    loading,
  };
};

export default useRegisterForm;

// Password match validation
// if (password !== confirmPassword) {
//   toast.error("Passwords do not match!");
//   return;
// }
