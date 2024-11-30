import React, { useEffect, useState } from "react";
import useAuth from "../../../../contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  TextField,
  Typography,
  IconButton,
  Grid,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
} from "@mui/material";

import toast from "react-hot-toast";
import CustomPopHeaderTitle from "../../../../components/common/CustomPopHeaderTitle";
import CustomPopFooterButton from "../../../../components/common/CustomPopFooterButton";
import useAddUnit from "../../../../hooks/admin/useAddUnit";
import { unitStatus } from "../../../../data/unit_status";
import { updateEditUnit } from "../../../../services/api/putApi";

const PopEditUnit = ({ open, onClose, refreshData, getData }) => {
  const {
    isUnitStatus,
    setUnitStatus,
    errors,
    handleInputChange,
    handleSubmit,
    loading,
  } = useAddUnit({ onClose, refreshData });

  const getStatusByValue = (value) => {
    const status = unitStatus.find((item) => item.value === value);
    return status ? status.status : "";
  };

  const STATUS_MAP = {
    Available: 0,
    Occupied: 1,
    "In Maintenance": 2,
  };

  useEffect(() => {
    if (getData) {
      const statusString = getStatusByValue(getData.isUnitStatus); // Convert value to string
      setUnitStatus(statusString);
    } else {
      setUnitStatus(""); // Default to an empty string
    }
  }, [getData]);

  const handleUpdateEdit = async (e) => {
    e.preventDefault();
    try {
      const numericStatus = STATUS_MAP[isUnitStatus];

      const response = await updateEditUnit.putUpdateUnit(getData.id, {
        isUnitStatus: numericStatus,
      });

      if (response.success) {
        refreshData();
        toast.success(response.message);
        refreshData();
        onClose();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error submitting the form", error);
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
        title={"Edit Unit"}
        subtitle={"Provide the details to edit laundry unit"}
        onClose={onClose}
      />
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <FormControl
            fullWidth
            size="medium"
            error={Boolean(errors.unitStatus)}
          >
            <InputLabel>Unit Status</InputLabel>
            <Select
              value={isUnitStatus}
              onChange={handleInputChange("unitStatus")}
              label="Unit Status"
            >
              {unitStatus.map(({ unit_id, status }) => (
                <MenuItem value={status} key={unit_id}>
                  {status}
                </MenuItem>
              ))}
            </Select>
            {errors.unitStatus && (
              <Typography
                variant="caption"
                sx={{ marginTop: "3px", marginLeft: "14px" }}
                color="error"
              >
                {errors.unitStatus}
              </Typography>
            )}
          </FormControl>
        </Box>
      </DialogContent>
      {/* Footer */}
      <CustomPopFooterButton
        label={"Update Unit"}
        onClose={onClose}
        onSubmit={handleUpdateEdit}
        loading={loading}
      />
    </Dialog>
  );
};

export default PopEditUnit;
