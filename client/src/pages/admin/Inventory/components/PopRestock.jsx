import React, { useState } from "react";
import useAuth from "../../../../contexts/AuthContext";
import { Dialog, DialogContent, TextField } from "@mui/material";
import toast from "react-hot-toast";
import { COLORS } from "../../../../constants/color";
import {
  createItemCategory,
  createNewRoleAndPermissions,
} from "../../../../services/api/postApi";
import CustomPopHeaderTitle from "../../../../components/common/CustomPopHeaderTitle";
import CustomPopFooterButton from "../../../../components/common/CustomPopFooterButton";
import { updateStock } from "../../../../services/api/putApi";

const PopRestock = ({ open, onClose, id, refreshData }) => {
  const { userDetails } = useAuth();
  const [stock, setStock] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    const newErrors = {};
    if (!stock) {
      newErrors.stock = "Stock is required";
    } else if (isNaN(stock)) {
      newErrors.stock = "Stock must be a number";
    } else if (parseFloat(stock) < 0) {
      newErrors.stock = "Stock cannot be negative";
    }
    return newErrors;
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;

    if (field === "stock") {
      setStock(value);
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };

  const handleUpdateStock = async () => {
    const newErrors = validateFields();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const response = await updateStock.putStock(id, {
          quantity: stock,
          activity_id: userDetails.userId,
          activity_username: userDetails.username,
          activity_roleName: userDetails.roleName,
        });
        if (response.success) {
          toast.success(response.message);
          refreshData();
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
        title={"Restock Selected Item"}
        subtitle={"Confirm the quantity for the selected item"}
        onClose={onClose}
      />
      <DialogContent>
        <TextField
          margin="dense"
          label="Stock"
          type="number"
          fullWidth
          variant="outlined"
          value={stock}
          onChange={handleInputChange("stock")}
          error={Boolean(errors.stock)}
          helperText={errors.stock}
        />
      </DialogContent>
      {/* Footer */}
      <CustomPopFooterButton
        label={"Update Stock"}
        onClose={onClose}
        onSubmit={handleUpdateStock}
        loading={loading}
      />
    </Dialog>
  );
};

export default PopRestock;
