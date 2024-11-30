import React, { useEffect, useState } from "react";
import useAuth from "../../../../contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  TextField,
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import toast from "react-hot-toast";
import { COLORS } from "../../../../constants/color";
import { createNewServicesPromo } from "../../../../services/api/postApi";
import CustomPopHeaderTitle from "../../../../components/common/CustomPopHeaderTitle";
import CustomPopFooterButton from "../../../../components/common/CustomPopFooterButton";
import { updateServicePromo } from "../../../../services/api/putApi";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const PopEditPromo = ({ open, onClose, editData, refreshData }) => {
  const { userDetails } = useAuth();
  const [serviceName, setServiceName] = useState("");
  const [defaultPrice, setDefaultPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [validDays, setValidDays] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setServiceName(editData.service_name || "");
      setDefaultPrice(editData.default_price);
      setDiscountPrice(editData.discount_price);
      setValidDays(editData.valid_days);
      setStartDate(editData.start_date ? new Date(editData.start_date) : null);
      setEndDate(editData.end_date ? new Date(editData.end_date) : null);
    } else {
      setServiceName("");
    }
  }, [editData]);

  const validateFields = () => {
    const newErrors = {};
    if (!serviceName) {
      newErrors.serviceName = "Service name is required";
    }
    if (!defaultPrice) {
      newErrors.defaultPrice = "Price is required";
    } else if (defaultPrice <= 0) {
      newErrors.defaultPrice = "Price must be greater than 0";
    }
    if (!discountPrice || discountPrice <= 0) {
      newErrors.discountPrice = "Discount price must be greater than 0";
    }
    if (!validDays || validDays.length === 0) {
      newErrors.validDays = "Please select at least one valid day";
    }
    if (!startDate) {
      newErrors.startDate = "Start date is required";
    }
    if (!endDate) {
      newErrors.endDate = "End date is required";
    } else if (endDate < startDate) {
      newErrors.endDate = "End date must be after start date";
    }
    return newErrors;
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    if (field === "serviceName") {
      setServiceName(value);
    } else if (field === "defaultPrice") {
      setDefaultPrice(value);
    } else if (field === "discountPrice") {
      setDiscountPrice(value);
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };

  const handleDayChange = (day) => () => {
    setValidDays((prevDays) => {
      // Ensure prevDays is an array
      const currentDays = Array.isArray(prevDays) ? prevDays : [];
      return currentDays.includes(day)
        ? currentDays.filter((d) => d !== day)
        : [...currentDays, day];
    });
  };

  const handleUpdatePromo = async () => {
    const newErrors = validateFields();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const servicesData = {
        discount_price: discountPrice,
        valid_days: validDays,
        start_date: startDate,
        end_date: endDate,
      };

      try {
        const response = await updateServicePromo.putPromo(
          editData.promo_id,
          servicesData
        );
        if (response.success) {
          toast.success(response.message);
          refreshData();
          onClose();
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
        <CustomPopHeaderTitle
          title={"Edit Service Promo"}
          subtitle={"Enter details to update the service promo"}
          onClose={onClose}
        />
        <DialogContent>
          <TextField
            margin="dense"
            label="Service Name"
            type="text"
            fullWidth
            variant="outlined"
            value={serviceName}
            onChange={handleInputChange("serviceName")}
            error={Boolean(errors.serviceName)}
            helperText={errors.serviceName}
            InputProps={{
              readOnly: true,
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

          {/* Default Price */}
          <TextField
            margin="dense"
            label="Default Price"
            type="number"
            fullWidth
            variant="outlined"
            value={defaultPrice}
            onChange={handleInputChange("defaultPrice")}
            error={Boolean(errors.defaultPrice)}
            helperText={errors.defaultPrice}
            InputProps={{
              readOnly: true,
            }}
          />

          <TextField
            margin="dense"
            label="Discount Price"
            type="number"
            fullWidth
            variant="outlined"
            value={discountPrice}
            onChange={handleInputChange("discountPrice")}
            error={Boolean(errors.discountPrice)}
            helperText={errors.discountPrice}
          />

          <Box sx={{ mt: 2 }}>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                sx={{ mb: 1, color: COLORS.primary, fontWeight: 600 }}
              >
                Valid Days
              </Typography>
              <Grid container spacing={1}>
                {DAYS_OF_WEEK.map((day) => (
                  <Grid item xs={6} key={day}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={validDays.includes(day)}
                          onChange={handleDayChange(day)}
                        />
                      }
                      label={day}
                    />
                  </Grid>
                ))}
              </Grid>
              {errors.validDays && (
                <Typography color="error" variant="caption">
                  {errors.validDays}
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                width: "100%",
              }}
            >
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(date) => setStartDate(date)}
                slots={{
                  textField: (params) => (
                    <TextField
                      {...params}
                      fullWidth
                      margin="dense"
                      variant="outlined"
                      error={Boolean(errors.startDate)}
                      helperText={errors.startDate}
                    />
                  ),
                }}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(date) => setEndDate(date)}
                slots={{
                  textField: (params) => (
                    <TextField
                      {...params}
                      fullWidth
                      margin="dense"
                      variant="outlined"
                      error={Boolean(errors.endDate)}
                      helperText={errors.endDate}
                    />
                  ),
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <CustomPopFooterButton
          label={"Update Promo"}
          loading={loading}
          onClose={onClose}
          onSubmit={handleUpdatePromo}
        />
      </Dialog>
    </LocalizationProvider>
  );
};

export default PopEditPromo;
