import React, { useState } from "react";
import useAuth from "../../../../contexts/AuthContext";
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
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";
import { COLORS } from "../../../../constants/color";
import { createAdminBasedNewUser } from "../../../../services/api/postApi";
import CustomPopFooterButton from "../../../../components/common/CustomPopFooterButton";
import CustomPopHeaderTitle from "../../../../components/common/CustomPopHeaderTitle";

const TermsCondtions = ({ open, onClose }) => {
  const { userDetails } = useAuth();
  const [username, setUsername] = useState("");
  const [defaultPassword, setDefaultPassword] = useState("lizaso12345");
  const [firstname, setFirstname] = useState("");
  const [middlename, setMiddlename] = useState("");
  const [lastname, setLastname] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateFields = () => {
    const newErrors = {};

    const fields = {
      username: "Username is required",
      defaultPassword: "Password is required",
      firstname: "Firstname is required",
      lastname: "Lastname is required",
      number: "Mobile number is required",
      selectedRole: "Role is required",
      selectedStatus: "Status is required",
      selectedStore: "Store is required",
    };

    for (const field in fields) {
      let value;

      // Use if-else to determine which value to check
      if (field === "selectedStatus") {
        value = selectedStatus;
      } else if (field === "selectedRole") {
        value = selectedRole;
      } else if (field === "username") {
        value = username;
      } else if (field === "defaultPassword") {
        value = defaultPassword;
      } else if (field === "firstname") {
        value = firstname;
      } else if (field === "lastname") {
        value = lastname;
      } else if (field === "number") {
        value = number;
      } else if (field === "email") {
        value = email;
      } else if (field === "selectedStore") {
        value = selectedStore;
      }

      if (value === undefined || value === null || value === "") {
        newErrors[field] = fields[field];
      }
    }

    return newErrors;
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;

    const fieldToStateMap = {
      username: setUsername,
      defaultPassword: setDefaultPassword,
      firstname: setFirstname,
      lastname: setLastname,
      middlename: setMiddlename,
      number: setNumber,
      email: setEmail,
      selectedRole: setSelectedRole,
      selectedStatus: setSelectedStatus,
      selectedStore: setSelectedStore,
    };

    const setFieldValue = fieldToStateMap[field];
    if (setFieldValue) {
      setFieldValue(value);
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };

  const handleCreateUser = async () => {
    const newErrors = validateFields();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);

      const userData = {
        store_id: selectedStore,
        role_permissions_id: selectedRole,
        username: username,
        password: defaultPassword,
        mobile_number: number,
        email: email,
        first_name: firstname,
        middle_name: middlename,
        last_name: lastname,
        isStatus: selectedStatus,
      };

      try {
        const response = await createAdminBasedNewUser.setAdminBasedNewUser(
          userData
        );

        if (response.success) {
          toast.success(response.message);
          onClose();
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            username: response.message,
          }));
        }
      } catch (error) {
        toast.error(
          `Error posting new user: ${error.message || "Something went wrong"}`
        );
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setUsername("");
    setFirstname("");
    setMiddlename("");
    setLastname("");
    setNumber("");
    setEmail("");
    setSelectedRole("");
    setSelectedStatus("");
    setSelectedStore("");

    setErrors({});

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 16,
        },
      }}
    >
      {/* Header */}
      <CustomPopHeaderTitle
        title={"Terms and Conditons"}
        subtitle={" Provide the details for the new user below"}
        onClose={onClose}
      />

      <DialogContent></DialogContent>
      {/* Footer */}
      <CustomPopFooterButton
        label={"Creater User"}
        onClose={onClose}
        onSubmit={handleCreateUser}
        loading={loading}
      />
    </Dialog>
  );
};

export default TermsCondtions;
