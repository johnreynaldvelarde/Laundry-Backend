import { Box } from "@mui/material";
import React from "react";
import ReactApexChart from "react-apexcharts";

class CustomLineChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chartData: [],
      chartOptions: {},
    };
  }

  componentDidMount() {
    this.setState({
      chartData: this.props.chartData,
      chartOptions: this.props.chartOptions,
    });
  }

  render() {
    const { chartData, chartOptions } = this.state;
    const series = [
      {
        name: "Total",
        data: chartData.map((item) => item.value),
      },
    ];

    const categories = chartData.map((item) => item.name);

    const updatedChartOptions = {
      ...chartOptions,
      xaxis: {
        ...chartOptions.xaxis,
        categories: categories,
      },
    };

    return (
      <Box
        sx={{
          height: { xs: "380px", md: "100%" },
        }}
      >
        <ReactApexChart
          options={updatedChartOptions}
          series={series}
          type="line"
          width="100%"
          height="90%"
        />
      </Box>
    );
  }
}

export default CustomLineChart;
