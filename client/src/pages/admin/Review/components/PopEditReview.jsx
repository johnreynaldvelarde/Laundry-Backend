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

import CustomPopHeaderTitle from "../../../../components/common/CustomPopHeaderTitle";
import CustomPopFooterButton from "../../../../components/common/CustomPopFooterButton";
import {
  updateInventory,
  updateReviews,
} from "../../../../services/api/putApi";

const PopEditReview = ({ open, onClose, getData, refreshData }) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getData) {
      setSelectedStatus(getData.is_approved);
    } else {
      setSelectedStatus("");
    }
  }, [getData]);

  const validateFields = () => {
    const newErrors = {};
    if (selectedStatus === "" || selectedStatus === undefined) {
      newErrors.selectedStatus = "Status is required";
    }

    return newErrors;
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;

    if (field === "selectedStatus") {
      setSelectedStatus(value);
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };

  const handleUpdateReview = async () => {
    const newErrors = validateFields();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);

      const data = {
        is_approved: selectedStatus,
      };

      try {
        const response = await updateReviews.putReviews(
          getData.review_id,
          data
        );

        if (response.success) {
          toast.success(response.message);
          refreshData();
          onClose();
        } else {
          toast.error(response.message);
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
        title={"Update Review"}
        subtitle={"Provide status to update the review"}
        onClose={onClose}
      />
      <DialogContent>
        {/* Select a status */}
        <TextField
          select
          margin="dense"
          label="Status"
          fullWidth
          variant="outlined"
          value={selectedStatus}
          onChange={handleInputChange("selectedStatus")}
          error={Boolean(errors.selectedStatus)}
          helperText={errors.selectedStatus}
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
          <MenuItem value="" disabled>
            Select a status
          </MenuItem>
          <MenuItem value={0}>Rejected</MenuItem>
          <MenuItem value={1}>Approved</MenuItem>
        </TextField>
      </DialogContent>
      {/* Footer */}
      <CustomPopFooterButton
        label={"Update Review"}
        onClose={onClose}
        onSubmit={handleUpdateReview}
        loading={loading}
      />
    </Dialog>
  );
};

export default PopEditReview;
