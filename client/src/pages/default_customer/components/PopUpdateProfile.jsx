import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  Typography,
  Divider,
  Box,
  Avatar,
  Grid,
} from "@mui/material";
import toast from "react-hot-toast";
import CustomPopHeaderTitle from "../../../components/common/CustomPopHeaderTitle";
import CustomPopFooterButton from "../../../components/common/CustomPopFooterButton";
import { COLORS } from "../../../constants/color";
import { updateCustomerProfile } from "../../../services/api/customerApi";

const PopUpdateProfile = ({
  open,
  onClose,
  userDetails,
  fetchUserDetails,
  accessToken,
}) => {
  const [firstname, setFirstName] = useState(userDetails.firstname);
  const [middlename, setMiddleName] = useState(userDetails.middlename || "");
  const [lastname, setLastName] = useState(userDetails.lastname || "");
  const [username, setUsername] = useState(userDetails.username || "");
  const [email, setEmail] = useState(userDetails.email || "");
  const [phone, setPhone] = useState(userDetails.phone || "");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    const newErrors = {};

    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d+$/.test(phone)) {
      newErrors.phone = "Phone number must contain only numbers";
    } else if (phone.length < 10) {
      newErrors.phone = "Phone number must be at least 10 digits";
    }
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email must be a valid format";
    }

    if (!username) {
      newErrors.username = "Username is required";
    } else if (username.length < 5) {
      newErrors.username = "Username must be at least 5 characters long";
    }

    if (!firstname) {
      newErrors.firstname = "First name is required";
    }

    if (!lastname) {
      newErrors.lastname = "Last name is required";
    }

    return newErrors;
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    switch (field) {
      case "phone":
        setPhone(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "firstname":
        setFirstName(value);
        break;
      case "middlename":
        setMiddleName(value);
        break;
      case "lastname":
        setLastName(value);
        break;
      case "username":
        setUsername(value);
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
      const userData = {
        mobile_number: phone,
        email: email,
        username: username,
        firstname: firstname,
        middlename: middlename,
        lastname: lastname,
      };

      try {
        const response = await updateCustomerProfile.putUpdateProfile(
          userDetails.userId,
          userData
        );
        if (response.success) {
          await fetchUserDetails(accessToken);
          toast.success(response.message);
          onClose();
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            username: response.message,
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
        title={"Update Profile"}
        subtitle={"Enter the details to update your profile information"}
        onClose={onClose}
      />
      <DialogContent>
        <Box sx={{ mt: 3 }}>
          <Avatar
            src="/images/avatars/profile-avatar.png"
            sx={{ width: 100, height: 100, mx: "auto" }}
          />
        </Box>

        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              size="small"
              value={firstname}
              onChange={handleInputChange("firstname")}
              error={Boolean(errors.firstname)}
              helperText={errors.firstname}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-error": {
                    borderColor: "red",
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Middle Name"
              variant="outlined"
              fullWidth
              size="small"
              value={middlename}
              onChange={handleInputChange("middlename")}
              error={Boolean(errors.middlename)}
              helperText={errors.middlename}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-error": {
                    borderColor: "red",
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              size="small"
              value={lastname}
              onChange={handleInputChange("lastname")}
              error={Boolean(errors.lastname)}
              helperText={errors.lastname}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-error": {
                    borderColor: "red",
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              size="small"
              value={username}
              onChange={handleInputChange("username")}
              error={Boolean(errors.username)}
              helperText={errors.username}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-error": {
                    borderColor: "red",
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              placeholder="e.g., example@domain.com"
              variant="outlined"
              fullWidth
              size="small"
              value={email}
              onChange={handleInputChange("email")}
              error={Boolean(errors.email)}
              helperText={errors.email}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-error": {
                    borderColor: "red",
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone"
              variant="outlined"
              fullWidth
              size="small"
              value={phone}
              onChange={handleInputChange("phone")}
              error={Boolean(errors.phone)}
              helperText={errors.phone}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-error": {
                    borderColor: "red",
                  },
                },
              }}
            />
          </Grid>
        </Grid>
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

export default PopUpdateProfile;
