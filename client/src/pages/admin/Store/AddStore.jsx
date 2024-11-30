import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import React from "react";
import useAddBranch from "../../../hooks/admin/useAddBranch";

const AddStore = () => {
  const {
    storeNo,
    storeName,
    contactNumber,
    location,
    errors,
    handleGenerateStoreNo,
    handleSubmit,
    handleInputChange,
    handleClear,
  } = useAddBranch();

  return (
    <Box sx={{ pt: "80px", pb: "20px" }}>
      <Typography variant="h6" sx={{ marginBottom: "14px" }}>
        Add new store
      </Typography>
      <Paper
        sx={{
          boxShadow: "none !important",
          borderRadius: "12px",
          borderStyle: "solid",
          borderWidth: "1px",
          borderColor: "divider",
          p: "20px",
          maxWidth: "800px",
          margin: "0 auto",
          cursor: "pointer",
          overflow: "hidden",
        }}
      >
        <Box sx={{ my: 2 }}>
          <TextField
            label="Store Name"
            variant="outlined"
            size="medium"
            fullWidth
            value={storeName}
            onChange={handleInputChange("storeName")}
            error={Boolean(errors.storeName)}
            helperText={errors.storeName}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-error": {
                  borderColor: "red",
                },
              },
            }}
          />
        </Box>
        <Box sx={{ my: 4 }}>
          <TextField
            label="Store No"
            variant="outlined"
            size="medium"
            fullWidth
            value={storeNo}
            onChange={handleInputChange("storeNo")}
            error={Boolean(errors.storeNo)}
            helperText={errors.storeNo}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    variant="text"
                    onClick={handleGenerateStoreNo}
                    sx={{ textTransform: "none" }}
                  >
                    Generate
                  </Button>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-error": {
                  borderColor: "red",
                },
              },
            }}
          />
        </Box>
        <Box sx={{ my: 4 }}>
          <TextField
            label="Store Contact Number"
            variant="outlined"
            size="medium"
            fullWidth
            value={contactNumber}
            onChange={handleInputChange("contactNumber")}
            error={Boolean(errors.contactNumber)}
            helperText={errors.contactNumber}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-error": {
                  borderColor: "red",
                },
              },
            }}
          />
        </Box>
        <Box sx={{ mt: 4 }}>
          <TextField
            label="Location"
            variant="outlined"
            rows={4}
            fullWidth
            multiline
            value={location}
            onChange={handleInputChange("location")}
            error={Boolean(errors.location)}
            helperText={errors.location}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-error": {
                  borderColor: "red",
                },
              },
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: "30px",
          }}
        >
          <Button
            variant="contained"
            sx={{ borderRadius: "20px", marginRight: 2 }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
          <Button
            variant="outlined"
            sx={{ borderRadius: "20px" }}
            onClick={handleClear}
          >
            Clear
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddStore;
