import React from "react";
import { TextField } from "@mui/material";
import { COLORS } from "../../../../constants/color";

const CustomSearch = ({ searchTerm, handleSearchChange, placeholder }) => {
  return (
    <TextField
      size="small"
      variant="outlined"
      placeholder={placeholder}
      value={searchTerm}
      onChange={handleSearchChange}
      sx={{
        width: "100%",
        maxWidth: { xs: "100%", sm: "100%", md: "200px", lg: "500px" },
        mb: { xs: 0, sm: 0, md: 0 },
        "& .MuiInputBase-root": {
          fontSize: { xs: "0.875rem", sm: "1rem", md: "1rem" },
        },
      }}
    />
  );
};

export default CustomSearch;
