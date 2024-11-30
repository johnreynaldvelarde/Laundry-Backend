import React, { useCallback, useEffect, useState } from "react";
import { Paper, Box, Typography, Button } from "@mui/material";
import CustomHeaderTitle from "../../../../components/common/CustomHeaderTitle";
import CustomAddButton from "../../../../components/common/CustomAddButton";
import { COLORS } from "../../../../constants/color";
import { PlusCircle } from "@phosphor-icons/react";
import usePopup from "../../../../hooks/common/usePopup";
import useFetchData from "../../../../hooks/common/useFetchData";
import { dateOptions } from "../../../../data/schedule/serviceStatus";
import CustomCustomerTable from "../../../../components/common/table/CustomCustomerTable";
import CustomHeaderTitleTable from "../../../../components/common/CustomHeaderTitleTable";
import CustomSearch from "../../../../components/common/table/filter/CustomSearch";
import CustomCreatedDate from "../../../../components/common/table/filter/CustomCreatedDate";
import {
  getActivityLog,
  getActivityLogStats,
} from "../../../../services/api/getApi";
import { parseISO } from "date-fns";
import { checkDateMatch } from "../../../../utils/method";
import CustomerGrowthChart from "../../../../components/common/chart/CustomerGrowthChart";
import CustomActivityLogTable from "../../../../components/common/table/CustomActivityLogTable";
import CustomActivityLogHeatmap from "../../../../components/common/chart/CustomActivityLogHeatmap";

const SectionAdminActivityLog = ({ storeId }) => {
  const { isOpen, popupType, openPopup, closePopup, popupData } = usePopup();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { data: activityLog, fetchData: fetchActivityLog } = useFetchData();

  const { data: activityLogStats, fetchData: fetchActivityLogStats } =
    useFetchData();

  const fetchActivityLogData = useCallback(async () => {
    setLoading(true);
    await fetchActivityLog(getActivityLog.viewActivityLog);
    setLoading(false);
  }, [fetchActivityLog]);

  const fetchActivityLogStatsData = useCallback(async () => {
    setLoading(true);
    await fetchActivityLogStats(getActivityLogStats.viewActivityLogStats);
    setLoading(false);
  }, [fetchActivityLogStats]);

  useEffect(() => {
    fetchActivityLogData();
    fetchActivityLogStatsData();
  }, [fetchActivityLogData, fetchActivityLogStatsData]);

  useEffect(() => {
    if (activityLog) {
      setFilteredData(activityLog);
    }
  }, [activityLog]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    applyFilters(selectedDate, event.target.value);
  };

  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    applyFilters(date, searchTerm);
  };

  const applyFilters = (dateOption, search) => {
    const filtered = activityLog.filter((item) => {
      const requestDate = parseISO(item.timestamp);
      const isDateMatch = dateOption
        ? checkDateMatch(dateOption, requestDate)
        : true;

      // Filter by search term in customer fullname
      const isSearchMatch =
        item.fullname.toLowerCase().includes(search.toLowerCase()) ||
        item.username.toLowerCase().includes(search.toLowerCase());

      return isDateMatch && isSearchMatch;
    });
    setFilteredData(filtered);
  };

  useEffect(() => {
    applyFilters(selectedDate, searchTerm);
  }, [selectedDate, searchTerm, activityLog]);

  const handleRefreshData = () => {
    fetchActivityLogData();
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
          title={"Activity Log"}
          subtitle={"Overview of All User Activities and Logs"}
        />
      </Box>

      {/* Sub Header */}
      <Box
        display="flex"
        sx={{ width: "100%", gap: 2, flexWrap: { xs: "wrap", sm: "nowrap" } }}
      >
        <CustomActivityLogHeatmap activityLogData={activityLogStats} />
        {/* <CustomerGrowthChart customerGrowthData={customerStatsData} /> */}
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
            <CustomHeaderTitleTable title={"All Activity Log"} />
          </Box>

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
            }}
          >
            <CustomSearch
              searchTerm={searchTerm}
              handleSearchChange={handleSearchChange}
              placeholder={"Search name or username..."}
            />
          </Box>

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
            <CustomCreatedDate
              selectedDate={selectedDate}
              handleDateChange={handleDateChange}
              dateOptions={dateOptions}
            />
          </Box>

          {/* Clear Filters Button */}
          <Box
            sx={{
              width: {
                xs: "100%",
                sm: "auto",
              },
              mt: { xs: 2, sm: 0 },
              ml: { sm: "1px" },
            }}
          >
            <Button
              variant="outlined"
              onClick={() => {
                setSearchTerm("");
                setSelectedDate("");
                setFilteredData(customerListData);
              }}
              sx={{
                width: {
                  xs: "100%",
                  sm: "auto",
                },
                textTransform: "none",
                borderColor: COLORS.border,
                color: COLORS.primary,
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
          <CustomActivityLogTable
            tableData={filteredData}
            loading={loading}
            refreshData={handleRefreshData}
          />
        </Box>
      </Box>

      {/* Popup */}
      {isOpen && popupType === "addCustomer" && (
        <PopAddNewCustomer
          open={isOpen}
          onClose={closePopup}
          refreshData={handleRefreshData}
        />
      )}
    </>
  );
};

export default SectionAdminActivityLog;
