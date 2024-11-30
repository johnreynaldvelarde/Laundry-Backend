import React, { useEffect, useState } from "react";
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
import { updateAdminBasedUser } from "../../../../services/api/putApi";
import CustomPopHeaderTitle from "../../../../components/common/CustomPopHeaderTitle";

const A_PopupEditUser = ({
  open,
  onClose,
  storeData,
  roleData,
  userData,
  refreshData,
}) => {
  const { userDetails } = useAuth();
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [middlename, setMiddlename] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      const matchingRole = roleData.find(
        (role) => role.role_name === userData.role_name
      );

      setUsername(userData.username || "");
      setFirstname(userData.first_name || "");
      setMiddlename(userData.middle_name || "");
      setLastname(userData.last_name || "");
      setEmail(userData.email || "");
      setNumber(userData.mobile_number || "");
      setSelectedStore(userData.store_id || "");
      setSelectedRole(matchingRole ? matchingRole.id : "");
      setSelectedStatus(
        userData.isStatus === "Active"
          ? 1
          : userData.isStatus === "Deactivated"
          ? 0
          : null
      );
    } else {
      setUsername("");
      setFirstname("");
      setMiddlename("");
      setLastname("");
      setSelectedRole("");
    }
  }, [userData]);

  const validateFields = () => {
    const newErrors = {};

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

    if (selectedStatus === null || selectedStatus === undefined) {
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

  const handleUpdateUser = async (id) => {
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
        mobile_number: number,
        email: email,
        first_name: firstname,
        middle_name: middlename,
        last_name: lastname,
        isStatus: selectedStatus,
      };

      try {
        const response = await updateAdminBasedUser.putAdminBasedUser(
          id,
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
    setLastname("");
    setNumber("");
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
        title={"Edit User Details"}
        subtitle={"Provide the details for the new user below"}
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
      <DialogActions className="flex justify-end space-x-1 mb-1 mr-2">
        <Button
          variant="outlined"
          onClick={handleDialogClose}
          sx={{
            marginRight: 1,
            borderColor: "#595959",
            borderRadius: "5px",
            fontWeight: 500,
            textTransform: "none",
            color: "#595959",
            "&:hover": {
              borderColor: "#595959",
              backgroundColor: "rgba(144, 144, 144, 0.1)",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => handleUpdateUser(userData.user_id)}
          variant="contained"
          disableElevation
          sx={{
            backgroundColor: "#5787C8",
            borderRadius: "5px",
            fontWeight: 500,
            minWidth: "90px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#3A5A85",
            },
          }}
          disabled={loading}
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
          ) : (
            "Update User"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default A_PopupEditUser;
