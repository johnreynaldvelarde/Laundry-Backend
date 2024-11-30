import React, { useCallback, useEffect, useState } from "react";
import { Paper, Box, Typography, Button } from "@mui/material";
import { parseISO } from "date-fns";
import CustomHeaderTitle from "../../../../components/common/CustomHeaderTitle";
import { COLORS } from "../../../../constants/color";
import usePopup from "../../../../hooks/common/usePopup";
import useFetchData from "../../../../hooks/common/useFetchData";
import { dateOptions } from "../../../../data/schedule/serviceStatus";
import {
  getCustomerTypeStats,
  getTransactionHistory,
  getTransactionSalesByMonth,
} from "../../../../services/api/getApi";
import { checkDateMatch } from "../../../../utils/method";
import CustomSearch from "../../../../components/common/table/filter/CustomSearch";
import CustomHeaderTitleTable from "../../../../components/common/CustomHeaderTitleTable";
import CustomCreatedDate from "../../../../components/common/table/filter/CustomCreatedDate";
import CustomTransactionTable from "../../../../components/common/table/CustomTransactionTable";
import CustomPaymentStatus from "../../../../components/common/table/filter/CustomPaymentStatus";
import SalesTrendChart from "../../../../components/common/chart/SalesTrendChart";
import CustomPieChart from "../../../../components/common/chart/CustomPieChart";
import { FileXls } from "@phosphor-icons/react";
import * as XLSX from "xlsx";

