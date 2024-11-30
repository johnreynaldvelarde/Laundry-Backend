import React from "react";
import { Typography } from "@mui/material";
import { COLORS } from "../../constants/color"; // Adjust the import based on your file structure

const CustomHeaderTitleTable = ({ title }) => {
  return (
    <Typography
      variant="h6"
      sx={{ marginRight: 2, color: COLORS.text, fontWeight: 600 }}
    >
      {title}
    </Typography>
  );
};

export default CustomHeaderTitleTable;
