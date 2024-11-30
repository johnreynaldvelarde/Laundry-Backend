import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import Chart from "react-apexcharts";
import { COLORS } from "../../../constants/color";

const CustomerPieChart = ({ data }) => {
  const chartData = {
    series: data.map((item) => item.value),
    options: {
      chart: {
        type: "pie",
      },
      labels: data.map((item) => item.name),
      colors: [COLORS.success, COLORS.error],
      legend: {
        position: "bottom",
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: (val) => `${val}%`,
        },
      },
    },
  };

  return (
    <Paper
      sx={{
        borderRadius: "14px",
        boxShadow: "none",
        borderWidth: 1,
        borderColor: COLORS.border,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 2,
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
        Service Usage: Online vs. Walk-In
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: "300px",
          height: "300px",
          mt: 2,
        }}
      >
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="pie"
          width="100%"
          height="100%"
        />
      </Box>
    </Paper>
  );
};

export default CustomerPieChart;
