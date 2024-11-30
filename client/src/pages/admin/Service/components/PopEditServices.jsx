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
  Grid,
  Menu,
  MenuItem,
} from "@mui/material";

import toast from "react-hot-toast";
import { COLORS } from "../../../../constants/color";
import {
  createNewItem,
  createNewRoleAndPermissions,
  createNewServiceType,
} from "../../../../services/api/postApi";
import CustomPopHeaderTitle from "../../../../components/common/CustomPopHeaderTitle";
import CustomPopFooterButton from "../../../../components/common/CustomPopFooterButton";
import { updateServiceType } from "../../../../services/api/putApi";

const PopEditServices = ({ open, onClose, editData, refreshData }) => {
  const { userDetails } = useAuth();
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [defaultPrice, setDefaultPrice] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setServiceName(editData.service_name || "");
      setDefaultPrice(editData.default_price || "");
      setDescription(editData.description || "");
    } else {
      setServiceName("");
      setDefaultPrice("");
      setDescription("");
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

  const handleUpdateServices = async () => {
    const newErrors = validateFields();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);

      const servicesData = {
        store_id: userDetails.storeId,
        service_name: serviceName,
        default_price: defaultPrice,
        description: description,
      };

      try {
        const response = await updateServiceType.putServiceType(
          editData.id,
          servicesData
        );

        if (response.success) {
          toast.success(response.message);
          refreshData();
          onClose();
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            serviceName: response.message,
          }));
        }
      } catch (error) {
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
      <CustomPopHeaderTitle
        title={"Edit Service"}
        subtitle={"Provide the details for updating the services"}
        onClose={onClose}
      />
      <DialogContent>
        {/* Serivce Name */}
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

        {/* Descritption */}
        <TextField
          margin="dense"
          label="Description (Optional)"
          type="text"
          fullWidth
          variant="outlined"
          value={description}
          onChange={handleInputChange("description")}
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
      {/* Footer */}
      <CustomPopFooterButton
        label={"Update Service"}
        onClose={onClose}
        onSubmit={handleUpdateServices}
        loading={loading}
      />
    </Dialog>
  );
};

export default PopEditServices;
