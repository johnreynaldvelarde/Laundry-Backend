import React from "react";
import { Box, Typography } from "@mui/material";
import { COLORS } from "../../../../constants/color";

const CustomStock = ({ quantity, lowStockThreshold }) => {
  // Calculate stock percentage; if out of stock, set to 0
  const inStockPercent =
    quantity > 0 ? Math.min((quantity / lowStockThreshold) * 100, 100) : 0;
  const isLowStock = quantity < lowStockThreshold && quantity > 0;
  const isOutOfStock = quantity === 0;

  return (
    <Box display="flex" flexDirection="column" alignItems="start">
      {/* Progress Bar */}
      <Box
        sx={{
          width: "100%",
          height: "8px",
          backgroundColor: COLORS.border,
          borderRadius: "4px",
          overflow: "hidden",
          marginTop: 1,
        }}
      >
        <Box
          sx={{
            width: `${inStockPercent}%`,
            height: "100%",
            backgroundColor: isOutOfStock
              ? COLORS.grayMedium
              : isLowStock
              ? COLORS.error
              : COLORS.success,
          }}
        />
      </Box>

      {/* Text Indicator */}
      <Typography
        variant="body2"
        sx={{ fontWeight: 500, color: COLORS.subtitle }}
      >
        {isOutOfStock
          ? "out of stock"
          : `${quantity} ${isLowStock ? "low stock" : "in stock"}`}
      </Typography>
    </Box>
  );
};

export default CustomStock;
