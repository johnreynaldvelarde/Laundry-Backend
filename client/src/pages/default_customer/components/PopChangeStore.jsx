import React, { useCallback, useEffect, useState } from "react";
import { Dialog, DialogContent, Box, Typography, Paper } from "@mui/material";
import toast from "react-hot-toast";
import CustomPopHeaderTitle from "../../../components/common/CustomPopHeaderTitle";
import CustomPopFooterButton from "../../../components/common/CustomPopFooterButton";
import { COLORS } from "../../../constants/color";
import { updateCustomerChangeStore } from "../../../services/api/customerApi";
import { viewStore } from "../../../services/api/getApi";
import { calculateDistance } from "../../../utils/method";
import { handleUpdateChangeStore } from "../../../../../server/src/services/user/customer";
import usePopup from "../../../hooks/common/usePopup";
import RemindConfirmationDialog from "../../../components/common/RemindConfirmationDialog";

const PopChangeStore = ({ open, onClose, userDetails, logout }) => {
  const { isOpen, popupType, openPopup, closePopup, popupData } = usePopup();
  const [storeData, setStoreData] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [latitude, setLatitude] = useState(userDetails.address.latitude);
  const [longitude, setLongitude] = useState(userDetails.address.longitude);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchStoreData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await viewStore.getStoreList();
      const storeList = response.data
        .map((store) => {
          const storeLat = parseFloat(store.latitude);
          const storeLon = parseFloat(store.longitude);

          if (isNaN(storeLat) || isNaN(storeLon)) {
            console.error(
              "Invalid store coordinates:",
              store.latitude,
              store.longitude
            );
            return null;
          }

          const distance = calculateDistance(
            parseFloat(latitude),
            parseFloat(longitude),
            storeLat,
            storeLon
          );

          return { ...store, distance };
        })
        .filter((store) => store !== null);

      storeList.sort((a, b) => a.distance - b.distance);
      setStoreData(storeList);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    fetchStoreData();
  }, [fetchStoreData]);

  useEffect(() => {
    if (userDetails.storeId) {
      const store = storeData.find((store) => store.id === userDetails.storeId);
      setSelectedStore(store);
    }
  }, [userDetails.storeId, storeData]);

  const handleStoreSelection = (store) => {
    setSelectedStore(store);
  };

  const handleSave = async () => {
    if (!selectedStore) {
      toast.error("Please select a store.");
      return;
    }

    setLoading(true);

    const storeData = { store_id: selectedStore.id };
    try {
      const response = await updateCustomerChangeStore.putUpdateChangeStore(
        userDetails.userId,
        storeData
      );
      if (response.success) {
        toast.success(response.message);
        logout();
        onClose();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(`Error with service request: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 16,
        },
      }}
    >
      {/* Header */}
      <CustomPopHeaderTitle
        title={"Change Store"}
        subtitle={"Choose a new laundry store"}
        onClose={onClose}
      />

      <DialogContent>
        <Box sx={{ maxHeight: 400, overflowY: "auto", width: "100%" }}>
          {storeData.length === 0 ? (
            <Typography
              sx={{
                textAlign: "center",
                fontSize: 16,
                fontWeight: 500,
                color: COLORS.text,
                padding: 5,
                marginBottom: 2,
              }}
            >
              Not Available
            </Typography>
          ) : storeData.length === 1 ? (
            <Typography
              sx={{
                textAlign: "center",
                fontSize: 16,
                fontWeight: 500,
                color: COLORS.secondary,
                padding: 5,
                marginBottom: 2,
              }}
            >
              Option is not available
            </Typography>
          ) : (
            storeData.map((store) => (
              <Paper
                key={store.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 1,
                  padding: 2,
                  borderRadius: "8px",
                  borderColor: COLORS.border,
                  borderWidth: 1,
                  bgcolor:
                    selectedStore?.id === store.id
                      ? COLORS.secondary
                      : "gray.200",
                  color:
                    selectedStore?.id === store.id ? "white" : "text.primary",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease-in-out",
                  "&:hover": {
                    bgcolor: "gray.300",
                  },
                }}
                onClick={() => handleStoreSelection(store)}
                variant="outlined"
              >
                <Box>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      color:
                        selectedStore?.id === store.id ? "white" : COLORS.text,
                    }}
                  >
                    {store.store_name}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: 13,
                      color:
                        selectedStore?.id === store.id ? "white" : COLORS.text,
                    }}
                  >
                    {store.province && store.city
                      ? `${store.province}, ${store.city}`
                      : store.province || store.city}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: 12,
                      color:
                        selectedStore?.id === store.id ? "white" : COLORS.text,
                    }}
                  >
                    {store.address_line}
                  </Typography>
                </Box>
                {store.distance && (
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "semibold",
                      color:
                        selectedStore?.id === store.id
                          ? "white"
                          : store.distance >= 5
                          ? COLORS.error
                          : COLORS.success,
                    }}
                  >
                    {store.distance} km
                  </Typography>
                )}
              </Paper>
            ))
          )}
        </Box>
      </DialogContent>

      {/* Footer */}
      {storeData.length !== 1 && (
        <CustomPopFooterButton
          label={"Update"}
          onClose={onClose}
          loading={loading}
          onSubmit={() => openPopup("reminder")}
        />
      )}

      {isOpen && popupType === "reminder" && (
        <RemindConfirmationDialog
          open={isOpen}
          onClose={closePopup}
          id={popupData}
          onConfirm={handleSave}
        />
      )}
    </Dialog>
  );
};

export default PopChangeStore;
