import React from "react";
import { FormControl, Select, MenuItem } from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material"; // Make sure you have this icon imported
import { COLORS } from "../../../../constants/color";

const CustomCreatedDate = ({ selectedDate, handleDateChange, dateOptions }) => {
  return (
    <FormControl sx={{ minWidth: 200 }} size="small" fullWidth>
      <Select
        value={selectedDate}
        onChange={handleDateChange}
        displayEmpty
        IconComponent={KeyboardArrowDown}
        renderValue={(selected) => {
          if (!selected) {
            return <span style={{ color: COLORS.primary }}>Select a date</span>;
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
        {/* Creation date options */}
        {dateOptions.map((date) => (
          <MenuItem key={date} value={date}>
            {date}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomCreatedDate;
