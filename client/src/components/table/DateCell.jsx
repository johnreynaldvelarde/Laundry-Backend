import { Box, TableCell, Typography } from "@mui/material";
import { COLORS } from "../../constants/color";

const DateCell = ({ dateCreated }) => {
  // Assuming dateCreated is a string like "February 16, 2000 12:00 PM"
  const date = new Date(dateCreated);
  const options = { month: "long", day: "numeric", year: "numeric" };
  const formattedDate = date.toLocaleDateString(undefined, options);
  const formattedTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Box display="flex" flexDirection="column" alignItems="flex-start">
      <Typography
        variant="body2"
        sx={{ fontWeight: "600", color: COLORS.text }}
      >
        {formattedDate}
      </Typography>
      <Typography
        variant="body2"
        sx={{ fontWeight: "500", color: COLORS.text4 }}
      >
        {formattedTime}
      </Typography>
    </Box>
  );
};

export default DateCell;
