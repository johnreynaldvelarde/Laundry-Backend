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
  Grid,
} from "@mui/material";
import toast from "react-hot-toast";
import { COLORS } from "../../../../constants/color";
import CustomPopFooterButton from "../../../../components/common/CustomPopFooterButton";
import CustomPopHeaderTitle from "../../../../components/common/CustomPopHeaderTitle";
import { ArrowsClockwise } from "@phosphor-icons/react";
import { handleGenerate } from "../../../../utils/generateStoreNo";
import {
  cities,
  provinces,
  regions,
} from "../../../../utils/country_selection";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import mark from "../../../../assets/images/mark_1.png";
import axios from "axios";
import { createNewStore } from "../../../../services/api/postApi";

const PopAddNewStore = ({ open, onClose, refreshData }) => {
  const { userDetails } = useAuth();
  // Store
  const [storeName, setStoreName] = useState("");
  const [storeNo, setStoreNo] = useState("");
  const [storeContact, setStoreContact] = useState("");
  const [storeEmail, setStoreEmail] = useState("");

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
      // Store
      storeName: "Store name is required",
      storeNo: "Store generate number is required",
      storeContact: "Store mobile number or telephone number is required",
      storeEmail: "Store email is required",

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]+$/;

    const countWords = (str) => {
      return str.trim().split(/\s+/).length;
    };

    const validatePhoneNumberLength = (phoneNumber) => {
      const cleanedPhoneNumber = phoneNumber.replace(/\D/g, "");
      return cleanedPhoneNumber.length > 10;
    };

    for (const field in fields) {
      let value;

      if (field === "storeName") {
        value = storeName;
      } else if (field === "storeNo") {
        value = storeNo;
      } else if (field === "storeContact") {
        value = storeContact;
      } else if (field === "storeEmail") {
        value = storeEmail;
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

      if (value === undefined || value === null || value === "") {
        newErrors[field] = fields[field];
      } else if (
        (field === "storeName" || field === "addressLine") &&
        countWords(value) < 2
      ) {
        newErrors[field] = `${fields[field]} (must contain at least 2 words)`;
      } else if (field === "storeContact") {
        if (!phoneRegex.test(value)) {
          newErrors[field] = "Store mobile number must contain only digits";
        } else if (!validatePhoneNumberLength(value)) {
          newErrors[field] = "Store mobile number must be more than 10 digits";
        }
      } else if (field === "storeEmail" && !emailRegex.test(value)) {
        newErrors[field] = "Store email must be in a valid format";
      }
    }

    return newErrors;
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;

    if (field === "region") {
      setProvince("");
    }

    if (field === "province") {
      setCity("");
    }
    const fieldToStateMap = {
      storeName: setStoreName,
      storeNo: setStoreNo,
      storeContact: setStoreContact,
      storeEmail: setStoreEmail,

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

  const handleCreateStore = async () => {
    const newErrors = validateFields();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);

      const storeData = {
        activity_id: userDetails.userId,
        activity_username: userDetails.username,
        activity_roleName: userDetails.roleName,
        store_no: storeNo,
        store_name: storeName,
        store_contact: storeContact,
        store_email: storeEmail,
        address_line: addressLine,
        country: country,
        province: province,
        city: city,
        postal_code: postalCode,
        latitude: latitude,
        longitude: longitude,
      };

      try {
        const response = await createNewStore.setNewStore(storeData);

        if (response.success) {
          refreshData();
          toast.success(response.message);
          onClose();
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            storeName: response.message_store_name,
            storeNo: response.message_store_no,
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
        title={"Add New Store"}
        subtitle={"Provide the details for the new store below"}
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
              {/* Store name */}
              <TextField
                margin="dense"
                label="Store name"
                type="text"
                fullWidth
                variant="outlined"
                value={storeName}
                onChange={handleInputChange("storeName")}
                error={Boolean(errors.storeName)}
                helperText={errors.storeName}
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

              {/* Store no */}
              <TextField
                margin="dense"
                label="Store no"
                type="text"
                fullWidth
                variant="outlined"
                value={storeNo}
                onChange={handleInputChange("storeNo")}
                error={Boolean(errors.storeNo)}
                helperText={errors.storeNo}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handleGenerate(setStoreNo)}
                        edge="end"
                        aria-label="generate store number"
                      >
                        <ArrowsClockwise
                          color={COLORS.secondary}
                          weight="fill"
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
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

              {/* Mobile Number */}
              <TextField
                margin="dense"
                label="Mobile or Telephone number"
                type="tel"
                fullWidth
                variant="outlined"
                value={storeContact}
                error={Boolean(errors.storeContact)}
                helperText={errors.storeContact}
                onChange={(e) => {
                  const { value } = e.target;
                  handleInputChange("storeContact")({
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
                label="Store email"
                type="email"
                fullWidth
                variant="outlined"
                value={storeEmail}
                error={Boolean(errors.storeEmail)}
                helperText={errors.storeEmail}
                onChange={(e) => {
                  const { value } = e.target;
                  handleInputChange("storeEmail")({
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
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      {/* Footer */}
      <CustomPopFooterButton
        label={"Creater New Store"}
        onClose={onClose}
        onSubmit={handleCreateStore}
        loading={loading}
      />
    </Dialog>
  );
};

export default PopAddNewStore;
