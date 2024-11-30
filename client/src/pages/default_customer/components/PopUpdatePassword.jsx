import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  Grid,
  InputAdornment,
  IconButton,
} from "@mui/material";
import toast from "react-hot-toast";
import CustomPopHeaderTitle from "../../../components/common/CustomPopHeaderTitle";
import CustomPopFooterButton from "../../../components/common/CustomPopFooterButton";
import { COLORS } from "../../../constants/color";
import { updateCustomerPassword } from "../../../services/api/customerApi";
import { Eye, EyeSlash } from "@phosphor-icons/react";

const PopUpdatePassword = ({
  open,
  onClose,
  userDetails,
  fetchUserDetails,
  accessToken,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false);
  const [isCurrentPasswordShown, setIsCurrentPasswordShown] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    const newErrors = {};

    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!password) {
      newErrors.password = "New password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Password must contain at least one number";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      newErrors.password =
        "Password must contain at least one special character";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    switch (field) {
      case "currentPassword":
        setCurrentPassword(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };

  const handleSave = async () => {
    const newErrors = validateFields();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      const passwordData = { currentPassword, password };
      try {
        const response = await updateCustomerPassword.putUpdatePassword(
          userDetails.addressId,
          passwordData
        );
        if (response.success) {
          await fetchUserDetails(accessToken);
          toast.success(response.message);
          onClose();
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            currentPassword: response.message,
          }));
        }
      } catch (error) {
        toast.error(`Error with service request: ${error.message || error}`);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 16,
        },
      }}
    >
      {/* Header */}
      <CustomPopHeaderTitle
        title={"Reset Password"}
        subtitle={"Secure your account with a new password"}
        onClose={onClose}
      />
      <DialogContent>
        <form onSubmit={handleSave}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Current Password"
                variant="outlined"
                fullWidth
                size="small"
                value={currentPassword}
                onChange={handleInputChange("currentPassword")}
                error={Boolean(errors.currentPassword)}
                helperText={errors.currentPassword}
                type={isCurrentPasswordShown ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setIsCurrentPasswordShown((prev) => !prev)
                        }
                      >
                        {!isCurrentPasswordShown ? (
                          <EyeSlash weight="duotone" color={COLORS.primary} />
                        ) : (
                          <Eye weight="duotone" color={COLORS.primary} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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
                inputProps={{
                  autoComplete: "current-password",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="New Password"
                fullWidth
                size="small"
                variant="outlined"
                value={password}
                onChange={handleInputChange("password")}
                error={Boolean(errors.password)}
                helperText={errors.password}
                type={isPasswordShown ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setIsPasswordShown((prev) => !prev)}
                      >
                        {!isPasswordShown ? (
                          <EyeSlash weight="duotone" color={COLORS.primary} />
                        ) : (
                          <Eye weight="duotone" color={COLORS.primary} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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
                inputProps={{
                  autoComplete: "new-password",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Confirm Password"
                fullWidth
                size="small"
                variant="outlined"
                value={confirmPassword}
                onChange={handleInputChange("confirmPassword")}
                error={Boolean(errors.confirmPassword)}
                helperText={errors.confirmPassword}
                type={isConfirmPasswordShown ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setIsConfirmPasswordShown((prev) => !prev)
                        }
                      >
                        {!isConfirmPasswordShown ? (
                          <EyeSlash weight="duotone" color={COLORS.primary} />
                        ) : (
                          <Eye weight="duotone" color={COLORS.primary} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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
                inputProps={{
                  autoComplete: "confirm-password",
                }}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      {/* Footer */}
      <CustomPopFooterButton
        label={"Update"}
        onClose={onClose}
        loading={loading}
        onSubmit={handleSave}
      />
    </Dialog>
  );
};

export default PopUpdatePassword;
