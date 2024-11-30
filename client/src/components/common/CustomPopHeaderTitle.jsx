// DialogHeader.jsx
import React from "react";
import { DialogTitle, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { COLORS } from "../../constants/color";

const CustomPopHeaderTitle = ({ title, subtitle, onClose }) => {
  return (
    <DialogTitle className="flex flex-col">
      <div className="flex justify-between items-center mt-2">
        <div className="flex flex-col">
          <span
            className="text-lg font-semibold"
            style={{ color: COLORS.text }}
          >
            {title}
          </span>
          {subtitle && (
            <Typography
              variant="body2"
              color="textSecondary"
              className="mt-1"
              sx={{ color: COLORS.primary }}
            >
              {subtitle}
            </Typography>
          )}
        </div>
        <IconButton
          onClick={onClose}
          className="text-[#5787C8] hover:text-[#5787C8]"
        >
          <CloseIcon />
        </IconButton>
      </div>
    </DialogTitle>
  );
};

export default CustomPopHeaderTitle;
