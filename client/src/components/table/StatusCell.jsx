import { Box, TableCell } from "@mui/material";
import { COLORS } from "../../constants/color";

const StatusCell = ({ status }) => {
  // Define colors based on status
  let color, dotColor;

  switch (status) {
    case "Active":
      color = COLORS.success;
      dotColor = COLORS.success;
      break;
    case "Deactivated":
      color = COLORS.error;
      dotColor = COLORS.error;
      break;
    case "Pending":
      color = COLORS.grayMedium;
      dotColor = COLORS.grayMedium;
      break;
    default:
      color = "black";
      dotColor = "black"; // Default dot color
  }

  return (
    <Box display="flex" alignItems="center">
      <Box
        sx={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: dotColor,
          marginRight: 1,
        }}
      />
      <span style={{ color, fontWeight: 600 }}>{status}</span>
    </Box>
  );
};

export default StatusCell;
