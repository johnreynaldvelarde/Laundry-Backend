import { Box } from "@mui/material";
import { COLORS } from "../../../../constants/color";

const StatusTransactionCellTable = ({ status }) => {
  // Define colors based on status
  let color, dotColor;

  switch (status) {
    case "Completed":
      color = COLORS.success;
      dotColor = COLORS.success;
      break;
    case "Pending":
      color = COLORS.error;
      dotColor = COLORS.error;
      break;
    default:
      color = "black";
      dotColor = "black"; // Default dot color for unknown statuses
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

export default StatusTransactionCellTable;
