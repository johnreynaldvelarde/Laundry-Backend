import React from "react";
import { COLORS } from "../../constants/color";
import { Typography } from "@mui/material";

const DateTime = ({ dateCreated }) => {
  const date = new Date(dateCreated);
  const timeString = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <Typography
      variant="body2"
      sx={{ fontWeight: "500", color: COLORS.secondary }}
    >
      {timeString}
    </Typography>
  );
};

export default DateTime;
