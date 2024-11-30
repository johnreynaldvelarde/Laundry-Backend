import React, { useState } from "react";
import useAuth from "../../../../contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  TextField,
  Typography,
  IconButton,
  Box,
  MenuItem,
  InputAdornment,
  Grid,
  Checkbox,
  FormControlLabel,
  Link,
} from "@mui/material";
import toast from "react-hot-toast";
import { COLORS } from "../../../../constants/color";
import CustomPopFooterButton from "../../../../components/common/CustomPopFooterButton";
import CustomPopHeaderTitle from "../../../../components/common/CustomPopHeaderTitle";
import {
  cities,
  provinces,
  regions,
} from "../../../../utils/country_selection";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import mark from "../../../../assets/images/mark_1.png";
import axios from "axios";
import { createNewCustomerAccount } from "../../../../services/api/postApi";
import usePopup from "../../../../hooks/common/usePopup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import PopupTermsAndCondition from "./PopupTermsAndConditon";

const PopAddNewCustomer = ({ open, onClose, refreshData }) => {
  const { userDetails } = useAuth();
  const { isOpen, popupType, openPopup, closePopup, popupData } = usePopup();

  // Customer name
  const [username, setUsername] = useState("");
  const [defaultPassword, setDefaultPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [middlename, setMiddlename] = useState("");
  const [lastname, setLastname] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAgreement, setIsAgreement] = useState(false);

  // Address
  const [addressLine, setAddressLine] = useState("");
  const [country, setCountry] = useState("Philippines");
  const [region, setRegion] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [latitude, setLatitude] = useState(14.814821);
  const [longitude, setLongitude] = useState(120.91127);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const defaultIcon = new L.Icon({
    iconUrl: mark,
    iconSize: [40, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const getCoordinates = async () => {
    const fullAddress = `${addressLine}, ${city}, ${province}, ${region}, ${country}`;

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          fullAddress
        )}`
      );

      if (response.data.length > 0) {
        const location = response.data[0];
        setLatitude(location.lat);
        setLongitude(location.lon);
        console.log("Latitude:", location.lat, "Longitude:", location.lon);
      } else {
        console.log("No results found for the given address.");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  const validateFields = () => {
    const newErrors = {};

    const fields = {
      // Customer name
      username: "Username is required",
      defaultPassword: "Password is required",
      firstname: "Firstname is required",
      lastname: "Lastname is required",
      number: "Mobile number is required",

      // Address

      addressLine: "Store main address is required",
      country: "Country is required",
      region: "Region is required",
      province: "Province is required",
      city: "City is required",
      postalCode: "Postal code is required",
      latitude: "Latitude is required",
      longitude: "Longitude is required",
    };

    for (const field in fields) {
      let value;

      // Use if-else to determine which value to check
      if (field === "username") {
        value = username;
      } else if (field === "defaultPassword") {
        value = defaultPassword;
      } else if (field === "firstname") {
        value = firstname;
      } else if (field === "middlename") {
        value = middlename;
      } else if (field === "lastname") {
        value = lastname;
      } else if (field === "number") {
        value = number;
      } else if (field === "email") {
        value = email;
      } else if (field === "addressLine") {
        value = addressLine;
      } else if (field === "country") {
        value = country;
      } else if (field === "region") {
        value = region;
      } else if (field === "province") {
        value = province;
      } else if (field === "city") {
        value = city;
      } else if (field === "postalCode") {
        value = postalCode;
      } else if (field === "latitude") {
        value = latitude;
      } else if (field === "longitude") {
        value = longitude;
      }

      if (!value) {
        newErrors[field] = fields[field];
      } else if (field === "defaultPassword" && value.length < 8) {
        newErrors[field] = "Password must be at least 8 characters long";
      }

      // if (value === undefined || value === null || value === "") {
      //   newErrors[field] = fields[field];
      // }
    }

    return newErrors;
  };

  const handleInputChange = (field) => (e) => {
    const isCheckbox = field === "agreement";
    const value = isCheckbox ? e.target.checked : e.target.value;

    if (field === "region") {
      setProvince("");
    }

    if (field === "province") {
      setCity("");
    }
    const fieldToStateMap = {
      username: setUsername,
      defaultPassword: setDefaultPassword,
      firstname: setFirstname,
      middlename: setMiddlename,
      lastname: setLastname,
      number: setNumber,
      email: setEmail,
      agreement: setIsAgreement,

      addressLine: setAddressLine,
      country: setCountry,
      region: setRegion,
      province: setProvince,
      city: setCity,
      postalCode: setPostalCode,
      latitude: setLatitude,
      longitude: setLongitude,
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

  const handleCreateCustomer = async () => {
    const newErrors = validateFields();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (!isAgreement) {
        toast.error(
          "You must agree to the terms and conditions before proceeding."
        );
        return;
      }

      setLoading(true);

      const customerData = {
        store_id: userDetails.storeId,
        username: username,
        password: defaultPassword,
        mobile_number: number,
        email: email,
        firstname: firstname,
        middlename: middlename,
        lastname: lastname,
        isAgreement: isAgreement,

        address_line: addressLine,
        country: country,
        province: province,
        city: city,
        postal_code: postalCode,
        latitude: latitude,
        longitude: longitude,
      };

      try {
        const response = await createNewCustomerAccount.setCustomerAccount(
          customerData
        );

        if (response.success) {
          toast.success(response.message);
          refreshData();
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

  const handleMarkerDragEnd = (event) => {
    const marker = event.target;
    const newLatLng = marker.getLatLng();

    setLatitude(newLatLng.lat);
    setLongitude(newLatLng.lng);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 16,
        },
      }}
    >
      {/* Header */}
      <CustomPopHeaderTitle
        title={"Add New Customer"}
        subtitle={"Provide the details for the new customer below"}
        onClose={onClose}
      />

      {/* Content */}
      <DialogContent>
        <Grid container spacing={2}>
          {/* First Row */}
          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                padding: 1,
              }}
            >
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
              <Box
                sx={{ display: "flex", flexDirection: "row", gap: 1, mb: 1.5 }}
              >
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

              {/* Map Container */}
              <Box
                sx={{
                  flex: "0 0 auto", // Allows the box to take only the necessary space
                  height: "300px", // Set a specific height for the map
                  width: "100%",
                  padding: 1,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                }}
              >
                <MapContainer
                  center={[latitude, longitude]}
                  zoom={15}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker
                    position={[latitude, longitude]}
                    icon={defaultIcon}
                    draggable={true}
                    eventHandlers={{
                      dragend: handleMarkerDragEnd,
                    }}
                  >
                    <Popup>Drag me to change the location</Popup>
                  </Marker>
                </MapContainer>
              </Box>
            </Box>
          </Grid>

          {/* Second Row its Address Section*/}
          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                padding: 1,
              }}
            >
              {/* Address line */}
              <TextField
                margin="dense"
                label="Address Line"
                type="text"
                fullWidth
                variant="outlined"
                value={addressLine}
                onChange={handleInputChange("addressLine")}
                error={Boolean(errors.addressLine)}
                helperText={errors.addressLine}
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
              {/* Country */}
              <TextField
                select
                margin="dense"
                label="Country"
                fullWidth
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
                disabled={!region} // Disable province dropdown until a region is selected
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
              {/* Latitude */}
              <TextField
                margin="dense"
                label="Latitude"
                type="text"
                fullWidth
                variant="outlined"
                value={latitude}
                onChange={handleInputChange("latitude")}
                error={Boolean(errors.latitude)}
                helperText={errors.latitude}
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

              {/* Longitude */}
              <TextField
                margin="dense"
                label="Longitude"
                type="text"
                fullWidth
                variant="outlined"
                value={longitude}
                onChange={handleInputChange("longitude")}
                error={Boolean(errors.longitude)}
                helperText={errors.longitude}
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

              {/* Terms and Conditions */}
              <Box display="flex" alignItems="center" mb={2} ml={1} mt={1}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="agreement"
                      required
                      checked={isAgreement}
                      onChange={handleInputChange("agreement")}
                      sx={{
                        color: "gray",
                        padding: 0.5, // Reduces padding around the checkbox for better alignment
                        "&.Mui-checked": {
                          color: COLORS.secondary,
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      color="textPrimary"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      I agree with the
                      <Link
                        to="#"
                        underline="hover"
                        className="ml-1"
                        style={{ color: COLORS.secondary }}
                        onClick={() => openPopup("termsConditon")}
                      >
                        terms and conditions
                      </Link>
                    </Typography>
                  }
                  sx={{
                    alignItems: "center", // Aligns label and checkbox to the center
                    "& .MuiTypography-root": {
                      marginLeft: 0.5,
                    },
                    "& .MuiFormControlLabel-asterisk": {
                      display: "none", // Hides the asterisk
                    },
                  }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      {/* Footer */}
      <CustomPopFooterButton
        label={"Creater New Customer"}
        onClose={onClose}
        onSubmit={handleCreateCustomer}
        loading={loading}
      />

      {isOpen && popupType === "termsConditon" && (
        <PopupTermsAndCondition open={isOpen} onClose={closePopup} />
      )}
    </Dialog>
  );
};

export default PopAddNewCustomer;
