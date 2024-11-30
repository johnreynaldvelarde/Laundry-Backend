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
  getListUserByStore,
  viewAdminBasedStore,
  viewRolesAndPermissions,
} from "../../../../services/api/getApi";
import { parseISO } from "date-fns";
import { checkDateMatch } from "../../../../utils/method";
import CustomerGrowthChart from "../../../../components/common/chart/CustomerGrowthChart";
import PopAddNewCustomer from "../../Customers/components/PopAddNewCustomer";
import CustomUserTable from "../../../../components/common/table/CustomUserTable";
import A_PopupAddUser from "./A_PopupAddUser";
import useAuth from "../../../../contexts/AuthContext";

const SectionManagerUser = ({ storeId }) => {
  const { userDetails } = useAuth();
  const { isOpen, popupType, openPopup, closePopup, popupData } = usePopup();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const { data: userData, fetchData: fetchUserData } = useFetchData();
  const { data: roles, fetchData: fetchRoles } = useFetchData();
  const { data: stores, fetchData: fetchStores } = useFetchData();
  const [loading, setLoading] = useState(true);

  const fetchUserListData = useCallback(async () => {
    setLoading(true);
    const params = { userId: userDetails.userId };
    await fetchUserData(getListUserByStore.getAdminBasedUser, storeId, params);
    setLoading(false);
  }, [fetchUserData, storeId]);

  const fetchStoresData = useCallback(() => {
    fetchStores(viewAdminBasedStore.getAdminBasedStore, userDetails.storeId);
  }, [fetchStores, userDetails?.storeId]);

  const fetchRolesData = useCallback(() => {
    fetchRoles(
      viewRolesAndPermissions.getRoleAndPermission,
      userDetails.storeId
    );
  }, [fetchRoles, userDetails?.storeId]);

  useEffect(() => {
    fetchUserListData();
    fetchRolesData();
    fetchStoresData();
  }, [fetchUserListData, fetchStoresData, fetchRolesData]);

  useEffect(() => {
    if (userData) {
      setFilteredData(userData);
    }
  }, [userData]);

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
    const filtered = userData.filter((item) => {
      const requestDate = parseISO(item.date_created);
      const isDateMatch = dateOption
        ? checkDateMatch(dateOption, requestDate)
        : true;

      const isSearchMatch =
        item.full_name.toLowerCase().includes(search.toLowerCase()) ||
        item.username.toLowerCase().includes(search.toLowerCase());

      return isDateMatch && isSearchMatch;
    });
    setFilteredData(filtered);
  };

  useEffect(() => {
    applyFilters(selectedDate, searchTerm);
  }, [selectedDate, searchTerm, userData]);

  const handleRefreshData = () => {
    fetchUserListData();
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
          title={"User Management"}
          subtitle={"Overview of All User Accounts"}
        />
        <CustomAddButton
          onClick={() => openPopup("addUser")}
          label={"Add new user"}
          icon={<PlusCircle size={24} color={COLORS.white} weight="duotone" />}
        />
      </Box>

      {/* Sub Header */}
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
            <CustomHeaderTitleTable title={"All User"} />
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
          <CustomUserTable
            tableData={filteredData}
            loading={loading}
            refreshData={handleRefreshData}
            stores={stores}
            roles={roles}
            userDetails={userDetails}
          />
        </Box>
      </Box>

      {/* Popup */}
      {isOpen && popupType === "addUser" && (
        <A_PopupAddUser
          roleData={roles}
          storeData={stores}
          open={isOpen}
          onClose={closePopup}
          refreshData={handleRefreshData}
        />
      )}
    </>
  );
};

export default SectionManagerUser;
