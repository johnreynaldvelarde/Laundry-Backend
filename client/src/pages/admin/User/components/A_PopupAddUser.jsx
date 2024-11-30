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
import { Visibility, VisibilityOff } from "@mui/icons-material";
import toast from "react-hot-toast";
import { COLORS } from "../../../../constants/color";
import { createAdminBasedNewUser } from "../../../../services/api/postApi";
import CustomPopFooterButton from "../../../../components/common/CustomPopFooterButton";
import CustomPopHeaderTitle from "../../../../components/common/CustomPopHeaderTitle";

const A_PopupAddUser = ({
  open,
  onClose,
  storeData,
  roleData,
  refreshData,
}) => {
  const { userDetails } = useAuth();
  const [username, setUsername] = useState("");
  const [defaultPassword, setDefaultPassword] = useState("@Lizaso12345");
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

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validateFields = () => {
    const newErrors = {};

    if (!defaultPassword) {
      newErrors.defaultPassword = "Password is required";
    } else if (defaultPassword.length < 8) {
      newErrors.defaultPassword = "Password must be at least 8 characters long";
    } else if (!/[A-Z]/.test(defaultPassword)) {
      newErrors.defaultPassword =
        "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(defaultPassword)) {
      newErrors.defaultPassword =
        "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(defaultPassword)) {
      newErrors.defaultPassword = "Password must contain at least one number";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(defaultPassword)) {
      newErrors.defaultPassword =
        "Password must contain at least one special character";
    }

    if (!number) {
      newErrors.number = "Phone number is required";
    } else if (!/^\d+$/.test(number)) {
      newErrors.number = "Phone number must contain only numbers";
    } else if (number.length < 10) {
      newErrors.number = "Phone number must be at least 10 digits";
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email must be a valid format";
    }

    if (!username) {
      newErrors.username = "Username is required";
    } else if (username.length < 5) {
      newErrors.username = "Username must be at least 5 characters long";
    } else if (/\s/.test(username)) {
      newErrors.username = "Username cannot contain spaces";
    }

    if (!firstname) {
      newErrors.firstname = "First name is required";
    }

    if (!lastname) {
      newErrors.lastname = "Last name is required";
    }

    if (!selectedRole) {
      newErrors.selectedRole = "Role is required";
    }

    if (
      selectedStatus === null ||
      selectedStatus === undefined ||
      selectedStatus === ""
    ) {
      newErrors.selectedStatus = "Status is required";
    }

    if (!selectedStore) {
      newErrors.selectedStore = "Store is required";
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
        activity_id: userDetails.userId,
        activity_username: userDetails.username,
        activity_roleName: userDetails.roleName,
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
          refreshData();
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
      onClose={handleDialogClose}
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
        title={"Add New User"}
        subtitle={" Provide the details for the new user below"}
        onClose={handleDialogClose}
      />

      <DialogContent>
        {/* Username */}
        <TextField
          margin="dense"
          label="Username"
          type="text"
          fullWidth
          variant="outlined"
          value={username}
          onChange={handleInputChange("username")}
          error={Boolean(errors.username)}
          helperText={errors.username}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: COLORS.secondary,
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: COLORS.secondary,
            },
          }}
        />

        {/* Default Password */}
        <TextField
          margin="dense"
          label="Password"
          type={showPassword ? "text" : "password"} // Toggle between text and password type
          fullWidth
          variant="outlined"
          value={defaultPassword}
          onChange={handleInputChange("defaultPassword")}
          error={Boolean(errors.defaultPassword)}
          helperText={errors.defaultPassword}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: COLORS.secondary,
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: COLORS.secondary,
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility} edge="end">
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {/* First name, Last name, Middle name */}
        <Box sx={{ display: "flex", flexDirection: "row", gap: 1, mb: 1.5 }}>
          <TextField
            margin="dense"
            label="First name"
            type="text"
            fullWidth
            variant="outlined"
            value={firstname}
            onChange={handleInputChange("firstname")}
            error={Boolean(errors.firstname)}
            helperText={errors.firstname}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: COLORS.secondary,
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: COLORS.secondary,
              },
            }}
          />
          <TextField
            margin="dense"
            label="Last name"
            type="text"
            fullWidth
            variant="outlined"
            value={lastname}
            onChange={handleInputChange("lastname")}
            error={Boolean(errors.lastname)}
            helperText={errors.lastname}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: COLORS.secondary,
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: COLORS.secondary,
              },
            }}
          />
          <TextField
            margin="dense"
            label="Middle Initial"
            type="text"
            variant="outlined"
            value={middlename}
            onChange={handleInputChange("middlename")}
            sx={{
              width: "400px",
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: COLORS.secondary,
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: COLORS.secondary,
              },
            }}
          />
        </Box>
        {/* Mobile Number */}
        <TextField
          margin="dense"
          label="Mobile Number"
          type="tel"
          fullWidth
          variant="outlined"
          value={number}
          error={Boolean(errors.number)}
          helperText={errors.number}
          onChange={(e) => {
            const { value } = e.target;
            handleInputChange("number")({
              target: { value: value.replace(/[^0-9]/g, "") },
            });
          }}
          inputProps={{
            inputMode: "numeric",
          }}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: COLORS.secondary,
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: COLORS.secondary,
            },
          }}
        />

        {/* Email */}
        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          variant="outlined"
          value={email}
          error={Boolean(errors.email)}
          helperText={errors.email}
          onChange={(e) => {
            const { value } = e.target;
            handleInputChange("email")({
              target: { value: value.replace(/[^a-zA-Z0-9@._-]/g, "") },
            });
          }}
          inputProps={{
            inputMode: "email",
          }}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: COLORS.secondary,
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: COLORS.secondary,
            },
          }}
        />

        {/* Select a role */}
        <TextField
          select
          margin="dense"
          label="Role"
          fullWidth
          variant="outlined"
          value={selectedRole}
          onChange={handleInputChange("selectedRole")}
          error={Boolean(errors.selectedRole)}
          helperText={errors.selectedRole}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: COLORS.secondary,
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: COLORS.secondary,
            },
          }}
        >
          <MenuItem value="" disabled>
            Select a role
          </MenuItem>
          {roleData.map((role) => (
            <MenuItem key={role.id} value={role.id}>
              {role.role_name}
            </MenuItem>
          ))}
        </TextField>

        {/* Status and Permission */}
        <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
          {/* Select a status */}
          <TextField
            select
            margin="dense"
            label="Status"
            fullWidth
            variant="outlined"
            value={selectedStatus}
            onChange={handleInputChange("selectedStatus")}
            error={Boolean(errors.selectedStatus)}
            helperText={errors.selectedStatus}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: COLORS.secondary,
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: COLORS.secondary,
              },
            }}
          >
            <MenuItem value="" disabled>
              Select a status
            </MenuItem>
            <MenuItem value={0}>Deactivate</MenuItem>
            <MenuItem value={1}>Activate</MenuItem>
          </TextField>
          {/* Select a store*/}
          <TextField
            select
            margin="dense"
            label="Store"
            fullWidth
            variant="outlined"
            value={selectedStore}
            onChange={handleInputChange("selectedStore")}
            error={Boolean(errors.selectedStore)}
            helperText={errors.selectedStore}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: COLORS.secondary,
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: COLORS.secondary,
              },
            }}
          >
            {/* Add your role options here */}
            <MenuItem value="" disabled>
              Select a store
            </MenuItem>
            {storeData.map((store) => (
              <MenuItem key={store.id} value={store.id}>
                {store.store_name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>
      {/* Footer */}
      <CustomPopFooterButton
        label={"Creater User"}
        onClose={handleDialogClose}
        onSubmit={handleCreateUser}
        loading={loading}
      />
    </Dialog>
  );
};

export default A_PopupAddUser;
