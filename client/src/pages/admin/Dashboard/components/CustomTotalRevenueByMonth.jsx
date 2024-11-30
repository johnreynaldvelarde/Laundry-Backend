import React, { useCallback, useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import useFetchData from "../../../../hooks/common/useFetchData";
import Chart from "react-apexcharts";
import { COLORS } from "../../../../constants/color";
import { getAdminRevenueGrowthByMonth } from "../../../../services/api/getApi";

const CustomTotalRevenueByMonth = () => {
  const [loading, setLoading] = useState(true);
  const { data: data, fetchData: fetchRevenueGrowthByMonth } = useFetchData();

  const fetchRevenueGrowthByMonthData = useCallback(async () => {
    setLoading(true);
    await fetchRevenueGrowthByMonth(
      getAdminRevenueGrowthByMonth.getRevenueMonth
    );
    setLoading(false);
  }, [fetchRevenueGrowthByMonth]);

  useEffect(() => {
    fetchRevenueGrowthByMonthData();
  }, [fetchRevenueGrowthByMonthData]);

  const chartData = {
    series: [
      {
        name: "Revenue",
        data: data.map((item) => item.revenue),
      },
    ],
    options: {
      chart: {
        type: "bar",
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: data.map((item) => item.month),
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.5,
          gradientToColors: [COLORS.secondary],
          opacityFrom: 0.9,
          opacityTo: 1,
          stops: [0, 100],
        },
      },
      colors: [COLORS.accent],
      dataLabels: {
        enabled: false,
      },
      yaxis: {
        // title: {
        //   text: "Revenue",
        // },
      },
      plotOptions: {
        bar: {
          borderRadius: 8,
          distributed: false,
          barHeight: "70%",
          colors: {
            backgroundBarColors: ["#F0F2F5"], // Light color behind bars
            backgroundBarOpacity: 0.3,
            backgroundBarRadius: 8,
          },
        },
      },
      states: {
        normal: {
          filter: {
            type: "shadow",
            color: "#000",
            opacity: 0.15,
            offsetX: 0,
            offsetY: 5,
            blur: 5,
          },
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: "shadow",
            color: "#000",
            opacity: 0.25,
            offsetX: 0,
            offsetY: 7,
            blur: 7,
          },
        },
      },
    },
  };

  return (
    <Paper
      sx={{
        p: 5,
        boxShadow: "none",
        border: 1,
        borderColor: COLORS.border,
        borderRadius: "14px",
      }}
    >
      <Typography fontWeight={600} color={COLORS.primary} fontSize={20}>
        Total Laundry Revenue Growth by Month
      </Typography>

      <Box mt={5}>
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={400}
        />
      </Box>
    </Paper>
  );
};

export default CustomTotalRevenueByMonth;
