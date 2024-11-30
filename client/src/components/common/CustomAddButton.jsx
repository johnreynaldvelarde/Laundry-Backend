import React from "react";
import { Button } from "@mui/material";
import { COLORS } from "../../constants/color";

const CustomAddButton = ({
  label,
  onClick,
  icon,
  backgroundColor = COLORS.secondary, // Default color
  hoverColor = COLORS.secondaryHover, // Default hover color
  width = { xs: "100%", sm: "auto" }, // Default width
  marginTop = { xs: 2, sm: 0 }, // Default margin top
  disabled,
}) => {
  return (
    <Button
      onClick={disabled ? null : onClick} // Prevent onClick if disabled
      variant="contained"
      startIcon={icon}
      disabled={disabled} // Set the disabled state on the Button
      sx={{
        backgroundColor: disabled ? COLORS.gray : backgroundColor, // Change color if disabled
        borderRadius: "5px",
        fontWeight: 500,
        textTransform: "none",
        paddingX: { xs: 1, sm: 2, md: 3 },
        fontSize: { xs: "14px", sm: "14px", md: "16px" },
        height: "45px", // Set a fixed height
        lineHeight: "1.5", // Ensure consistent line height
        whiteSpace: "nowrap", // Prevent text from wrapping
        display: "flex", // Ensure flex display
        alignItems: "center", // Center icon and text vertically
        "&:hover": {
          backgroundColor: disabled ? COLORS.gray : hoverColor, // Prevent hover effect if disabled
        },
        width: width,
        mt: marginTop,
      }}
    >
      {label}
    </Button>
  );
};

export default CustomAddButton;
