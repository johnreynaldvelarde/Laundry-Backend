import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { COLORS } from "../../../constants/color";

// Function to format the data into a flat structure
const formatActivityData = (data) => {
  const formattedData = [];

  data.forEach((dayData, dayIndex) => {
    dayData.forEach((hourData, hourIndex) => {
      formattedData.push({
        day: dayIndex, // Day index: 0 (Sunday) to 6 (Saturday)
        hour: hourIndex, // Hour index: 0 to 23
        value: hourData, // Activity count for this hour
      });
    });
  });

  return formattedData;
};

// Function to convert hour to 12-hour format (AM/PM)
const formatHour = (hour) => {
  const ampm = hour >= 12 ? "PM" : "AM";
  const hourIn12HourFormat = hour % 12 === 0 ? 12 : hour % 12;
  return `${hourIn12HourFormat}:00 ${ampm}`;
};

const CustomActivityLogHeatmap = ({ activityLogData }) => {
  // Check if data is provided
  if (!activityLogData || activityLogData.length === 0) {
    return (
      <Box sx={{ textAlign: "center", p: 2 }}>
        <Typography>No activity log data available.</Typography>
      </Box>
    );
  }

  const formattedData = formatActivityData(activityLogData);

  return (
    <Box sx={{ width: "100%", borderRadius: "14px", overflow: "hidden" }}>
      <Paper
        sx={{
          borderRadius: "14px",
          boxShadow: "none",
          borderWidth: 1,
          borderColor: COLORS.border,
          padding: 2,
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            color: COLORS.primary,
            fontWeight: 600,
            textAlign: "center",
            mt: 2,
          }}
        >
          Activity Log Heatmap
        </Typography>
        <Box sx={{ height: { xs: "300px", sm: "400px" }, p: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData}>
              <XAxis
                dataKey="hour"
                name="Hour of Day"
                tickFormatter={(tick) => formatHour(tick)} // Format hour to 12-hour format
              />
              <YAxis
                dataKey="value"
                name="Activity Value"
                tickFormatter={(tick) => tick} // Show the value itself on the Y-axis
              />
              <Tooltip />
              <Bar dataKey="value" barSize={30}>
                {formattedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.value > 10
                        ? COLORS.primary // For higher activity, more intense color
                        : entry.value > 0
                        ? COLORS.secondary
                        : COLORS.border // For no activity, use lighter color
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
};

export default CustomActivityLogHeatmap;
