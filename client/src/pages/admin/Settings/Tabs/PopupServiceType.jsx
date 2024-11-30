import React, { useState, useEffect } from "react";
import useAuth from "../../../../contexts/AuthContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";
import { createNewServiceType } from "../../../../services/api/postApi";
import { updateServiceType } from "../../../../services/api/putApi";
import CustomPopFooterButton from "../../../../components/common/CustomPopFooterButton";

const PopupServiceType = ({
  open,
  onClose,
  storeId,
  serviceData,
  onSuccess,
}) => {
  const { userDetails } = useAuth();
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [defaultPrice, setDefaultPrice] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (serviceData) {
      setServiceName(serviceData.service_name || "");
      setDefaultPrice(serviceData.default_price || "");
      setDescription(serviceData.description || "");
    } else {
      setServiceName("");
      setDefaultPrice("");
    }
  }, [serviceData]);

  const handleClear = async () => {
    setServiceName("");
    setDescription("");
    setDefaultPrice("");
    setErrors({});
    onClose();
  };

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
    return newErrors;
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;

    if (field === "serviceName") {
      setServiceName(value);
    } else if (field === "defaultPrice") {
      setDefaultPrice(value);
    } else if (field === "description") {
      setDescription(value);
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

      setTimeout(async () => {
        const data = {
          store_id: storeId || userDetails.storeId,
          service_name: serviceName,
          default_price: defaultPrice,
          description: description,
        };

        try {
          let response;
          if (serviceData) {
            response = await updateServiceType.putServiceType(
              serviceData.id,
              data
            );
          } else {
            response = await createNewServiceType.setServiceType(data);
          }

          if (response.success) {
            toast.success(response.message);
            handleClear();
            if (onSuccess) onSuccess(); // Call the onSuccess callback to refresh the data
          } else {
            setErrors((prevErrors) => ({
              ...prevErrors,
              serviceName: response.message,
            }));
          }
        } catch (error) {
          if (error.response && error.response.data) {
            toast.error(error.response.data.message);
          } else {
            toast.error(
              "An unexpected error occurred while creating the service type."
            );
          }
        } finally {
          setLoading(false);
        }
      }, 500);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClear}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 16,
        },
      }}
    >
      <DialogTitle className="flex flex-col">
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold">
              {serviceData ? "Edit Service" : "Add Service"}
            </span>
          </div>
          <IconButton
            onClick={handleClear}
            className="text-[#5787C8] hover:text-[#5787C8]"
          >
            <CloseIcon />
          </IconButton>
        </div>
        <Typography variant="body2" color="textSecondary" className="mt-1">
          Enter service details below.
        </Typography>
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Service Name"
          type="text"
          fullWidth
          variant="outlined"
          value={serviceName}
          onChange={handleInputChange("serviceName")}
          error={Boolean(errors.serviceName)}
          helperText={errors.serviceName}
          sx={{ mb: 2 }}
        />
        <TextField
          autoFocus
          margin="dense"
          label="Description (Optional)"
          type="text"
          fullWidth
          variant="outlined"
          value={description}
          onChange={handleInputChange("description")}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Price"
          type="number"
          fullWidth
          variant="outlined"
          value={defaultPrice}
          onChange={handleInputChange("defaultPrice")}
          error={Boolean(errors.defaultPrice)}
          helperText={errors.defaultPrice}
        />
      </DialogContent>
      <CustomPopFooterButton
        label={"Save"}
        onClose={handleClear}
        onSubmit={handleSave}
        loading={loading}
      />
    </Dialog>
  );
};

export default PopupServiceType;
