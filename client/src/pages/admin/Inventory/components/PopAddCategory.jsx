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

const PopAddCategory = ({ open, onClose, refreshData }) => {
  const { userDetails } = useAuth();
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    const newErrors = {};
    if (!categoryName) {
      newErrors.categoryName = "Category name is required";
    }

    return newErrors;
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;

    if (field === "categoryName") {
      setCategoryName(value);
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };

  const handleCreateCategory = async () => {
    const newErrors = validateFields();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const response = await createItemCategory.setCategoryItem({
          activity_id: userDetails.userId,
          activity_username: userDetails.username,
          activity_roleName: userDetails.roleName,
          category_name: categoryName,
        });
        if (response.success) {
          refreshData();
          toast.success(response.message);
          onClose();
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            categoryName: response.message,
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

  const handleDialogClose = () => {
    setRolename("");
    setSelectedPermissions([]);
    setErrors({});
    onClose();
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
        title={"Add New Category"}
        subtitle={"Provide the name for the new category"}
        onClose={onClose}
      />
      <DialogContent>
        {/* Category Name */}
        <TextField
          margin="dense"
          label="Category Name"
          type="text"
          fullWidth
          variant="outlined"
          value={categoryName}
          onChange={handleInputChange("categoryName")}
          error={Boolean(errors.categoryName)}
          helperText={errors.categoryName}
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
      </DialogContent>
      {/* Footer */}
      <CustomPopFooterButton
        label={"Create Category"}
        onClose={onClose}
        onSubmit={handleCreateCategory}
        loading={loading}
      />
    </Dialog>
  );
};

export default PopAddCategory;
