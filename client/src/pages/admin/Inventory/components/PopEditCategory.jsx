import React, { useEffect, useState } from "react";
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
import { updateCategoryName } from "../../../../services/api/putApi";

const PopEditCategory = ({ open, onClose, data, refreshData }) => {
  const { userDetails } = useAuth();
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data) {
      setCategoryName(data.category_name);
    } else {
      setCategoryName("");
    }
  }, [data]);

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

  const handleUpdateCategory = async () => {
    const newErrors = validateFields();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const response = await updateCategoryName.putCategoryName(
          data.category_id,
          {
            category_name: categoryName,
            activity_id: userDetails.userId,
            activity_username: userDetails.username,
            activity_roleName: userDetails.roleName,
          }
        );
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
        title={"Edit Category"}
        subtitle={"Provide the name for the update category"}
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
        label={"Update Category"}
        onClose={onClose}
        onSubmit={handleUpdateCategory}
        loading={loading}
      />
    </Dialog>
  );
};

export default PopEditCategory;
