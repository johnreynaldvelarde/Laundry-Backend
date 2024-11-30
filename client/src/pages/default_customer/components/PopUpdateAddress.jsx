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
  MenuItem,
} from "@mui/material";
import toast from "react-hot-toast";
import CustomPopHeaderTitle from "../../../components/common/CustomPopHeaderTitle";
import CustomPopFooterButton from "../../../components/common/CustomPopFooterButton";
import { COLORS } from "../../../constants/color";
import {
  updateCustomerAddress,
  updateCustomerProfile,
} from "../../../services/api/customerApi";
import { cities, provinces, regions } from "../../../utils/country_selection";

const PopUpdateAddress = ({
  open,
  onClose,
  userDetails,
  fetchUserDetails,
  accessToken,
}) => {
  const [username, setUsername] = useState(userDetails.username || "");
  const [email, setEmail] = useState(userDetails.email || "");
  const [phone, setPhone] = useState(userDetails.phone || "");

  const [addressLine, setAddressLine] = useState(
    userDetails.address.addressLine
  );
  const [country, setCountry] = useState(userDetails.address.country);
  const [region, setRegion] = useState(userDetails.address.region);
  const [province, setProvince] = useState(userDetails.address.province);
  const [city, setCity] = useState(userDetails.address.city);
  const [postalCode, setPostalCode] = useState(userDetails.address.postalCode);
  const [latitude, setLatitude] = useState(userDetails.address.latitude);
  const [longitude, setLongitude] = useState(userDetails.address.longitude);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    const newErrors = {};

    if (!addressLine) {
      newErrors.addressLine = "Address is required";
    } else if (addressLine.length < 5) {
      newErrors.addressLine = "Address must be at least 5 characters long";
    } else if (!/[a-zA-Z0-9\s,.-]/.test(addressLine)) {
      newErrors.addressLine =
        "Address can only contain letters, numbers, spaces, commas, periods, and hyphens";
    }

    if (!region) {
      newErrors.region = "Region is required";
    }

    if (!province) {
      newErrors.province = "Province is required";
    }

    if (!city) {
      newErrors.city = "City is required";
    }

    if (!postalCode) {
      newErrors.postalCode = "Postal code is required";
    }

    return newErrors;
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    switch (field) {
      case "addressLine":
        setAddressLine(value);
        break;

      case "region":
        setRegion(value);
        break;

      case "province":
        setProvince(value);
        break;

      case "city":
        setCity(value);
        break;

      case "postalCode":
        setPostalCode(value);
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
      const addressData = {
        address_line: addressLine,
        country: country,
        region: region,
        province: province,
        city: city,
        postal_code: postalCode,
        latitude: latitude,
        longitude: longitude,
      };
      try {
        const response = await updateCustomerAddress.putUpdateAddress(
          userDetails.addressId,
          addressData
        );
        if (response.success) {
          await fetchUserDetails(accessToken);
          toast.success(response.message);
          onClose();
        } else {
          toast.error(response.message);
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
        title={"Update Address"}
        subtitle={"Update your address details"}
        onClose={onClose}
      />
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Address Line"
              variant="outlined"
              fullWidth
              size="small"
              value={addressLine}
              onChange={handleInputChange("addressLine")}
              error={Boolean(errors.addressLine)}
              helperText={errors.addressLine}
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
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              select
              label="Country"
              fullWidth
              size="small"
              variant="outlined"
              value={country}
              onChange={handleInputChange("country")}
              error={Boolean(errors.country)}
              helperText={errors.country}
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
                readOnly: true,
              }}
            >
              <MenuItem value="" disabled>
                Select a country
              </MenuItem>
              <MenuItem value={"Philippines"}>Philippines</MenuItem>
            </TextField>

            {/* Region */}
            <TextField
              select
              margin="dense"
              label="Region"
              fullWidth
              size="small"
              variant="outlined"
              value={region}
              onChange={handleInputChange("region")}
              error={Boolean(errors.region)}
              helperText={errors.region}
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
                Select a region
              </MenuItem>
              {regions.map((region) => (
                <MenuItem key={region.id} value={region.name}>
                  {region.name}
                </MenuItem>
              ))}
            </TextField>

            {/* Province */}
            <TextField
              select
              margin="dense"
              label="Province"
              fullWidth
              size="small"
              variant="outlined"
              value={province}
              onChange={handleInputChange("province")}
              error={Boolean(errors.province)}
              helperText={errors.province}
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
              disabled={!region}
            >
              <MenuItem value="" disabled>
                Select a province
              </MenuItem>
              {region ? (
                provinces[region] && provinces[region].length > 0 ? (
                  provinces[region].map((provinceName, index) => (
                    <MenuItem key={index} value={provinceName}>
                      {provinceName}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No provinces available</MenuItem>
                )
              ) : null}
            </TextField>

            {/* City */}
            <TextField
              select
              margin="dense"
              label="City"
              fullWidth
              size="small"
              variant="outlined"
              value={city}
              onChange={handleInputChange("city")}
              error={Boolean(errors.city)}
              helperText={errors.city}
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
              disabled={!province}
            >
              <MenuItem value="" disabled>
                Select a city
              </MenuItem>
              {province ? (
                cities[province] && cities[province].length > 0 ? (
                  cities[province].map((cityName, index) => (
                    <MenuItem key={index} value={cityName}>
                      {cityName}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No cities available</MenuItem>
                )
              ) : null}
            </TextField>

            {/* Postal Code */}
            <TextField
              margin="dense"
              label="Postal Code"
              type="text"
              fullWidth
              size="small"
              variant="outlined"
              value={postalCode}
              onChange={handleInputChange("postalCode")}
              error={Boolean(errors.postalCode)}
              helperText={errors.postalCode}
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

export default PopUpdateAddress;
