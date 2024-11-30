import { FormControl, Select, MenuItem } from "@mui/material";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { COLORS } from "../../../../constants/color";

const CustomRatingFilter = ({ selectedStatus, handleStatusChange }) => {
  return (
    <FormControl sx={{ minWidth: 200 }} size="small" fullWidth>
      <Select
        value={selectedStatus}
        onChange={handleStatusChange}
        displayEmpty
        IconComponent={KeyboardArrowDown}
        renderValue={(selected) => {
          if (selected === "") {
            return <span style={{ color: COLORS.primary }}>Select rating</span>;
          }
          return selected === 0 ? "0 Star" : selected; // Show "0 Star" when the value is 0
        }}
        sx={{
          borderRadius: 2,
          color: COLORS.primary,
          "& .MuiSvgIcon-root": {
            color: COLORS.primary,
          },
        }}
      >
        {/* Status options for rating filter */}
        <MenuItem value="">
          <em>All Ratings</em>
        </MenuItem>
        <MenuItem value={0}>0 Star</MenuItem>
        <MenuItem value={1}>1 Star</MenuItem>
        <MenuItem value={2}>2 Stars</MenuItem>
        <MenuItem value={3}>3 Stars</MenuItem>
        <MenuItem value={4}>4 Stars</MenuItem>
        <MenuItem value={5}>5 Stars</MenuItem>
      </Select>
    </FormControl>
  );
};

export default CustomRatingFilter;
