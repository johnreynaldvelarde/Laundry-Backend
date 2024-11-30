import React from "react";
import { Box, Typography } from "@mui/material";
import { COLORS } from "../../constants/color";

const CustomHeaderTitle = ({
  title,
  subtitle,
  titleFontSize = { xs: "18px", sm: "24px", md: "28px" }, // Default title font size
  subtitleFontSize = { xs: "12px", sm: "14px", md: "16px" }, // Default subtitle font size
  subtitleColor = COLORS.primary,
  textAlign = { xs: "center", sm: "left" }, // Default text alignment
  titleMarginBottom = { xs: "8px", sm: "0" }, // Default margin for title
  subtitleMarginBottom = { xs: "16px", sm: "0" }, // Default margin for subtitle
}) => {
  return (
    <Box sx={{ textAlign: textAlign }}>
      <Typography
        variant="h6"
        sx={{
          color: COLORS.secondary,
          fontSize: titleFontSize,
          fontWeight: 600,
          marginBottom: titleMarginBottom,
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{
          color: subtitleColor,
          fontSize: subtitleFontSize,
          fontWeight: 500,
          marginBottom: subtitleMarginBottom,
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
};

export default CustomHeaderTitle;
