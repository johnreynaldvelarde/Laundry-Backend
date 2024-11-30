import React from "react";
import { Box, Typography, Rating } from "@mui/material";
import { COLORS } from "../../constants/color";

const CustomStarRating = ({ rating }) => {
  // Ensure the rating is a number
  const numericRating = parseFloat(rating);

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Rating
        name="half-rating-read"
        value={numericRating}
        precision={0.5} // Allows half stars
        readOnly // Make it read-only if you don't want users to change the rating
        size="large" // You can change the size to "small", "medium", or "large"
      />
      <Typography fontWeight="bold" sx={{ color: COLORS.text, marginLeft: 1 }}>
        {numericRating}
      </Typography>
    </Box>
  );
};

export default CustomStarRating;
