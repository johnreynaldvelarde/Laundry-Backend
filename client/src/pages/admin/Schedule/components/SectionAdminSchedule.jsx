import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import { parseISO } from "date-fns";
import React, { useCallback, useEffect, useState } from "react";
import usePopup from "../../../../hooks/common/usePopup";
import CustomHeaderTitle from "../../../../components/common/CustomHeaderTitle";
import {
  AddressBookTabs,
  ArrowRight,
  ArrowUpRight,
  CalendarSlash,
  Flag,
  Hourglass,
  PlusCircle,
  TrendDown,
  TrendUp,
  Truck,
} from "@phosphor-icons/react";
import { COLORS } from "../../../../constants/color";
import {
  dateOptions,
  statusOptions,
} from "../../../../data/schedule/serviceStatus";
import { KeyboardArrowDown } from "@mui/icons-material";
import CustomScheduleTable from "../../../../components/common/table/CustomScheduleTable";
import useFetchData from "../../../../hooks/common/useFetchData";
import {
  viewScheduleRequestByUser,
  viewScheduleRequestStatsByUser,
} from "../../../../services/api/getApi";
import { checkDateMatch } from "../../../../utils/method";

const SectionAdminSchedule = ({ storeId }) => {
  const { isOpen, popupType, openPopup, closePopup, popupData } = usePopup();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { data: statsArray = [], fetchData: fetchScheduleStats } =
    useFetchData();

  const { data: scheduleData, fetchData: fetchSchedule } = useFetchData();

  const fetchScheduleStatsData = useCallback(async () => {
    setLoading(true);
    await fetchScheduleStats(
      viewScheduleRequestStatsByUser.getScheduleRequestStatsByUser,
      storeId
    );
    setLoading(false);
  }, [fetchScheduleStats, storeId]);

  const fetchScheduleData = useCallback(async () => {
    setLoading(true);
    await fetchSchedule(
      viewScheduleRequestByUser.getScheduleRequestByUser,
      storeId
    );
    setLoading(false);
  }, [fetchSchedule, storeId]);

  useEffect(() => {
    fetchScheduleStatsData();
    fetchScheduleData();
  }, [fetchScheduleStatsData, fetchScheduleData]);

  useEffect(() => {
    if (scheduleData) {
      setFilteredData(scheduleData);
    }
  }, [scheduleData]);

  const {
    total_requests,
    pending_requests,
    complete_delivery_requests,
    laundry_completed_requests,
    total_percentage,
    pending_percentage,
    complete_delivery_percentage,
    laundry_completed_percentage,
  } = statsArray[0]
    ? {
        total_requests: statsArray[0].total_requests || 0,
        pending_requests: statsArray[0].pending_requests || 0,
        complete_delivery_requests:
          statsArray[0].complete_delivery_requests || 0,
        laundry_completed_requests:
          statsArray[0].laundry_completed_requests || 0,
        total_percentage: statsArray[0].total_percentage || 0,
        pending_percentage: statsArray[0].pending_percentage || 0,
        complete_delivery_percentage:
          statsArray[0].complete_delivery_percentage || 0,
        laundry_completed_percentage:
          statsArray[0].laundry_completed_percentage || 0,
      }
    : {};

  const data = [
    {
      title: "Total Service Request",
      value: total_requests,
      percentageChange: `${total_percentage}`,
      icon: <AddressBookTabs size={35} color={COLORS.white} weight="duotone" />,
      backgroundColor: COLORS.secondary,
    },
    {
      title: "Pending Request",
      value: pending_requests,
      percentageChange: `${pending_percentage}`,
      icon: <Hourglass size={35} color={COLORS.white} weight="duotone" />,
      backgroundColor: COLORS.accent,
    },
    {
      title: "Complete Delivery",
      value: complete_delivery_requests,
      percentageChange: `${complete_delivery_percentage}`,
      icon: <Truck size={35} color={COLORS.white} weight="duotone" />,
      backgroundColor: COLORS.success,
    },
    {
      title: "Laundry Completed",
      value: laundry_completed_requests,
      percentageChange: `${laundry_completed_percentage}`,
      icon: <Flag size={35} color={COLORS.white} weight="duotone" />,
      backgroundColor: COLORS.error,
    },
  ];

  const handleStatusChange = (event) => {
    const status = event.target.value;
    setSelectedStatus(status);
    applyFilters(selectedDate, status);
  };

  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    applyFilters(date, selectedStatus);
  };

  const applyFilters = (dateOption, status) => {
    const filtered = scheduleData.filter((item) => {
      const requestDate = parseISO(item.request_date); // Parse the request date string into a Date object
      const isDateMatch = dateOption
        ? checkDateMatch(dateOption, requestDate)
        : true;
      const isStatusMatch = status ? item.request_status === status : true;
      return isDateMatch && isStatusMatch;
    });
    setFilteredData(filtered);
  };

  const handleGoToMonitoredUnits = () => {
    // Your logic here
  };

  const handleRefreshData = () => {
    fetchScheduleStatsData();
    fetchScheduleData();
  };

  return (
    <>
      {/* Header */}
      <Box
        className="flex items-center justify-between mb-8"
        sx={{
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "center", sm: "flex-start" },
          width: "100%",
        }}
      >
        <CustomHeaderTitle
          title={"View Schedules"}
          subtitle={"Organize and Oversee Service Requests"}
        />
      </Box>

      {/* Sub Header */}
      <Box display="flex" gap={2} flexWrap="wrap" sx={{ width: "100%" }}>
        {data.map((item, index) => (
          <Paper
            key={index}
            sx={{
              borderRadius: "14px",
              boxShadow: "none",
              borderWidth: 1,
              borderColor: COLORS.border,
              width: {
                xs: "100%",
                sm: "calc(50% - 16px)",
                md: "calc(33.33% - 16px)",
                lg: "calc(25% - 16px)",
              },
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              px: 3,
              py: 3,
            }}
          >
            <Box sx={{ display: "flex" }}>
              <Box
                sx={{
                  width: "50px",
                  height: "50px",
                  marginRight: 2,
                  backgroundColor: item.backgroundColor,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 1,
                }}
              >
                {item.icon} {/* Render the custom icon */}
              </Box>
              <Box>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ color: COLORS.subtitle, fontWeight: 500 }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ color: COLORS.text, fontWeight: 600 }}
                >
                  {item.value}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", marginTop: 1 }}>
              <Box
                sx={{
                  marginRight: 1,
                  backgroundColor: item.percentageChange.includes("-")
                    ? COLORS.pale_error
                    : COLORS.pale_sucess,
                  borderRadius: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 50,
                  height: 40,
                }}
              >
                {item.percentageChange.includes("-") ? (
                  <TrendDown size={25} color={COLORS.error} weight="duotone" />
                ) : (
                  <TrendUp size={25} color={COLORS.success} weight="duotone" />
                )}
              </Box>

              <Box sx={{ marginTop: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <span
                    className="text-base font-semibold"
                    style={{
                      color: item.percentageChange.includes("-")
                        ? COLORS.error // Red color for negative percentage
                        : COLORS.success, // Green color for positive percentage
                    }}
                  >
                    {item.percentageChange}
                  </span>
                  <span
                    className="ml-1 font-medium text-sm"
                    style={{ color: COLORS.primary }}
                  >
                    from last month
                  </span>
                </Typography>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Content */}
      <Box mt={5}>
        <Box
          mb={2}
          className="flex items-center"
          sx={{
            flexDirection: {
              xs: "column",
              sm: "row",
            },
          }}
        >
          <Box sx={{ display: "flex" }}>
            {/* Title */}
            <Typography
              variant="h6"
              sx={{ marginRight: 2, color: COLORS.text, fontWeight: 600 }}
            >
              All Service Request
            </Typography>
          </Box>

          {/* Filter by created date */}
          <Box
            sx={{
              width: {
                xs: "100%", // Full width on small screens
                sm: "auto", // Auto width on larger screens
              },
              mt: {
                xs: 2, // Margin top on small screens
                sm: 0, // No margin top on larger screens
              },
            }}
          >
            <FormControl sx={{ minWidth: 200 }} size="small" fullWidth>
              <Select
                value={selectedDate}
                onChange={handleDateChange}
                displayEmpty
                IconComponent={KeyboardArrowDown}
                renderValue={(selected) => {
                  if (!selected) {
                    return (
                      <span style={{ color: COLORS.primary }}>
                        Select creation date
                      </span>
                    );
                  }
                  return selected;
                }}
                sx={{
                  borderRadius: 2,
                  color: COLORS.primary,
                  "& .MuiSvgIcon-root": {
                    color: COLORS.primary,
                  },
                }}
              >
                {/* Creation date options */}
                {dateOptions.map((date) => (
                  <MenuItem key={date} value={date}>
                    {date}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Filter Status */}
          <Box
            sx={{
              width: {
                xs: "100%",
                sm: "auto",
              },
              mt: {
                xs: 2,
                sm: 0,
              },
              mx: {
                xs: 0,
                sm: 2,
              },
            }}
          >
            <FormControl sx={{ minWidth: 200 }} size="small" fullWidth>
              <Select
                value={selectedStatus}
                onChange={handleStatusChange}
                displayEmpty
                IconComponent={KeyboardArrowDown}
                renderValue={(selected) => {
                  if (!selected) {
                    return (
                      <span style={{ color: COLORS.primary }}>
                        Select status
                      </span>
                    );
                  }
                  return selected;
                }}
                sx={{
                  borderRadius: 2,
                  color: COLORS.primary,
                  "& .MuiSvgIcon-root": {
                    color: COLORS.primary,
                  },
                }}
              >
                {/* Status options */}
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Clear Filters Button */}
          <Box
            sx={{
              width: {
                xs: "100%", // Full width on small screens
                sm: "auto", // Auto width on larger screens
              },
              mt: { xs: 2, sm: 0 },
              ml: { sm: "1px" },
            }}
          >
            <Button
              variant="outlined"
              onClick={() => {
                setSelectedDate("");
                setSelectedStatus("");
                setFilteredData(scheduleData);
              }}
              sx={{
                textTransform: "none",
                borderColor: COLORS.border,
                color: COLORS.primary,
                width: "100%", // Make the button full width on small screens
                "&:hover": {
                  borderColor: COLORS.secondary,
                  backgroundColor: COLORS.secondaryLight,
                  color: COLORS.secondary,
                },
              }}
            >
              Clear Filters
            </Button>
          </Box>
        </Box>

        <Box>
          <CustomScheduleTable
            tableData={filteredData}
            loading={loading}
            refreshData={handleRefreshData}
          />
        </Box>
      </Box>
    </>
  );
};

export default SectionAdminSchedule;
