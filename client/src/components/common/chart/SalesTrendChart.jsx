import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import Chart from "react-apexcharts";
import { COLORS } from "../../../constants/color";

const SalesTrendChart = ({ salesByMonthData }) => {
  // Prepare data for ApexCharts
  const months = salesByMonthData.map((item) => item.month);
  const sales = salesByMonthData.map((item) => item.sales);

  const options = {
    chart: {
      type: "bar", // Change to "bar" for a bar chart
      height: 300,
      background: "transparent",
      toolbar: {
        show: false, // Hide the toolbar
      },
    },
    plotOptions: {
      bar: {
        horizontal: false, // Set to true for horizontal bars
        columnWidth: "55%", // Adjust width of bars
        endingShape: "rounded", // Make bar edges rounded
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: [COLORS.secondary], // Color for bar stroke
    },
    xaxis: {
      categories: months,
      labels: {
        style: {
          colors: COLORS.primary,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: COLORS.primary,
        },
      },
    },
    tooltip: {
      style: {
        background: COLORS.background, // Customize tooltip background
        color: COLORS.secondary, // Customize tooltip label color
      },
    },
    legend: {
      labels: {
        colors: COLORS.text,
      },
    },
    fill: {
      colors: [COLORS.secondary], // Set the fill color for the bars
    },
    dataLabels: {
      enabled: true, // Enable data labels for bar chart
    },
  };

  const series = [
    {
      name: "Sales",
      data: sales,
    },
  ];

  return (
    <Paper
      sx={{
        borderRadius: "14px",
        boxShadow: "none",
        borderWidth: 1,
        borderColor: COLORS.border,
        height: "100%",
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{ color: COLORS.primary, fontWeight: 600, px: 3, pt: 3 }}
      >
        Laundry Revenue Growth by Month
      </Typography>
      <Box sx={{ height: "300px", p: 1 }}>
        <Chart options={options} series={series} type="bar" height="100%" />
      </Box>
    </Paper>
  );
};

export default SalesTrendChart;
