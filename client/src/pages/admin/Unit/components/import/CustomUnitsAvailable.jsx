// CustomUnitsAvailable.js

import React from "react";
import { Box, Paper, Typography, Skeleton } from "@mui/material";
import { COLORS } from "../../../../../constants/color";
import { WashingMachine } from "@phosphor-icons/react";

const CustomUnitsAvailable = ({ unitsData, loading }) => {
  return (
    <Box
      className="hori-scrollable"
      sx={{ mt: 2, display: "flex", overflowX: "auto", gap: 2 }}
    >
      {loading ? (
        // Render skeletons when loading
        [...Array(6)].map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            width={100}
            height={90}
            sx={{ borderRadius: "8px" }}
          />
        ))
      ) : unitsData && unitsData.length > 0 ? (
        unitsData.map((unit) => (
          <Paper
            key={unit.id}
            sx={{
              boxShadow: "none !important",
              flexShrink: 0,
              p: 1,
              borderRadius: "8px",
              minWidth: "100px",
              textAlign: "center",
              borderWidth: 1,
              backgroundColor:
                unit.isUnitStatus === 0
                  ? COLORS.pale_sucess
                  : COLORS.pale_error,
              borderColor:
                unit.isUnitStatus === 0 ? COLORS.success : COLORS.error,
              color: unit.isUnitStatus === 0 ? COLORS.success : COLORS.error,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
              <WashingMachine
                size={44}
                color={unit.isUnitStatus === 0 ? COLORS.success : COLORS.error}
                weight="duotone"
              />
            </Box>

            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {unit.unit_name || "Unnamed Unit"}
            </Typography>
          </Paper>
        ))
      ) : (
        <Typography variant="body2" sx={{ color: "gray" }}>
          No units available
        </Typography>
      )}
    </Box>
  );
};

export default CustomUnitsAvailable;
