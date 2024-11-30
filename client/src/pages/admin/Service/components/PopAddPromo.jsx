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
import {
  createNewServicesPromo,
  createNewServiceType,
} from "../../../../services/api/postApi";
import CustomPopHeaderTitle from "../../../../components/common/CustomPopHeaderTitle";
import CustomPopFooterButton from "../../../../components/common/CustomPopFooterButton";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const PopAddPromo = ({ open, onClose, addData, refreshData }) => {
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
    if (addData) {
      setServiceName(addData.service_name || "");
      setDefaultPrice(addData.default_price);
    } else {
      setServiceName("");
    }
  }, [addData]);

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
    setValidDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );
  };

  const handleActivePromo = async () => {
    const newErrors = validateFields();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // setLoading(true);

      const servicesData = {
        service_id: addData.id,
        discount_price: discountPrice,
        valid_days: validDays,
        start_date: startDate,
        end_date: endDate,
      };

      console.log(servicesData);

      try {
        const response = await createNewServicesPromo.setServicesPromo(
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
          title={"Create Service Promotion"}
          subtitle={"Enter details for the new service promotion"}
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
                    />
                  ),
                }}
              />
            </Box>
          </Box>
        </DialogContent>

        <CustomPopFooterButton
          label={"Activate Promo"}
          onClose={onClose}
          onSubmit={handleActivePromo}
          loading={loading}
        />
      </Dialog>
    </LocalizationProvider>
  );
};

export default PopAddPromo;
