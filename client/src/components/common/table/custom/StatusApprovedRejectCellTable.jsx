import { Box } from "@mui/material";
import { COLORS } from "../../../../constants/color";

const StatusApprovedRejectCellTable = ({ status }) => {
  // Determine the textual status based on numeric value
  const displayStatus = status === 1 ? "Approved" : "Rejected";

  // Define colors based on status
  let color, dotColor;

  switch (displayStatus) {
    case "Approved":
      color = COLORS.success;
      dotColor = COLORS.success;
      break;
    case "Rejected":
      color = COLORS.error;
      dotColor = COLORS.error;
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
      <span style={{ color, fontWeight: 600 }}>{displayStatus}</span>
    </Box>
  );
};

export default StatusApprovedRejectCellTable;
