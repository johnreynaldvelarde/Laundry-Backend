import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Chip,
  Stack,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import { CalendarDots, PlusCircle } from "@phosphor-icons/react";
import PopupAssignUnit from "./PopupAssignUnit";
import ConfirmationDialog from "../../../../components/common/ConfirmationDialog";
import useFetchData from "../../../../hooks/common/useFetchData";
import { viewRequestInQueue, viewUnits } from "../../../../services/api/getApi";
import useAuth from "../../../../contexts/AuthContext";
import CustomPopHeaderTitle from "../../../../components/common/CustomPopHeaderTitle";
import { COLORS } from "../../../../constants/color";
import usePopup from "../../../../hooks/common/usePopup";
import CustomSearch from "../../../../components/common/table/filter/CustomSearch";
import PopAddInQueue from "./PopAddInQueue";
import CustomUnitsAvailable from "./import/CustomUnitsAvailable";
import CustomAddButton from "../../../../components/common/CustomAddButton";
import CustomOutlinedAddButton from "../../../../components/common/CustomOutlinedAddButton";
import CustomFilterCustomerType from "../../../../components/common/table/filter/CustomFilterCustomerType";
import CustomCustomerInQueue from "./import/CustomCustomerInQueue";
import { updateProgressInQueueAtStore } from "../../../../services/api/putApi";

const PopupInQueue = ({ open, onClose, refreshData }) => {
  const { userDetails } = useAuth();
  const { isOpen, popupType, openPopup, closePopup, popupData } = usePopup();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const { data: unitsData, fetchData: fetchUnits } = useFetchData();
  const { data: inQueueData, fetchData: fetchInQueue } = useFetchData();
  const { fetchData: fetchGenerateNumber } = useFetchData();

  const fetchUnitsData = useCallback(() => {
    setLoading(true);
    fetchUnits(viewUnits.getUnitsList, userDetails.storeId);
    setLoading(false);
  }, [fetchUnits, userDetails?.storeId]);

  const fetchInQueueData = useCallback(() => {
    setIsLoading(true);
    fetchInQueue(viewRequestInQueue.getRequestInQueue, userDetails.storeId);
    setIsLoading(false);
  }, [fetchInQueue, userDetails?.storeId]);

  const fetchInQueueGenerateData = useCallback(() => {
    setIsLoading(true);
    fetchGenerateNumber(
      updateProgressInQueueAtStore.putProgressInQueueAtStore,
      userDetails.storeId
    );
    setIsLoading(false);
  }, [fetchInQueue, userDetails?.storeId]);

  useEffect(() => {
    if (open) {
      fetchUnitsData();
      fetchInQueueData();

      const intervalId = setInterval(() => {
        fetchUnitsData();
        fetchInQueueData();
      }, 10000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [fetchUnitsData, fetchInQueueData, open]);

  const handleRefreshData = () => {
    refreshData();
    fetchUnitsData();
    fetchInQueueData();
  };

  const allUnitsAvailable =
    unitsData &&
    unitsData.length > 0 &&
    unitsData.every((unit) => unit.isUnitStatus === 1);

  useEffect(() => {
    if (inQueueData) {
      setFilteredData(inQueueData);
    }
  }, [inQueueData]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    applyFilters(selectedStatus, event.target.value);
  };

  const handleStatusChange = (event) => {
    const status = event.target.value;
    setSelectedStatus(status);
    applyFilters(status, searchTerm);
  };

  const applyFilters = (status, search) => {
    const filtered = inQueueData.filter((item) => {
      const isStatusMatch = status
        ? item.customer_type === status // Ensure status is checked against customer_type
        : true;

      const isSearchMatch =
        item.customer_fullname.toLowerCase().includes(search.toLowerCase()) ||
        item.tracking_code.toLowerCase().includes(search.toLowerCase()) ||
        (item.queue_number !== null &&
          item.queue_number.toString().includes(search.toLowerCase()));

      return isStatusMatch && isSearchMatch;
    });

    setFilteredData(filtered);
  };

  useEffect(() => {
    applyFilters(selectedStatus, searchTerm);
  }, [selectedStatus, searchTerm, inQueueData]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 16,
        },
      }}
    >
      {/* Header */}
      <CustomPopHeaderTitle
        title={"Queued Laundry"}
        subtitle={" Track laundry in queue and assign available units."}
        onClose={onClose}
      />

      <DialogTitle>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="space-between"
        >
          <Link to="/main/schedule" style={{ textDecoration: "none" }}>
            <CustomOutlinedAddButton
              onClick={() => openPopup("addInQueue")}
              label={"View Schedule Details"}
              icon={
                <CalendarDots
                  size={24}
                  color={COLORS.secondary}
                  weight="duotone"
                />
              }
            />
          </Link>

          <CustomAddButton
            onClick={() => openPopup("addInQueue")}
            label={"Add In Queue"}
            icon={
              <PlusCircle size={24} color={COLORS.white} weight="duotone" />
            }
            disabled={!allUnitsAvailable}
          />
        </Stack>
        <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
          <Typography
            variant="body1"
            fontWeight="bold"
            sx={{ color: COLORS.secondary }}
          >
            Laundry Units:
          </Typography>
          <Box sx={{ ml: 2, display: "flex", alignItems: "center", gap: 2 }}>
            <Chip
              label="Available"
              variant="outlined"
              sx={{
                borderColor: COLORS.success,
                backgroundColor: COLORS.pale_sucess,
                color: COLORS.success,
                fontSize: 15,
              }}
            />
            <Chip
              label="Occupied"
              variant="outlined"
              sx={{
                borderColor: COLORS.error,
                backgroundColor: COLORS.pale_error,
                color: COLORS.error,
                fontSize: 15,
              }}
            />
          </Box>
        </Box>

        <CustomUnitsAvailable unitsData={unitsData} loading={loading} />

        <Box sx={{ mt: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              gap: 2,
              mt: {
                xs: 2,
                sm: 0,
              },
              width: "100%",
            }}
          >
            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "auto",
                },
              }}
            >
              <CustomSearch
                searchTerm={searchTerm}
                handleSearchChange={handleSearchChange}
                placeholder={"Search name or tracking code or queue number ..."}
                customWidth={450}
              />
            </Box>

            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "auto",
                },
              }}
            >
              <CustomFilterCustomerType
                selectedStatus={selectedStatus}
                handleStatusChange={handleStatusChange}
              />
            </Box>

            {/* Clear Filters Button */}
            <Button
              variant="outlined"
              onClick={() => {
                setSearchTerm("");
                setSelectedStatus("");
                setFilteredData(inQueueData);
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
      </DialogTitle>

      {/* Sub Header 3 */}
      <DialogContent>
        <CustomCustomerInQueue
          customers={filteredData}
          loading={isLoading}
          refreshData={handleRefreshData}
        />
      </DialogContent>

      {isOpen && popupType === "addInQueue" && (
        <PopAddInQueue
          open={isOpen}
          onClose={closePopup}
          refreshData={handleRefreshData}
        />
      )}
    </Dialog>
  );
};

export default PopupInQueue;
