import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  IconButton,
  Skeleton,
} from "@mui/material";
import { COLORS } from "../../../../constants/color";
import { ArrowFatLineLeft, ArrowFatLineRight } from "@phosphor-icons/react";
import CustomLineChart from "./chart/CustomLineChart";
import { getCustomLineChartOptions } from "./data/chartData";
import { getLast5Months } from "./utils/chartUtils";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import useFetchData from "../../../../hooks/common/useFetchData";
import {
  getAdminTotalCustomers,
  getAdminTotalCustomersWithStoreId,
  getAdminTotalLaundryLoad,
  getAdminTotalLaundryLoadWithStoreId,
  getAdminTotalLaundryOrders,
  getAdminTotalLaundryOrdersWithStoreId,
  getAdminTotalRevenue,
  getAdminTotalRevenueWithStoreId,
} from "../../../../services/api/getApi";
import total_revenue from "../../../../assets/gif/total_revenue.gif";
import total_service_request from "../../../../assets/gif/total_service_request.gif";
import total_customers from "../../../../assets/gif/total_customers.gif";
import total_average_weight from "../../../../assets/gif/total_average_weight.gif";
import useAuth from "../../../../contexts/AuthContext";

const CustomDashHorizontal = () => {
  const { userDetails } = useAuth();
  const scrollRef = useRef(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const [loading, setLoading] = useState(true);
  const { data: totalRevenue, fetchData: fetchTotalRevenue } = useFetchData();
  const { data: totalLaundryOrders, fetchData: fetchTotalLaundryOrders } =
    useFetchData();
  const { data: totalCustomers, fetchData: fetchTotalCustomers } =
    useFetchData();
  const { data: totalLoad, fetchData: fetchTotalLoad } = useFetchData();

  const fetchTotalRevenueData = useCallback(async () => {
    setLoading(true);

    const fetchRevenueFn =
      userDetails.roleName === "Administrator"
        ? getAdminTotalRevenue.getTotalRevenue
        : getAdminTotalRevenueWithStoreId.getTotalRevenue;

    const fetchRevenueArgs =
      userDetails.roleName === "Administrator" ? [] : [userDetails.storeId];

    await fetchTotalRevenue(fetchRevenueFn, ...fetchRevenueArgs);

    setLoading(false);
  }, [fetchTotalRevenue, userDetails.roleName, userDetails.storeId]);

  const fetchTotalLaundryOrdersData = useCallback(async () => {
    setLoading(true);

    const fetchLaundryOrdersFn =
      userDetails.roleName === "Administrator"
        ? getAdminTotalLaundryOrders.getTotalLaundryOrders
        : getAdminTotalLaundryOrdersWithStoreId.getTotalLaundryOrders;

    const fetchLaundryOrdersArgs =
      userDetails.roleName === "Administrator" ? [] : [userDetails.storeId];

    await fetchTotalLaundryOrders(
      fetchLaundryOrdersFn,
      ...fetchLaundryOrdersArgs
    );

    setLoading(false);
  }, [fetchTotalLaundryOrders, userDetails.roleName, userDetails.storeId]);

  const fetchTotalCustomersData = useCallback(async () => {
    setLoading(true);

    const fetchCustomersFn =
      userDetails.roleName === "Administrator"
        ? getAdminTotalCustomers.getTotalCustomers
        : getAdminTotalCustomersWithStoreId.getTotalCustomers;

    const fetchCustomersArgs =
      userDetails.roleName === "Administrator" ? [] : [userDetails.storeId];

    await fetchTotalCustomers(fetchCustomersFn, ...fetchCustomersArgs);

    setLoading(false);
  }, [fetchTotalCustomers, userDetails.roleName, userDetails.storeId]);

  const fetchTotalLoadData = useCallback(async () => {
    setLoading(true);

    const fetchLoadFn =
      userDetails.roleName === "Administrator"
        ? getAdminTotalLaundryLoad.getTotalLaundryLoad
        : getAdminTotalLaundryLoadWithStoreId.getTotalLaundryLoad;

    const fetchLoadArgs =
      userDetails.roleName === "Administrator" ? [] : [userDetails.storeId];

    await fetchTotalLoad(fetchLoadFn, ...fetchLoadArgs);

    setLoading(false);
  }, [fetchTotalLoad, userDetails.roleName, userDetails.storeId]);

  useEffect(() => {
    fetchTotalRevenueData();
    fetchTotalLaundryOrdersData();
    fetchTotalCustomersData();
    fetchTotalLoadData();
  }, [
    fetchTotalRevenueData,
    fetchTotalLaundryOrdersData,
    fetchTotalCustomersData,
    fetchTotalLoadData,
  ]);

  const { title, amount, change, chart_data } = totalRevenue;
  const { title_orders, amount_orders, change_orders, chart_data_orders } =
    totalLaundryOrders;
  const {
    title_customers,
    amount_customers,
    change_customers,
    chart_data_customers,
  } = totalCustomers;
  const { title_load, amount_load, change_load, chart_data_load } = totalLoad;

  const keyMetricsData = [
    {
      title: title,
      amount: amount,
      change: change,
      chart_data: chart_data,
      gif_icon: total_revenue,
    },
    {
      title: title_orders,
      amount: amount_orders,
      change: change_orders,
      chart_data: chart_data_orders,
      gif_icon: total_service_request,
    },
    {
      title: title_customers,
      amount: amount_customers,
      change: change_customers,
      chart_data: chart_data_customers,
      gif_icon: total_customers,
    },
    {
      title: title_load,
      amount: amount_load,
      change: change_load,
      chart_data: chart_data_load,
      gif_icon: total_average_weight,
    },
  ];

  useEffect(() => {
    // Check if scrolling is necessary
    if (scrollRef.current.scrollWidth > scrollRef.current.clientWidth) {
      setIsScrollable(true);
      setShowRightArrow(true);
    }
  }, [keyMetricsData]);

  const handleScroll = (direction) => {
    const scrollAmount = 200;
    if (scrollRef.current) {
      const newScrollLeft =
        direction === "left"
          ? scrollRef.current.scrollLeft - scrollAmount
          : scrollRef.current.scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: newScrollLeft, behavior: "smooth" });
    }
  };

  const handleScrollEvent = () => {
    if (scrollRef.current) {
      setShowLeftArrow(scrollRef.current.scrollLeft > 0);
      setShowRightArrow(
        scrollRef.current.scrollLeft + scrollRef.current.clientWidth <
          scrollRef.current.scrollWidth
      );
    }
  };

  return (
    <Box sx={{ position: "relative", overflow: "hidden", width: "100%" }}>
      {/* Left Arrow */}
      {isScrollable && showLeftArrow && (
        <IconButton
          onClick={() => handleScroll("left")}
          sx={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            backgroundColor: COLORS.secondary,
            boxShadow: 5,
            "&:hover": { backgroundColor: COLORS.secondaryHover },
          }}
        >
          <ArrowFatLineLeft color={COLORS.white} weight="duotone" />
        </IconButton>
      )}

      {/* Scrollable Metrics */}
      <Box
        ref={scrollRef}
        onScroll={handleScrollEvent}
        sx={{
          display: "flex",
          overflowX: "auto",
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": { display: "none" },
          gap: 2,
        }}
      >
        {keyMetricsData.map((metric, index) => (
          <Box key={index} sx={{ flexShrink: 0 }}>
            <Paper
              sx={{
                p: 2,
                boxShadow: "none",
                border: 1,
                borderColor: COLORS.border,
                borderRadius: "14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                {/* Icon on the left side */}
                <Box mr={1}>
                  <img
                    src={metric.gif_icon}
                    alt="metric icon"
                    style={{ width: 80, height: 80 }}
                  />
                </Box>

                <Box sx={{ flex: 1, textAlign: "left" }}>
                  {loading ? (
                    <Skeleton width="60%" />
                  ) : (
                    <Typography variant="h6" sx={{ color: COLORS.primary }}>
                      {metric.title}
                    </Typography>
                  )}
                  {loading ? (
                    <Skeleton width="40%" />
                  ) : (
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 600, color: COLORS.text }}
                    >
                      {metric.amount ? metric.amount.toLocaleString() : "N/A"}
                    </Typography>
                  )}
                  {loading ? (
                    <Skeleton width="30%" />
                  ) : (
                    <Typography
                      variant="body2"
                      color={
                        parseFloat(metric.change) < 0
                          ? COLORS.error
                          : COLORS.success
                      }
                      display="inline"
                      fontWeight={600}
                    >
                      {/* Icon for negative or positive change */}
                      {parseFloat(metric.change) < 0 ? (
                        <TrendingDownIcon
                          fontSize="small"
                          style={{ marginRight: 4 }}
                        />
                      ) : (
                        <TrendingUpIcon
                          fontSize="small"
                          style={{ marginRight: 4 }}
                        />
                      )}
                      {metric.change}
                    </Typography>
                  )}
                  {loading ? (
                    <Skeleton width="50%" />
                  ) : (
                    <Typography
                      variant="body2"
                      ml={1}
                      color={COLORS.primary}
                      display="inline"
                      fontWeight={500}
                    >
                      from last month
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box>
                {loading ? (
                  <Skeleton variant="rectangular" height={200} />
                ) : metric.chart_data ? (
                  <CustomLineChart
                    chartData={metric.chart_data}
                    chartOptions={getCustomLineChartOptions(metric.chart_data)}
                  />
                ) : (
                  <CircularProgress />
                )}
              </Box>
            </Paper>
          </Box>
        ))}
      </Box>

      {/* Right Arrow */}
      {isScrollable && showRightArrow && (
        <IconButton
          onClick={() => handleScroll("right")}
          sx={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            backgroundColor: COLORS.secondary,
            boxShadow: 5,
            "&:hover": { backgroundColor: COLORS.secondaryHover },
          }}
        >
          <ArrowFatLineRight color={COLORS.white} weight="duotone" />
        </IconButton>
      )}
    </Box>
  );
};

export default CustomDashHorizontal;