const SectionAdminTransaction = ({ storeId }) => {
  const { isOpen, popupType, openPopup, closePopup, popupData } = usePopup();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const { data: transactionData, fetchData: fetchTransaction } = useFetchData();
  const { data: salesByMonthData, fetchData: fetchSalesByMonth } =
    useFetchData();
  const { data: customerTypeData, fetchData: fetchCustomerType } =
    useFetchData();
  const [loading, setLoading] = useState(true);
  const statusOptions = ["Completed", "Pending"];

  const fetchTransactionData = useCallback(async () => {
    setLoading(true);
    await fetchTransaction(
      getTransactionHistory.viewTransctionHistory,
      storeId
    );
    setLoading(false);
  }, [fetchTransaction, storeId]);

  const fetchSalesByMonthData = useCallback(async () => {
    setLoading(true);
    await fetchSalesByMonth(
      getTransactionSalesByMonth.viewSalesByMonth,
      storeId
    );
    setLoading(false);
  }, [fetchSalesByMonth, storeId]);

  const fetchCustomerTypeData = useCallback(async () => {
    setLoading(true);
    await fetchCustomerType(getCustomerTypeStats.viewCustomerStats, storeId);
    setLoading(false);
  }, [fetchCustomerType, storeId]);

  useEffect(() => {
    fetchTransactionData();
    fetchSalesByMonthData();
    fetchCustomerTypeData();
  }, [fetchTransactionData, fetchSalesByMonthData, fetchCustomerTypeData]);

  useEffect(() => {
    if (transactionData) {
      setFilteredData(transactionData);
    }
  }, [transactionData]);

  const handleRefreshData = () => {
    fetchTransactionData();
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
    const filtered = transactionData.filter((item) => {
      const requestDate = parseISO(item.created_at);
      const isDateMatch = dateOption
        ? checkDateMatch(dateOption, requestDate)
        : true;

      // Filter by transaction status if selected
      const isStatusMatch = status ? item.transaction_status === status : true;

      // Filter by search term in customer fullname
      const isSearchMatch =
        item.customer_fullname.toLowerCase().includes(search.toLowerCase()) ||
        item.transaction_code.toLowerCase().includes(search.toLowerCase());

      return isDateMatch && isStatusMatch && isSearchMatch;
    });

    setFilteredData(filtered);
  };

  useEffect(() => {
    applyFilters(selectedDate, selectedStatus, searchTerm);
  }, [selectedDate, selectedStatus, searchTerm, transactionData]);

  const handleExportAsExcel = async () => {
    const data = filteredData.map((item) => ({
      "Transaction ID": item.transaction_id,
      "Transaction Code": item.transaction_code,
      "Customer Fullname": item.customer_fullname,
      "Customer Type": item.customer_type,
      "Service Name": item.service_name,
      "Default Price": item.default_price,
      Load: item.load,
      "Total Amount": item.total_amount,
      "Payment Method": item.payment_method,
      "Transaction Status": item.transaction_status,
      "Date Created": item.created_at,
      "Related Items":
        item.related_items.length > 0
          ? item.related_items
              .map(
                (ri) =>
                  `${ri.item_name} (Qty: ${ri.quantity}, Amount: ${ri.amount})`
              )
              .join(", ")
          : "N/A",
    }));

    const totalAmount = filteredData.reduce((sum, item) => {
      return sum + parseFloat(item.total_amount);
    }, 0);

    data.push({
      "Transaction ID": "Total",
      "Transaction Code": "",
      "Customer Fullname": "",
      "Customer Type": "",
      "Service Name": "",
      "Default Price": "",
      Load: "",
      "Total Amount": totalAmount.toFixed(2),
      "Payment Method": "",
      "Transaction Status": "",
      "Date Created": "",
      "Related Items": "",
    });

    const ws = XLSX.utils.json_to_sheet(data);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transaction Data");

    XLSX.writeFile(wb, "Transaction History.xlsx");
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
          title={"Transaction History"}
          subtitle={"Complete Overview of Transa  ction Activities"}
        />
      </Box>

      {/* Sub Header */}
      <Box
        display="flex"
        sx={{ width: "100%", gap: 2, flexWrap: { xs: "wrap", sm: "nowrap" } }}
      >
        <Box
          sx={{
            width: {
              xs: "100%",
              sm: "calc(50% - 8px)",
              md: "calc(60% - 8px)",
              lg: "calc(35% - 8px)",
            },
            borderRadius: "14px",
            overflow: "hidden",
          }}
        >
          <CustomPieChart data={customerTypeData} />
        </Box>

        {/* Sales Graph */}
        <Box
          sx={{
            width: {
              xs: "100%",
              sm: "calc(50% - 8px)",
              md: "calc(40% - 8px)",
              lg: "calc(65% - 8px)",
            },
            borderRadius: "14px",
            overflow: "hidden",
          }}
        >
          <SalesTrendChart salesByMonthData={salesByMonthData} />
        </Box>
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
          {/* Title */}
          <Box sx={{ display: "flex" }}>
            <CustomHeaderTitleTable title={"All Transaction History"} />
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
              placeholder={"Search name or code..."}
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
            <CustomCreatedDate
              selectedDate={selectedDate}
              handleDateChange={handleDateChange}
              dateOptions={dateOptions}
            />
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
            }}
          >
            <CustomPaymentStatus
              statusOptions={statusOptions}
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
                setFilteredData(transactionData);
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

          {/* Export Button aligned to the right and responsive */}
          <Box
            sx={{
              width: "auto", // Auto width for Export button
              ml: "auto", // Push Export button to the right edge
              mt: {
                xs: 2, // Add top margin for small screens
                sm: 0, // No margin top on larger screens
              },
              width: {
                xs: "100%", // Full width on small screens
                sm: "auto", // Auto width on larger screens
              },
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleExportAsExcel}
              sx={{
                width: {
                  xs: "100%", // Full width on small screens
                  sm: "auto", // Auto width on larger screens
                },
                textTransform: "none",
                borderColor: COLORS.border,
                color: COLORS.white,
                backgroundColor: COLORS.secondary,
                boxShadow: "none", // Remove shadow
                "&:hover": {
                  backgroundColor: COLORS.secondary,
                  color: COLORS.white,
                },
              }}
              startIcon={<FileXls color={COLORS.white} weight="duotone" />}
            >
              Export as Excel
            </Button>
          </Box>
        </Box>

        <Box>
          <CustomTransactionTable
            tableData={filteredData}
            loading={loading}
            refreshData={handleRefreshData}
          />
        </Box>
      </Box>
    </>
  );
};

export default SectionAdminTransaction;
