import React, { useState } from "react";
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

const PopAddNewUnits = ({ open, onClose, refreshData }) => {
  const {
    isUnitStatus,
    unitName,
    errors,
    handleInputChange,
    handleSubmit,
    loading,
  } = useAddUnit({ onClose, refreshData });

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
        title={"Add New Unit"}
        subtitle={"Provide the details for the new laundry unit"}
        onClose={onClose}
      />
      <DialogContent>
        {/* Unit Name */}
        <TextField
          margin="dense"
          label="Unit Name"
          variant="outlined"
          size="medium"
          fullWidth
          value={unitName}
          type="text"
          onChange={handleInputChange("unitName")}
          error={Boolean(errors.unitName)}
          helperText={errors.unitName}
          InputProps={{
            readOnly: true,
          }}
        />

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
        label={"Create Unit"}
        onClose={onClose}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </Dialog>
  );
};

export default PopAddNewUnits;
