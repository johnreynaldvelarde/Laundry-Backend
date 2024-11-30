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
  Grid,
  Menu,
  MenuItem,
} from "@mui/material";

import toast from "react-hot-toast";
import { COLORS } from "../../../../constants/color";
import { createNewItem } from "../../../../services/api/postApi";
import CustomPopHeaderTitle from "../../../../components/common/CustomPopHeaderTitle";
import CustomPopFooterButton from "../../../../components/common/CustomPopFooterButton";

const PopAddNewItem = ({ open, onClose, data, refreshData }) => {
  const { userDetails } = useAuth();
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateFields = () => {
    const newErrors = {};
    if (!itemName) {
      newErrors.itemName = "Item name is required";
    } else if (itemName.length < 3) {
      newErrors.itemName = "Item name must be at least 3 characters long";
    }

    if (!itemPrice) {
      newErrors.itemPrice = "Price is required";
    } else if (isNaN(itemPrice)) {
      newErrors.itemPrice = "Price must be a number";
    } else if (parseFloat(itemPrice) < 0) {
      newErrors.itemPrice = "Price cannot be negative";
    }
    if (!selectedCategory) {
      newErrors.selectedCategory = "Category is required";
    }

    return newErrors;
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;

    if (field === "itemName") {
      setItemName(value);
    } else if (field === "itemPrice") {
      setItemPrice(value);
    } else if (field === "selectedCategory") {
      setSelectedCategory(value);
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };

  const handleCreateNewItem = async () => {
    const newErrors = validateFields();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);

      const data = {
        store_id: userDetails.storeId,
        category_id: selectedCategory,
        item_name: itemName,
        price: itemPrice,
        activity_id: userDetails.userId,
        activity_username: userDetails.username,
        activity_roleName: userDetails.roleName,
      };

      try {
        const response = await createNewItem.setNewItem(data);

        if (response.success) {
          refreshData();
          toast.success(response.message);
          onClose();
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            itemName: response.message,
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
        title={"Add New Item"}
        subtitle={"Provide the details for the new item"}
        onClose={onClose}
      />
      <DialogContent>
        {/* Item Name */}
        <TextField
          margin="dense"
          label="Item Name"
          type="text"
          fullWidth
          variant="outlined"
          value={itemName}
          onChange={handleInputChange("itemName")}
          error={Boolean(errors.itemName)}
          helperText={errors.itemName}
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
        {/* Item Price */}
        <TextField
          margin="dense"
          label="Price"
          type="number"
          fullWidth
          variant="outlined"
          value={itemPrice}
          onChange={handleInputChange("itemPrice")}
          error={Boolean(errors.itemPrice)}
          helperText={errors.itemPrice}
        />
        {/* Select Category */}
        <TextField
          select
          margin="dense"
          label="Category"
          fullWidth
          variant="outlined"
          value={selectedCategory}
          onChange={handleInputChange("selectedCategory")}
          error={Boolean(errors.selectedCategory)}
          helperText={errors.selectedCategory}
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
        >
          {/* Add your role options here */}
          <MenuItem value="" disabled>
            Select a category
          </MenuItem>
          {data.map((category) => (
            <MenuItem key={category.category_id} value={category.category_id}>
              {category.category_name}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      {/* Footer */}
      <CustomPopFooterButton
        label={"Create Item"}
        onClose={onClose}
        onSubmit={handleCreateNewItem}
        loading={loading}
      />
    </Dialog>
  );
};

export default PopAddNewItem;
