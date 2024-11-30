import React, { useCallback, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Box,
  Button,
  Drawer,
  Divider,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import nodata from "../../../../assets/images/no_data_all.jpg";
import styles from "../../../../styles/style";
import { MinusSquare } from "@phosphor-icons/react";
import CloseIcon from "@mui/icons-material/Close";
import ConfirmationDialog from "../../../../components/common/ConfirmationDialog";
import usePopup from "../../../../hooks/common/usePopup";
import PopCompleteInLaundry from "./PopCompleteInLaundry";
import useUnitMonitor from "../../../../hooks/admin/useUnitMonitor";
import useFetchData from "../../../../hooks/common/useFetchData";
import { getAssignmentInProgress } from "../../../../services/api/getApi";
import useAuth from "../../../../contexts/AuthContext";
import { COLORS } from "../../../../constants/color";
import PopOnlineTransaction from "./PopOnlineTransaction";
import PopWalkInTransaction from "./PopWalkInTransaction";

const DrawerInLaundry = ({ open, onClose, refreshData }) => {
  const { userDetails } = useAuth();
  const [loading, setLoading] = useState(false);
  const { isOpen, popupType, popupData, openPopup, closePopup } = usePopup();
  const {
    selectedProgressID,
    dialogProgressOpen,
    setDialogProgressOpen,
    handleDialogRemoveInProgress,
    handleConfirmRemoveInProgress,
  } = useUnitMonitor(refreshData);

  const { data: inProgressData, fetchData: fetchInprogress } = useFetchData();

  const fetchInprogressData = useCallback(() => {
    fetchInprogress(getAssignmentInProgress.getInProgress, userDetails.storeId);
  }, [fetchInprogress, userDetails?.storeId]);

  useEffect(() => {
    if (open) {
      fetchInprogressData();

      const intervalId = setInterval(() => {
        fetchInprogressData();
      }, 2000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [fetchInprogressData, open]);

  const handleRefreshData = () => {
    refreshData();
    fetchInprogressData;
  };

  return (
    <>
      <Drawer anchor="right" open={open} onClose={() => onClose()}>
        <Box
          sx={{
            width: 450,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* Top Row - Title and Close Button */}
          <Box
            sx={{
              display: "flex",
              padding: 2,
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#fff",
            }}
          >
            <span
              className="text-xl font-bold"
              style={{ color: COLORS.secondary }}
            >
              In Progress Laundry
            </span>
            <IconButton
              onClick={() => onClose()}
              sx={{ color: "#5787C8", "&:hover": { color: "#5787C8" } }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              padding: 2,
              height: "100%",
            }}
          >
            {inProgressData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full border border-gray-300 rounded-lg shadow-sm">
                <img src={nodata} alt="No Data" className="w-32 h-32 mb-4" />
                <p
                  className="text-base font-semibold"
                  style={{ color: styles.textColor2 }}
                >
                  No data available at the moment
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {inProgressData.map((customer) => (
                  <Paper
                    key={customer.id}
                    sx={{
                      boxShadow: "none !important",
                      borderRadius: "10px",
                      borderStyle: "solid",
                      borderWidth: "1px",
                      borderColor: COLORS.border,
                    }}
                    className="flex flex-col justify-between"
                  >
                    {/* First Row: Customer Details */}
                    <div className="flex-1 mr-4 truncate p-5 flex justify-between items-center">
                      <div className="flex-1">
                        <div
                          className="font-normal"
                          style={{ color: COLORS.primary, fontSize: 13 }}
                        >
                          Customer Name:
                        </div>
                        <div
                          className="font-bold truncate mb-2"
                          style={{ color: COLORS.text, fontSize: 18 }}
                        >
                          {customer.customer_fullname}
                        </div>
                        <div
                          className="font-normal"
                          style={{ color: COLORS.primary, fontSize: 13 }}
                        >
                          Service Name:
                        </div>
                        <div
                          className="font-bold truncate mb-2"
                          style={{ color: COLORS.secondary, fontSize: 18 }}
                        >
                          {customer.service_name}
                        </div>
                        <div
                          className="font-normal"
                          style={{ color: COLORS.primary, fontSize: 13 }}
                        >
                          Assign Unit:
                        </div>
                        <div
                          className="font-bold truncate mb-2"
                          style={{ color: COLORS.primary, fontSize: 18 }}
                        >
                          {customer.unit_name}
                        </div>
                      </div>

                      {/* Circle on the right edge with date */}

                      <div
                        className="flex flex-col items-center justify-center "
                        style={{
                          borderColor: COLORS.secondary,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginLeft: "10px",
                          color: COLORS.primary,
                        }}
                      >
                        <span
                          className="text-[13px] font-bold text-center flex items-center justify-center"
                          style={{ color: COLORS.text }}
                        >
                          {formatDistanceToNow(new Date(customer.assigned_at))}
                        </span>
                        <span
                          className="text-[12px] font-semibold mt-1"
                          style={{ color: COLORS.secondary }}
                        >
                          In Progress
                        </span>
                      </div>
                    </div>

                    <Divider sx={{ margin: 0, width: "100%" }} />

                    {/* Second Row: Buttons */}
                    <div className="flex justify-between items-center mt-2 p-2">
                      <Typography
                        variant="body2"
                        sx={{
                          color: COLORS.primary,
                          fontWeight: 400,
                        }}
                      >
                        Customer Type:
                        <span
                          className="ml-2"
                          style={{
                            color:
                              customer.customer_type === "Online"
                                ? COLORS.success
                                : COLORS.error,
                            fontWeight: 600,
                          }}
                        >
                          {customer.customer_type}
                        </span>
                      </Typography>
                      <div className="flex gap-2 mb-1">
                        <Button
                          variant="contained"
                          disableElevation
                          color="primary"
                          size="small"
                          onClick={() => {
                            if (customer.customer_type === "Online") {
                              openPopup("Online", customer);
                            } else if (customer.customer_type === "Walk-In") {
                              openPopup("Walk-In", customer);
                            }
                          }}
                          disabled={loading}
                          sx={{
                            backgroundColor: "#5787C8",
                            borderRadius: "5px",
                            fontWeight: 600,
                            textTransform: "none",
                            "&:hover": {
                              backgroundColor: "#3A5A85",
                            },
                          }}
                        >
                          {loading ? (
                            <CircularProgress
                              size={20}
                              sx={{ color: COLORS.white }}
                            />
                          ) : (
                            "Create Billing"
                          )}
                        </Button>
                        {/* <IconButton
                          onClick={() =>
                            handleDialogRemoveInProgress(customer.id)
                          }
                        >
                          <MinusSquare
                            size={20}
                            color="#DB524B"
                            weight="duotone"
                          />
                        </IconButton> */}
                      </div>
                    </div>
                  </Paper>
                ))}
              </ul>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* Popup */}
      {isOpen && popupType === "completeInLaundry" && (
        <PopCompleteInLaundry
          open={isOpen}
          onClose={closePopup}
          data={popupData}
        />
      )}

      {isOpen && popupType === "Online" && (
        <PopOnlineTransaction
          open={isOpen}
          onClose={closePopup}
          data={popupData}
          refreshData={handleRefreshData}
        />
      )}
      {isOpen && popupType === "Walk-In" && (
        <PopWalkInTransaction
          open={isOpen}
          onClose={closePopup}
          data={popupData}
          refreshData={handleRefreshData}
        />
      )}

      <ConfirmationDialog
        open={dialogProgressOpen}
        onClose={() => setDialogProgressOpen(false)}
        onConfirm={handleConfirmRemoveInProgress}
        itemId={selectedProgressID}
      />
    </>
  );
};

export default DrawerInLaundry;
