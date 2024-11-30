import React from "react";
import { Box, Typography } from "@mui/material";
import { COLORS } from "../../constants/color";

const CustomNoDataMessage = ({ imageSrc, message }) => {
  return (
    <Box
      elevation={0}
      sx={{
        border: `1px solid ${COLORS.border}`,
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: 5,
      }}
    >
      <img
        src={imageSrc}
        alt="No data available"
        style={{
          maxWidth: "200%",
          maxHeight: "200px",
        }}
      />
      <Typography variant="h7" sx={{ color: COLORS.subtitle }}>
        {message}
      </Typography>
    </Box>
  );
};

export default CustomNoDataMessage;
