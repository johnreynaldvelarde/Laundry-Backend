import React, { useCallback, useEffect, useState } from "react";
import { Paper, Box, Typography, Button } from "@mui/material";
import CustomHeaderTitle from "../../../../components/common/CustomHeaderTitle";
import CustomAddButton from "../../../../components/common/CustomAddButton";
import { COLORS } from "../../../../constants/color";
import { FileXls, PlusCircle } from "@phosphor-icons/react";
import PopAddNewCustomer from "./PopAddNewCustomer";
import usePopup from "../../../../hooks/common/usePopup";
import useFetchData from "../../../../hooks/common/useFetchData";
import { dateOptions } from "../../../../data/schedule/serviceStatus";
import CustomCustomerTable from "../../../../components/common/table/CustomCustomerTable";
import CustomHeaderTitleTable from "../../../../components/common/CustomHeaderTitleTable";
import CustomSearch from "../../../../components/common/table/filter/CustomSearch";
import CustomCreatedDate from "../../../../components/common/table/filter/CustomCreatedDate";
import {
  getCustomerGrowthOverTime,
  getCustomerList,
} from "../../../../services/api/getApi";
import { parseISO } from "date-fns";
import { checkDateMatch } from "../../../../utils/method";
import CustomerGrowthChart from "../../../../components/common/chart/CustomerGrowthChart";
import * as XLSX from "xlsx";

const SectionUserCustomers = ({ storeId }) => {
  const { isOpen, popupType, openPopup, closePopup, popupData } = usePopup();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const { data: customerListData, fetchData: fetchCustomerList } =
    useFetchData();
  const { data: customerStatsData, fetchData: fetchCustomerStats } =
    useFetchData();
  const [loading, setLoading] = useState(true);

  const fetchCustomerListData = useCallback(async () => {
    setLoading(true);
    await fetchCustomerList(getCustomerList.viewCustomerList, storeId);
    setLoading(false);
  }, [fetchCustomerList, storeId]);

  const fetchCustomerStatsData = useCallback(async () => {
    setLoading(true);
    await fetchCustomerStats(
      getCustomerGrowthOverTime.viewCustomerGrow,
      storeId
    );
    setLoading(false);
  }, [fetchCustomerStats, storeId]);

  useEffect(() => {
    fetchCustomerListData();
    fetchCustomerStatsData();
  }, [fetchCustomerListData]);

  useEffect(() => {
    if (customerListData) {
      setFilteredData(customerListData);
    }
  }, [customerListData]);

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
    const filtered = customerListData.filter((item) => {
      const requestDate = parseISO(item.date_created);
      const isDateMatch = dateOption
        ? checkDateMatch(dateOption, requestDate)
        : true;

      // Filter by search term in customer fullname
      const isSearchMatch =
        item.full_name.toLowerCase().includes(search.toLowerCase()) ||
        item.username.toLowerCase().includes(search.toLowerCase());

      return isDateMatch && isSearchMatch;
    });
    setFilteredData(filtered);
  };

  useEffect(() => {
    applyFilters(selectedDate, searchTerm);
  }, [selectedDate, searchTerm, customerListData]);

  const handleRefreshData = () => {
    fetchCustomerListData();
  };

  const handleExportAsExcel = async () => {
    // Map the customer list data to the structure you want in the Excel file
    const data = customerListData.map((item) => ({
      "Customer ID": item.customer_id,
      "Full Name": item.full_name,
      Username: item.username,
      Email: item.email,
      "Mobile Number": item.mobile_number,
      "Address Line": item.address.address_line,
      City: item.address.city,
      Province: item.address.province,
      Region: item.address.region, // Assuming there's a 'region' field
      Country: item.address.country,
      "Postal Code": item.address.postal_code,
      Latitude: item.address.latitude, // Assuming there's a 'latitude' field
      Longitude: item.address.longitude, // Assuming there's a 'longitude' field
      "Date Created": item.date_created,
    }));

    // If needed, calculate a total or other summary data here
    // Example: total number of customers
    const totalCustomers = customerListData.length;

    // Add a row for the total number of customers at the end of the data
    data.push({
      "Customer ID": "Total",
      "Full Name": "",
      Username: "",
      Email: "",
      "Mobile Number": "",
      "Address Line": "",
      City: "",
      Province: "",
      Region: "",
      Country: "",
      "Postal Code": "",
      Latitude: "",
      Longitude: "",
      "Date Created": "",
      "Total Customers": totalCustomers,
    });

    // Convert the data to a sheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Create a new workbook and append the sheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customer Data");

    // Export the Excel file
    XLSX.writeFile(wb, "Customer List.xlsx");
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
          title={"View Customer List"}
          subtitle={"Overview of All Customer Accounts and Activities"}
        />
        <CustomAddButton
          onClick={() => openPopup("addCustomer")}
          label={"Add new customer"}
          icon={<PlusCircle size={24} color={COLORS.white} weight="duotone" />}
        />
      </Box>

      {/* Sub Header */}
      <Box
        display="flex"
        sx={{ width: "100%", gap: 2, flexWrap: { xs: "wrap", sm: "nowrap" } }}
      >
        <CustomerGrowthChart customerGrowthData={customerStatsData} />
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
            <CustomHeaderTitleTable title={"All Customers"} />
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
          <CustomCustomerTable
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

export default SectionUserCustomers;
