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
  getCustomerGrowthOverTime,
  getCustomerList,
  getPromoList,
  getServicesTypeList,
} from "../../../../services/api/getApi";
import { parseISO } from "date-fns";
import { checkDateMatch } from "../../../../utils/method";
import CustomerGrowthChart from "../../../../components/common/chart/CustomerGrowthChart";
import CustomServicesManagement from "../../../../components/common/table/CustomServicesManagementTable";
import CustomServicesManagementTable from "../../../../components/common/table/CustomServicesManagementTable";
import PopAddNewServices from "./PopAddNewServices";
import CustomServicesPromoList from "./CustomServicesPromoList";

const SectionAdminServiceManagement = ({ storeId, userDetails }) => {
  const { isOpen, popupType, openPopup, closePopup, popupData } = usePopup();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const { data: servicesListData, fetchData: fetchServicesList } =
    useFetchData();
  const { data: promoListData, fetchData: fetchPromoList } = useFetchData();
  const [loading, setLoading] = useState(true);

  const fetchServicesListData = useCallback(async () => {
    setLoading(true);
    await fetchServicesList(getServicesTypeList.viewServicesType, storeId);
    setLoading(false);
  }, [fetchServicesList, storeId]);

  const fetchPromoListData = useCallback(async () => {
    setLoading(true);
    await fetchPromoList(getPromoList.viewPromo, storeId);
    setLoading(false);
  }, [fetchPromoList, storeId]);

  useEffect(() => {
    fetchServicesListData();
    fetchPromoListData();
  }, [fetchServicesListData, fetchPromoListData]);

  useEffect(() => {
    if (servicesListData) {
      setFilteredData(servicesListData);
    }
  }, [servicesListData]);

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
    const filtered = servicesListData.filter((item) => {
      const requestDate = parseISO(item.date_created);
      const isDateMatch = dateOption
        ? checkDateMatch(dateOption, requestDate)
        : true;

      // Filter by search term in customer fullname
      const isSearchMatch = item.service_name
        .toLowerCase()
        .includes(search.toLowerCase());

      return isDateMatch && isSearchMatch;
    });
    setFilteredData(filtered);
  };

  useEffect(() => {
    applyFilters(selectedDate, searchTerm);
  }, [selectedDate, searchTerm, servicesListData]);

  const handleRefreshData = () => {
    fetchServicesListData();
    fetchPromoListData();
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
          title={"Services Management"}
          subtitle={
            "Overview of Laundry Services with Custom Promotional Offers"
          }
        />
      </Box>

      {/* Sub Header */}
      <CustomServicesPromoList
        userDetails={userDetails}
        servicesPromoData={promoListData}
        refreshData={handleRefreshData}
      />

      {/* <Box
        display="flex"
        sx={{ width: "100%", gap: 2, flexWrap: { xs: "wrap", sm: "nowrap" } }}
      >
        <CustomerGrowthChart customerGrowthData={customerStatsData} />
      </Box> */}

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
            <CustomHeaderTitleTable title={"All Services Type"} />
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
              placeholder={"Search service name..."}
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
                setFilteredData(servicesListData);
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
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              justifyContent: "flex-end",
              gap: {
                xs: 0,
                sm: 1,
              },
              width: {
                xs: "100%",
                sm: "auto",
              },
              marginLeft: "auto",
            }}
          >
            <CustomAddButton
              disabled={!userDetails?.permissions?.canWrite}
              onClick={() => openPopup("addServices")}
              label={"Add new services"}
              icon={
                <PlusCircle size={24} color={COLORS.white} weight="duotone" />
              }
            />
          </Box>
        </Box>

        <Box>
          <CustomServicesManagementTable
            tableData={filteredData}
            loading={loading}
            refreshData={handleRefreshData}
            userDetails={userDetails}
          />
        </Box>
      </Box>

      {/* Popup */}
      {isOpen && popupType === "addServices" && (
        <PopAddNewServices
          open={isOpen}
          onClose={closePopup}
          refreshData={handleRefreshData}
        />
      )}
    </>
  );
};

export default SectionAdminServiceManagement;
