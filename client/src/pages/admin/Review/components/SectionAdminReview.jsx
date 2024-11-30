import React, { useCallback, useEffect, useState } from "react";
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
import { KeyboardArrowDown } from "@mui/icons-material";
import CustomHeaderTitle from "../../../../components/common/CustomHeaderTitle";
import { COLORS } from "../../../../constants/color";
import usePopup from "../../../../hooks/common/usePopup";
import useFetchData from "../../../../hooks/common/useFetchData";
import {
  dateOptions,
  statusOptions,
} from "../../../../data/schedule/serviceStatus";
import CustomCustomerTable from "../../../../components/common/table/CustomCustomerTable";
import CustomReviewsTable from "../../../../components/common/table/CustomReviewsTable";
import { getReviews } from "../../../../services/api/getApi";
import { checkDateMatch } from "../../../../utils/method";
import CustomRatingFilter from "../../../../components/common/table/filter/CustomRatingFilter";
import CustomSearch from "../../../../components/common/table/filter/CustomSearch";

const SectionAdminReview = ({ storeId }) => {
  const { isOpen, popupType, openPopup, closePopup, popupData } = usePopup();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const { data: reviewData, fetchData: fetchReview } = useFetchData();
  const [loading, setLoading] = useState(true);

  const fetchReviewData = useCallback(async () => {
    setLoading(true);
    await fetchReview(getReviews.viewReviews, storeId);
    setLoading(false);
  }, [fetchReview, storeId]);

  useEffect(() => {
    fetchReviewData();
  }, [fetchReviewData]);

  useEffect(() => {
    if (reviewData) {
      setFilteredData(reviewData);
    }
  }, [reviewData]);

  const handleRefreshData = () => {
    fetchReviewData();
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    applyFilters(selectedDate, selectedStatus, event.target.value);
  };

  const handleStatusChange = (event) => {
    const status = event.target.value;
    setSelectedStatus(status);
    applyFilters(selectedDate, status, searchTerm);
  };

  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    applyFilters(date, selectedStatus, searchTerm);
  };

  const applyFilters = (dateOption, status, search) => {
    const filtered = reviewData.filter((item) => {
      const requestDate = parseISO(item.created_at);
      const isDateMatch = dateOption
        ? checkDateMatch(dateOption, requestDate)
        : true;

      // Filter by rating status if selected
      const isStatusMatch =
        status === "" ? true : item.rating === Number(status);

      // Filter by search term in customer name or comment
      const isSearchMatch =
        item.customer_full_name.toLowerCase().includes(search.toLowerCase()) ||
        item.comment.toLowerCase().includes(search.toLowerCase());

      return isDateMatch && isStatusMatch && isSearchMatch;
    });

    setFilteredData(filtered);
  };

  useEffect(() => {
    applyFilters(selectedDate, selectedStatus, searchTerm);
  }, [selectedDate, selectedStatus, searchTerm, reviewData]);

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
          title={"Reviews Overview"}
          subtitle={"Overview of Customer Reviews and Feedback"}
        />
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
            gap: { xs: 0, sm: 1, md: 1 },
          }}
        >
          <Box sx={{ display: "flex" }}>
            {/* Title */}
            <Typography
              variant="h6"
              sx={{ marginRight: 2, color: COLORS.text, fontWeight: 600 }}
            >
              All Feedback and Reviews
            </Typography>
          </Box>

          {/* Filter by search*/}
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
              placeholder={"Search name or comment..."}
            />
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
                        Select a date
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

          {/* Filter Rating */}
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
            <CustomRatingFilter
              selectedStatus={selectedStatus}
              handleStatusChange={handleStatusChange}
            />
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
                setSearchTerm("");
                setSelectedDate("");
                setSelectedStatus("");
                setFilteredData(reviewData);
              }}
              sx={{
                width: {
                  xs: "100%", // Full width on small screens
                  sm: "auto", // Auto width on larger screens
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
          <CustomReviewsTable
            tableData={filteredData}
            loading={loading}
            refreshData={handleRefreshData}
          />
        </Box>
      </Box>

      {/* Popup */}
    </>
  );
};

export default SectionAdminReview;
