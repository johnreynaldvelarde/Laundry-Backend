import { Box } from "@mui/material";
import React from "react";
import { COLORS } from "../../constants/color";

const PermissionBox = ({ label }) => {
  return (
    <Box
      sx={{
        border: `1px solid  ${COLORS.border2} `,
        padding: "5px 8px",
        borderRadius: "6px",
        fontSize: "14px",
        color: COLORS.text4,
      }}
    >
      {label}
    </Box>
  );
};

export default PermissionBox;
