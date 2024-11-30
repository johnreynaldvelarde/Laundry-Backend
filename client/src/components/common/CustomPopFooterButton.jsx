import React from "react";
import { Button, DialogActions } from "@mui/material";
import { COLORS } from "../../constants/color";

const CustomPopFooterButton = ({ label, onClose, onSubmit, loading }) => {
  return (
    <DialogActions className="flex justify-end space-x-1 mb-1 mr-2">
      <Button
        variant="outlined"
        onClick={onClose}
        sx={{
          marginRight: 1,
          borderColor: COLORS.border2,
          borderRadius: "5px",
          fontWeight: 500,
          textTransform: "none",
          color: COLORS.text4,
          "&:hover": {
            borderColor: COLORS.border2,
            backgroundColor: COLORS.light,
          },
        }}
      >
        Cancel
      </Button>
      <Button
        onClick={onSubmit}
        variant="contained"
        disableElevation
        sx={{
          backgroundColor: "#5787C8",
          borderRadius: "5px",
          fontWeight: 500,
          minWidth: "90px",
          textTransform: "none",
          "&:hover": {
            backgroundColor: COLORS.secondaryHover,
          },
        }}
        disabled={loading}
      >
        {loading ? (
          <div
            className="w-6 h-6 border-2 border-t-transparent border-white rounded-full"
            style={{
              animation: "spin 1s linear infinite",
            }}
          ></div>
        ) : (
          label
        )}
      </Button>
    </DialogActions>
  );
};

export default CustomPopFooterButton;
