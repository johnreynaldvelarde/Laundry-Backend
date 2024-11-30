import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useAuth from "../../../../contexts/AuthContext";
import {
  Divider,
  Typography,
  Button,
  Grid,
  Box,
  Paper,
  IconButton,
} from "@mui/material";
import {
  PlusCircle,
  MinusSquare,
  FolderUser,
  WashingMachine,
  Sliders,
} from "@phosphor-icons/react";
import PopupServiceType from "./PopupServiceType";
import { getServiceTypeAndStore } from "../../../../services/api/getApi";
import ConfirmationDialog from "../../../../components/common/ConfirmationDialog";
import { updateDeleteServiceType } from "../../../../services/api/putApi";
import { COLORS } from "../../../../constants/color";

const ServiceType = () => {
  const { userDetails } = useAuth();
  const [storeData, setStoreData] = useState([]);
  const [allServiceTypes, setAllServiceTypes] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [editServiceData, setEditServiceData] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchServiceType = async () => {
    if (!userDetails?.storeId) return;

    try {
      const response = await getServiceTypeAndStore.getServiceType(
        userDetails.storeId
      );
      if (response) {
        const stores = response.stores || [];
        const serviceTypes = response.serviceTypes || [];

        setStoreData(stores);
        setAllServiceTypes(serviceTypes);

        if (stores.length > 0) {
          setSelectedStoreId(stores[0].id);
          setServiceTypes(
            serviceTypes.filter((service) => service.store_id === stores[0].id)
          );
        } else {
          setServiceTypes(serviceTypes);
        }
      } else {
        console.error("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchServiceType();
  }, [userDetails?.storeId]);

  const refreshData = () => {
    fetchServiceType();
  };

  const handleStoreSelect = (storeId) => {
    setSelectedStoreId(storeId);
    setServiceTypes(
      allServiceTypes.filter((service) => service.store_id === storeId)
    );
  };

  const handleAddService = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleEditService = (service) => {
    setEditServiceData(service);
    setOpenEditPopup(true);
  };

  const handleCloseEditPopup = () => {
    setOpenEditPopup(false);
    setEditServiceData(null);
  };

  const handleDialogDelete = (id) => {
    setSelectedServiceId(id);
    setDialogOpen(true);
  };

  const handleDeleteService = async (id) => {
    if (id) {
      try {
        const response = await updateDeleteServiceType.putDeleteServiceType(id);
        if (response.success) {
          toast.success(response.message);
          refreshData();
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error(`Error: ${error.message || "Something went wrong"}`);
      }
    } else {
      toast.error("Error Action!!!");
    }
  };

  return (
    <Box
      sx={{
        p: {
          xs: 1,
          sm: 2,
          md: 3,
          lg: 4,
          xl: 5,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h5" gutterBottom>
            Service Types
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8, pb: 2 }}>
            Configure your laundry service types and default prices.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={
            <Sliders size={24} color={COLORS.white} weight="duotone" />
          }
          sx={{
            backgroundColor: COLORS.error,
            borderRadius: "5px",
            fontWeight: 600,
            textTransform: "none",
            paddingLeft: "23px",
            paddingRight: "23px",
            fontSize: "16px",
            "&:hover": {
              backgroundColor: COLORS.errorHover,
            },
          }}
        >
          Promo Configuration
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Conditionally show the list of stores if storeData is available */}
      {storeData.length > 0 && (
        <Box
          className="hori-scrollable"
          sx={{ overflowX: "auto", mb: 4, mt: 2, paddingBottom: 1 }}
        >
          <Box sx={{ display: "inline-flex", gap: 2 }}>
            {storeData.map((store) => (
              <Paper
                key={store.id}
                onClick={() => handleStoreSelect(store.id)}
                sx={{
                  p: 2,
                  minWidth: "120px",
                  cursor: "pointer",
                  borderRadius: "8px",
                  border: `1px solid`,
                  borderColor:
                    selectedStoreId === store.id
                      ? "#5787C8"
                      : (theme) => theme.palette.divider,
                  backgroundColor:
                    selectedStoreId === store.id ? "#ECF1F8" : "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  whiteSpace: "normal",
                  overflow: "hidden",
                  boxShadow: "none",
                }}
              >
                <WashingMachine
                  size={30}
                  color={COLORS.secondary}
                  weight="duotone"
                  className="mr-1"
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    textAlign: "center",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color:
                      selectedStoreId === store.id
                        ? COLORS.secondary
                        : "inherit",
                  }}
                >
                  {store.store_name}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      )}

      {/* Service List */}
      <Grid container spacing={2}>
        {serviceTypes.map((service) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={service.id}>
            <Paper
              sx={{
                boxShadow: "none",
                borderRadius: "12px",
                border: `1px solid ${COLORS.border2}`,
                p: { xs: 1.5, sm: 2, md: 3 },
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color: COLORS.primary,
                  fontWeight: 700,
                  fontSize: {
                    xs: "1.2rem",
                    sm: "1.15rem",
                    md: "1.4rem",
                    lg: "1.5rem",
                  }, // Responsive font size
                  wordBreak: "break-word",
                }}
              >
                {service.service_name}
              </Typography>
              <Typography
                variant="caption"
                gutterBottom
                sx={{
                  color: COLORS.subtitle,
                  fontWeight: 500,
                  fontSize: {
                    xs: "0.9rem",
                    sm: "1rem",
                  },
                  wordBreak: "break-word",
                }}
              >
                <span
                  style={{
                    color: COLORS.secondary,
                    marginRight: 5,
                    fontWeight: 600,
                  }}
                >
                  Description:
                </span>
                <span style={{ color: COLORS.subtitle, fontWeight: 400 }}>
                  {service.description}
                </span>
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: COLORS.subtitle,
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  wordBreak: "break-word",
                }}
              >
                <span
                  style={{
                    color: COLORS.secondary,
                    marginRight: 5,
                    fontWeight: 600,
                  }}
                >
                  Price:
                </span>
                <span style={{ color: COLORS.subtitle, fontWeight: 600 }}>
                  PHP {service.default_price}
                </span>
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {(service.isActive === null || service.isActive) && (
                  <Button
                    onClick={() => handleEditService(service)}
                    variant="outlined"
                    size="small"
                    sx={{
                      textDecoration: "none",
                      padding: "6px 12px",
                      borderColor: "primary.main",
                      color: "primary.main",
                      "&:hover": {
                        borderColor: "primary.dark",
                        backgroundColor: "primary.light",
                      },
                    }}
                  >
                    Edit
                  </Button>
                )}
                <Button
                  onClick={() => handleEditService(service)}
                  variant="outlined"
                  size="small"
                >
                  Edit
                </Button>
                <IconButton onClick={() => handleDialogDelete(service.id)}>
                  <MinusSquare
                    size={20}
                    color={COLORS.error}
                    weight="duotone"
                  />
                </IconButton>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Add New Service Button */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button
          variant="contained"
          startIcon={
            <PlusCircle size={24} color={COLORS.white} weight="duotone" />
          }
          sx={{
            backgroundColor: COLORS.secondary,
            borderRadius: "5px",
            fontWeight: 600,
            textTransform: "none",
            paddingLeft: "23px",
            paddingRight: "23px",
            fontSize: "16px",
            "&:hover": {
              backgroundColor: COLORS.secondaryHover,
            },
          }}
          onClick={handleAddService}
        >
          Add new service
        </Button>
      </Box>
      <PopupServiceType
        open={openPopup}
        onClose={handleClosePopup}
        storeId={selectedStoreId}
        onSuccess={refreshData}
      />
      {editServiceData && (
        <PopupServiceType
          open={openEditPopup}
          onClose={handleCloseEditPopup}
          storeId={selectedStoreId}
          serviceData={editServiceData}
          onSuccess={refreshData}
        />
      )}

      <ConfirmationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleDeleteService}
        itemId={selectedServiceId}
      />
    </Box>
  );
};

export default ServiceType;
