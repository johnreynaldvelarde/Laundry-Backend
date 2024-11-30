import React from "react";
import { TextField, MenuItem } from "@mui/material";

const CustomFilter = () => {
  return (
    <div className="max-w-md mx-auto">
      <div className="mb-4">
        <TextField
          id="category"
          label="Category"
          select
          fullWidth
          variant="outlined"
          defaultValue=""
          className="bg-white shadow-sm"
        >
          <MenuItem value="">Select a Category</MenuItem>
          <MenuItem value="electronics">Electronics</MenuItem>
          <MenuItem value="clothing">Clothing</MenuItem>
          <MenuItem value="books">Books</MenuItem>
        </TextField>
      </div>
    </div>
  );
};

export default CustomFilter;
