import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { COLORS } from "../../../constants/color";

// Function to aggregate customer growth data by month
const aggregateCustomerGrowthByMonth = (data) => {
  const monthlyData = {};

  data.forEach((item) => {
    const month = item.date.slice(0, 7); // Extract YYYY-MM from date
    if (!monthlyData[month]) {
      monthlyData[month] = 0; // Initialize if it doesn't exist
    }
    monthlyData[month] += item.count; // Sum counts for the month
  });

  return monthlyData;
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CustomerGrowthChart = ({ customerGrowthData }) => {
  // Check if data is provided
  if (!customerGrowthData || customerGrowthData.length === 0) {
    return (
      <Box sx={{ textAlign: "center", p: 2 }}>
        <Typography>No customer growth data available.</Typography>
      </Box>
    );
  }

  // Aggregate the data by month
  const monthlyCustomerGrowthData =
    aggregateCustomerGrowthByMonth(customerGrowthData);

  // Prepare data for the chart
  const chartData = Object.keys(monthlyCustomerGrowthData).map((month) => {
    const [year, monthNumber] = month.split("-");
    return {
      name: `${monthNames[parseInt(monthNumber) - 1]} ${year}`,
      count: monthlyCustomerGrowthData[month],
    };
  });

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: "14px",
        overflow: "hidden",
      }}
    >
      <Paper
        sx={{
          borderRadius: "14px",
          boxShadow: "none",
          borderWidth: 1,
          borderColor: COLORS.border,
          height: "100%",
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
          Customer Growth Over Time
        </Typography>
        <Box sx={{ height: { xs: "250px", sm: "320px" }, p: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="count"
                stroke={COLORS.secondary}
                fill={COLORS.secondary}
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
};

export default CustomerGrowthChart;

// import React from "react";
// import Chart from "react-apexcharts";
// import { Box, Paper, Typography } from "@mui/material";
// import { COLORS } from "../../../constants/color";

// // Function to aggregate customer growth data by month
// const aggregateCustomerGrowthByMonth = (data) => {
//   const monthlyData = {};

//   data.forEach((item) => {
//     const month = item.date.slice(0, 7); // Extract YYYY-MM from date
//     if (!monthlyData[month]) {
//       monthlyData[month] = 0; // Initialize if it doesn't exist
//     }
//     monthlyData[month] += item.count; // Sum counts for the month
//   });

//   return monthlyData;
// };

// const monthNames = [
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "November",
//   "December",
// ];

// const CustomerGrowthChart = ({ customerGrowthData }) => {
//   // Aggregate the data by month
//   const monthlyCustomerGrowthData =
//     aggregateCustomerGrowthByMonth(customerGrowthData);

//   // Prepare x-axis labels and data for the chart
//   const categories = Object.keys(monthlyCustomerGrowthData).map((month) => {
//     const [year, monthNumber] = month.split("-");
//     return `${monthNames[parseInt(monthNumber) - 1]} ${year}`; // Convert to "Month Year"
//   });

//   const data = Object.values(monthlyCustomerGrowthData); // Use counts directly

//   const chartData = {
//     options: {
//       chart: {
//         type: "area", // Set chart type to area
//         zoom: { enabled: false },
//         toolbar: { show: false },
//       },
//       xaxis: {
//         categories,
//       },
//       yaxis: {
//         title: false,
//       },
//       stroke: {
//         curve: "smooth",
//       },
//       colors: [COLORS.secondary],
//       fill: {
//         colors: [COLORS.secondary],
//         opacity: 0.3,
//       },
//     },
//     series: [
//       {
//         name: "New Customers",
//         data,
//       },
//     ],
//   };

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         borderRadius: "14px",
//         overflow: "hidden",
//       }}
//     >
//       <Paper
//         sx={{
//           borderRadius: "14px",
//           boxShadow: "none",
//           borderWidth: 1,
//           borderColor: COLORS.border,
//           height: "100%",
//           padding: 2,
//         }}
//       >
//         <Typography
//           variant="h5"
//           gutterBottom
//           sx={{
//             color: COLORS.primary,
//             fontWeight: 600,
//             textAlign: "center",
//             mt: 2,
//           }}
//         >
//           Customer Growth Over Time
//         </Typography>
//         <Box sx={{ height: { xs: "250px", sm: "320px" }, p: 1 }}>
//           <Chart
//             options={chartData.options}
//             series={chartData.series}
//             type="area"
//             height="100%"
//             width="100%"
//           />
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

// export default CustomerGrowthChart;
