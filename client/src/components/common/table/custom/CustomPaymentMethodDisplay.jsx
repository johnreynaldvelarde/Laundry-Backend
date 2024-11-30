import React from "react";
import { Box, Typography } from "@mui/material";
import { COLORS } from "../../../../constants/color";
import gcash from "../../../../assets/images/gcash.png";
import cash_on_delivery from "../../../../assets/images/cash-on-delivery.png";
import cash from "../../../../assets/images/money.png";

const CustomPaymentMethodDisplay = ({ paymentMethod }) => {
  let Icon;
  switch (paymentMethod) {
    case "Cash":
      Icon = (
        <img
          src={cash}
          alt="Cash"
          style={{
            width: 24,
            height: 20,
            marginRight: 8,
          }}
        />
      );
      break;
    case "GCash":
      Icon = (
        <img
          src={gcash}
          alt="GCash"
          style={{
            width: 24,
            height: 20,
            marginRight: 8,
          }}
        />
      );
      break;
    case "Cash on Delivery":
      Icon = (
        <img
          src={cash_on_delivery}
          alt="Cash on Delivery"
          style={{
            width: 24,
            height: 24,
            marginRight: 8,
          }}
        />
      );
      break;
    default:
      Icon = null;
  }

  return (
    <Box
      sx={{
        border: `1px solid ${COLORS.border}`,
        borderRadius: "8px",
        padding: { xs: "8px", sm: "10px" }, // Responsive padding
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: { xs: "column", sm: "row" }, // Stack on small screens
      }}
    >
      {Icon}
      <Typography
        variant="body2"
        sx={{
          fontWeight: "500",
          color: COLORS.subtitle,
          textAlign: "center",
          fontSize: { xs: "12px", sm: "14px" }, // Responsive font size
        }} // Center the text
      >
        {paymentMethod}
      </Typography>
    </Box>
  );
};

export default CustomPaymentMethodDisplay;
