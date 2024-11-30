import React from "react";
import { FormControl, Select, MenuItem } from "@mui/material";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { COLORS } from "../../../../constants/color";

const CustomFilterCustomerType = ({
  statusOptions = ["Online", "Walk-In"], // Default options if none are provided
  selectedStatus,
  handleStatusChange,
}) => {
  return (
    <FormControl sx={{ minWidth: 200 }} size="small" fullWidth>
      <Select
        value={selectedStatus}
        onChange={handleStatusChange}
        displayEmpty
        IconComponent={KeyboardArrowDown}
        renderValue={(selected) => {
          if (!selected) {
            return (
              <span style={{ color: COLORS.primary }}>
                Select customer type
              </span>
            );
          }
          return selected;
        }}
        sx={{
          borderRadius: 2,
          color: COLORS.primary,
          "& .MuiSvgIcon-root": {
            color: COLORS.primary,
          },
        }}
      >
        {/* Render Status Options */}
        {statusOptions.map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomFilterCustomerType;
