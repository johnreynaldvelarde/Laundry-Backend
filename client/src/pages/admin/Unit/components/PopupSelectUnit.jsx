import React, { useState, useEffect, useCallback } from "react";
import useAuth from "../../../../contexts/AuthContext";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  InputLabel,
  Button,
  Typography,
  Autocomplete,
  TextField,
  Box,
  Collapse,
  IconButton,
  FormControl,
  Chip,
  Select,
  MenuItem,
} from "@mui/material";
import { createFilterOptions } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  getInventoryLaundryItem,
  getSelectedCustomer,
  getServiceType,
} from "../../../../services/api/getApi";
import { createWalkInServiceRequest } from "../../../../services/api/postApi";
import CustomPopFooterButton from "../../../../components/common/CustomPopFooterButton";
import useFetchData from "../../../../hooks/common/useFetchData";
import { COLORS } from "../../../../constants/color";

const PopupSelectUnit = ({ open, onClose, unitName, unitId, refreshData }) => {
  const { userDetails } = useAuth();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [selectedTabId, setSelectedTabId] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [selectedSupplies, setSelectedSupplies] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [quantityErrors, setQuantityErrors] = useState({});

  const { data: itemData, fetchData: fetchItem } = useFetchData();
  const { data: customerData, fetchData: fetchSelectedCustomer } =
    useFetchData();
  const { data: serviceData, fetchData: fetchServiceType } = useFetchData();

  const fetchItemData = useCallback(() => {
    fetchItem(getInventoryLaundryItem.getInventoryItem, userDetails.storeId);
  }, [fetchItem, userDetails?.storeId]);

  const fetchSelectedCustomerData = useCallback(() => {
    fetchSelectedCustomer(
      getSelectedCustomer.getSelectCustomer,
      userDetails.storeId
    );
  }, [fetchSelectedCustomer, userDetails?.storeId]);

  const fetchServiceTypeData = useCallback(() => {
    fetchServiceType(getServiceType.getService, userDetails.storeId);
  }, [fetchServiceType, userDetails?.storeId]);

  useEffect(() => {
    if (open) {
      fetchItemData();
      fetchSelectedCustomerData();
      fetchServiceTypeData();
    }
  }, [open, fetchItemData, fetchSelectedCustomerData, fetchServiceTypeData]);

  const handleSupplySelect = (event) => {
    setSelectedSupplies(event.target.value);
  };

  const handleQuantityChange = (supplyId, quantity) => {
    const supply = itemData.find((s) => s.inventory_id === supplyId);

    if (quantity > supply.quantity) {
      setQuantityErrors((prev) => ({
        ...prev,
        [supplyId]: `Quantity cannot exceed available amount (${supply.quantity})`,
      }));
    } else {
      setQuantityErrors((prev) => ({
        ...prev,
        [supplyId]: "",
      }));
    }

    setQuantities((prev) => ({
      ...prev,
      [supplyId]: quantity,
    }));
  };

  const handleAdditionalInfoToggle = () => {
    setShowAdditionalInfo((prev) => !prev);
  };

  const handleTabChange = (id) => {
    setSelectedTabId(id);
  };

  const validateFields = () => {
    const newErrors = {};
    if (!selectedCustomer) {
      newErrors.selectedCustomer = "Customer is required";
    }
    if (!weight) {
      newErrors.weight = "Load is required";
    } else if (weight <= 0) {
      newErrors.weight = "Load must be greater than 0";
    }
    return newErrors;
  };

  const filterOptions = createFilterOptions({
    matchFrom: "any", // This will match from any part of the string (name or username)
    stringify: (option) => `${option.fullname} ${option.username}`,
  });

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;

    if (field === "selectedCustomer") {
      setSelectedCustomer(value);
    } else if (field === "weight") {
      setWeight(value);
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };

  const handleProceedSelectedUnit = async (e) => {
    e.preventDefault();

    const newErrors = validateFields();
    setErrors(newErrors);

    if (!selectedTabId) {
      toast.error("Select a service to proceed.");
      return;
    }

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);

      const suppliesData = selectedSupplies.map((supplyId) => {
        const supply = itemData.find((s) => s.inventory_id === supplyId);
        const quantity = quantities[supplyId] || 1;
        const totalAmount = (supply.price * quantity).toFixed(2);

        return {
          supplyId,
          quantity,
          amount: totalAmount,
        };
      });

      const data = {
        customerId: selectedCustomer.id,
        userId: userDetails.userId,
        unitId: unitId,
        serviceId: selectedTabId,
        fullname: selectedCustomer.fullname,
        weight: weight,
        customerNotes: notes,
        supplies: suppliesData,
      };

      try {
        const response = await createWalkInServiceRequest.setWalkInRequest(
          userDetails.storeId,
          data
        );

        if (response.success) {
          toast.success(response.message);
          refreshData();
          onClose();

          setSelectedCustomer(null);
          setSelectedTabId(null);
          setWeight("");
          setSelectedSupplies([]);
          setQuantities({});
          setQuantityErrors({});
          setErrors({});
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error("Error:", error);
      } finally {
        setLoading(false);
      }
    } else {
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
      <DialogTitle className="flex flex-col">
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold">Selected Unit</span>
            <span className="text-sm font-semibold border border-[#5787C8] rounded px-2 py-1 text-[#5787C8]">
              {unitName}
            </span>
          </div>
          <IconButton
            onClick={onClose}
            className="text-[#5787C8] hover:text-[#5787C8]"
          >
            <CloseIcon />
          </IconButton>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Select a service and choose a customer.
        </p>
      </DialogTitle>
      <DialogContent
        sx={{
          overflowY: "auto",
          "&::-webkit-scrollbar": { width: "8px" },
          "&::-webkit-scrollbar-track": { backgroundColor: "#f1f1f1" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "#555" },
        }}
      >
        {/* Custom Tab Navigation */}
        <div className="mt-2 mb-2 flex justify-start bg-[#5787C8] rounded-md hori-scrollable p-2">
          <div className="flex flex-nowrap">
            {serviceData.map((service) => (
              <button
                key={service.id}
                onClick={() => handleTabChange(service.id)}
                className={`whitespace-nowrap px-4 py-2 mx-1.5 font-bold text-sm rounded-full transition-colors duration-200 ${
                  selectedTabId === service.id
                    ? "bg-white text-[#5787C8]"
                    : "bg-transparent text-white hover:bg-[#4a6b9c]"
                }`}
              >
                {service.service_name}
              </button>
            ))}
          </div>
        </div>
        {/* Customer Selection Autocomplete */}
        <FormControl
          fullWidth
          margin="normal"
          error={!!errors.selectedCustomer}
        >
          <Autocomplete
            options={customerData}
            getOptionLabel={(option) => option.fullname} // Only display the name in the dropdown
            value={selectedCustomer}
            onChange={(event, newValue) => setSelectedCustomer(newValue)}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            filterOptions={filterOptions} // Use the custom filterOptions to search by name and username
            renderOption={(props, option) => {
              const today = new Date();
              const createdDate = new Date(option.date_created);
              const diffDays = Math.ceil(
                (today - createdDate) / (1000 * 60 * 60 * 24)
              );

              return (
                <li
                  {...props}
                  key={option.id}
                  style={{
                    display: "flex",
                    flexDirection: "column", // Stack name and username vertically
                    justifyContent: "center",
                    alignItems: "flex-start",
                    padding: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontWeight: "bold",
                      }}
                    >
                      {option.fullname}
                    </span>
                    {diffDays <= 3 && (
                      <Chip
                        label="New"
                        variant="outlined"
                        size="small"
                        sx={{
                          color: "red",
                          borderColor: "red",
                          marginLeft: 2,
                        }}
                      />
                    )}
                  </div>
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      color: "gray",
                      fontSize: "smaller",
                    }}
                  >
                    {option.username}
                  </span>
                </li>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Customer"
                variant="outlined"
                placeholder="Search for a customer"
                error={!!errors.selectedCustomer}
              />
            )}
          />
          {errors.selectedCustomer && (
            <Typography
              variant="caption"
              color="error"
              sx={{ marginTop: "3px", marginLeft: "5px" }}
            >
              {errors.selectedCustomer}
            </Typography>
          )}
        </FormControl>

        {/* Weight Input */}
        <FormControl fullWidth margin="normal" error={!!errors.weight}>
          <TextField
            label="Load"
            variant="outlined"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter a load"
            error={!!errors.weight}
          />
          {errors.weight && (
            <Typography
              variant="caption"
              color="error"
              sx={{ marginTop: "3px", marginLeft: "5px" }}
            >
              {errors.weight}
            </Typography>
          )}
        </FormControl>

        {/* Select Item for this Transaction */}
        <FormControl fullWidth variant="outlined" sx={{ marginTop: "20px" }}>
          <InputLabel>Select Laundry Items</InputLabel>
          <Select
            label="Select Laundry Items"
            multiple
            value={selectedSupplies}
            onChange={handleSupplySelect}
            renderValue={(selected) =>
              selected.map((supplyId) => {
                const supply = itemData.find(
                  (s) => s.inventory_id === supplyId
                );
                return (
                  <Chip
                    key={supplyId}
                    label={supply ? supply.item_name : ""}
                    sx={{ margin: "5px" }}
                  />
                );
              })
            }
          >
            {itemData.map((supply) => (
              <MenuItem key={supply.inventory_id} value={supply.inventory_id}>
                {`${supply.item_name} (Available: ${supply.quantity})`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedSupplies.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            {selectedSupplies.map((supplyId) => {
              const supply = itemData.find((s) => s.inventory_id === supplyId);
              const quantity = quantities[supplyId] || 1; // Default quantity is 1
              const totalPrice = (supply.price * quantity).toFixed(2); // Calculate total price

              return (
                <div key={supplyId} style={{ marginBottom: "10px" }}>
                  <Typography variant="body2">
                    {supply.item_name} Quantity:
                  </Typography>
                  <TextField
                    type="number"
                    fullWidth
                    value={quantity}
                    onChange={(e) =>
                      handleQuantityChange(supplyId, parseInt(e.target.value))
                    }
                    inputProps={{ min: 1, max: supply.quantity }} // Set max to available quantity
                    error={Boolean(quantityErrors[supplyId])}
                    helperText={quantityErrors[supplyId]}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      marginTop: "5px",
                      color: COLORS.primary,
                      fontWeight: 500,
                    }}
                  >
                    Total Price: ₱{totalPrice}
                  </Typography>
                </div>
              );
            })}
          </div>
        )}

        {/* Additional Info Toggle */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          marginTop={3}
        >
          <Typography
            variant="body1"
            sx={{ color: COLORS.primary, fontWeight: 700 }}
          >
            Additional Info
          </Typography>
          <Button
            onClick={handleAdditionalInfoToggle}
            sx={{
              textTransform: "none",
              border: 1,
              borderColor: COLORS.secondary,
            }}
          >
            {showAdditionalInfo ? "Hide" : "Show"}
          </Button>
        </Box>
        {/* Additional Info Text Field (Collapsible) */}
        <Collapse in={showAdditionalInfo}>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Notes"
              multiline
              rows={4}
              variant="outlined"
              placeholder="Enter additional details here"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </FormControl>
        </Collapse>
      </DialogContent>
      {/* Footer */}
      <CustomPopFooterButton
        label={"Proceed"}
        onClose={onClose}
        onSubmit={handleProceedSelectedUnit}
        loading={loading}
      />
    </Dialog>
  );
};

export default PopupSelectUnit;
