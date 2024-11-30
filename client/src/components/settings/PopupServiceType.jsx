import React, { useState } from "react";
import useAuth from "../../contexts/AuthContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";
import { createNewServiceType } from "../../services/api/postApi";

const PopupServiceType = ({ open, onClose }) => {
  const { userDetails } = useAuth();
  const [serviceName, setServiceName] = useState("");
  const [defaultPrice, setDefaultPrice] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateFields = () => {
    const newErrors = {};
    if (!serviceName) {
      newErrors.serviceName = "Service name is required";
    }
    if (!defaultPrice) {
      newErrors.defaultPrice = "Price is required";
    } else if (defaultPrice <= 0) {
      newErrors.defaultPrice = "Price must be greater than 0";
    }
    return newErrors;
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;

    if (field === "serviceName") {
      setServiceName(value);
    } else if (field === "defaultPrice") {
      setDefaultPrice(value);
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };

  const handleSave = async () => {
    const newErrors = validateFields();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);

      setTimeout(async () => {
        const data = {
          store_id: userDetails.storeId,
          service_name: serviceName,
          default_price: defaultPrice,
        };

        try {
          const response = await createNewServiceType.setServiceType(data);

          if (response.success) {
            toast.success(response.message);
            setServiceName("");
            setDefaultPrice("");
            setErrors({});
            onClose();
          } else {
            setErrors((prevErrors) => ({
              ...prevErrors,
              serviceName: response.message,
            }));
          }
        } catch (error) {
          if (error.response && error.response.data) {
            toast.error(error.response.data.message);
          } else {
            toast.error(
              "An unexpected error occurred while creating the service type."
            );
          }
        } finally {
          setLoading(false);
        }
      }, 500);
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
            <span className="text-lg font-semibold">Add Service</span>
          </div>
          <IconButton
            onClick={onClose}
            className="text-[#5787C8] hover:text-[#5787C8]"
          >
            <CloseIcon />
          </IconButton>
        </div>
        <Typography variant="body2" color="textSecondary" className="mt-1">
          Enter service details below.
        </Typography>
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Service Name"
          type="text"
          fullWidth
          variant="outlined"
          value={serviceName}
          onChange={handleInputChange("serviceName")}
          error={Boolean(errors.serviceName)}
          helperText={errors.serviceName}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Price"
          type="number"
          fullWidth
          variant="outlined"
          value={defaultPrice}
          onChange={handleInputChange("defaultPrice")}
          error={Boolean(errors.defaultPrice)}
          helperText={errors.defaultPrice}
        />
      </DialogContent>
      <DialogActions className="flex justify-end space-x-1 mb-1 mr-2">
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            marginRight: 1,
            borderColor: "#595959",
            borderRadius: "5px",
            fontWeight: 500,
            textTransform: "none",
            color: "#595959",
            "&:hover": {
              borderColor: "#595959",
              backgroundColor: "rgba(144, 144, 144, 0.1)",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disableElevation
          onClick={handleSave}
          sx={{
            backgroundColor: "#5787C8",
            borderRadius: "5px",
            fontWeight: 500,
            minWidth: "90px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#3A5A85",
            },
          }}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PopupServiceType;

// const handleSave = async () => {
//   const newErrors = validateFields();
//   setErrors(newErrors);

//   if (Object.keys(newErrors).length === 0) {
//     setLoading(true);
//     console.log("Saving started, loading:", loading);
//     const data = {
//       store_id: userDetails.storeId,
//       service_name: serviceName,
//       default_price: defaultPrice,
//     };

//     try {
//       const response = await createNewServiceType.setServiceType(data);

//       if (!response.success) {
//         toast.success(response.message);
//         onClose();
//       } else {
//         toast.error("Failed to create service type.");
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 400) {
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           serviceName: error.response.data.message,
//         }));
//       } else {
//         toast.error("An error occurred while creating the service type.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   }
// };

// import React, { useState, useEffect } from "react";
// import useAuth from "../../contexts/AuthContext";
// import toast from "react-hot-toast";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   IconButton,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import {} from "../../services/api/postApi";

// const PopupServiceType = ({ open, onClose, unitName }) => {
//   const { userDetails } = useAuth();
//   const [serviceName, setServiceName] = useState("");
//   const [defaultPrice, setDefaultPrice] = useState("");
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   const validateFields = () => {
//     const newErrors = {};
//     if (!serviceName) {
//       newErrors.serviceName = "Services name is required";
//     }
//     if (!defaultPrice) {
//       newErrors.defaultPrice = "Price is required";
//     } else if (defaultPrice <= 0) {
//       newErrors.defaultPrice = "Price must be greater than 0";
//     }
//     return newErrors;
//   };

//   const handleInputChange = (field) => (e) => {
//     const value = e.target.value;

//     if (field === "serviceName") {
//       setServiceName(value);
//     } else if (field === "defaultPrice") {
//       setDefaultPrice(value);
//     }

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [field]: "",
//     }));
//   };

//   const handleProceedSelectedUnit = async (e) => {
//     e.preventDefault();

//     const newErrors = validateFields();
//     setErrors(newErrors);

//     if (Object.keys(newErrors).length === 0) {
//       setLoading(true);
//       const data = {
//         customerId: selectedCustomer.id,
//         userId: userDetails.userId,
//         unitId: unitId,
//         fullname: selectedCustomer.fullname,
//         weight: weight,
//         customerNotes: notes,
//         serviceType:
//           selectedTab === 0
//             ? "Wash"
//             : selectedTab === 1
//             ? "Wash/Dry"
//             : "Wash/Dry/Fold",
//       };

//       setTimeout(async () => {
//         try {
//           const response = await createWalkInServiceRequest.setWalkInRequest(
//             userDetails.storeId,
//             data
//           );

//           if (!response.success) {
//             toast.success(response.message);
//           } else {
//             toast.error(response.message);
//           }
//         } catch (error) {
//           toast.error("Error:", error);
//         } finally {
//           setLoading(false);
//           onClose();
//         }
//       }, 1500);
//     }
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="xs"
//       fullWidth
//       PaperProps={{
//         style: {
//           borderRadius: 16,
//         },
//       }}
//     >
//       <DialogTitle className="flex flex-col">
//         <div className="flex justify-between items-center mt-2">
//           <div className="flex items-center space-x-2">
//             <span className="text-lg font-semibold">Add Services</span>
//           </div>
//           <IconButton
//             onClick={onClose}
//             className="text-[#5787C8] hover:text-[#5787C8]"
//           >
//             <CloseIcon />
//           </IconButton>
//         </div>
//         <p className="mt-2 text-sm text-gray-600">
//           Select a service and choose a customer.
//         </p>
//       </DialogTitle>
//       <DialogContent></DialogContent>

//       <DialogActions className="flex justify-end space-x-1 mb-1 mr-2">
//         <Button
//           variant="outlined"
//           onClick={onClose}
//           sx={{
//             marginRight: 1,
//             borderColor: "#595959",
//             borderRadius: "5px",
//             fontWeight: 500,
//             textTransform: "none",
//             color: "#595959",
//             "&:hover": {
//               borderColor: "#595959",
//               backgroundColor: "rgba(144, 144, 144, 0.1)",
//             },
//           }}
//         >
//           Cancel
//         </Button>
//         <Button
//           variant="contained"
//           disableElevation
//           onClick={handleProceedSelectedUnit}
//           sx={{
//             backgroundColor: "#5787C8",
//             borderRadius: "5px",
//             fontWeight: 500,
//             minWidth: "90px",
//             textTransform: "none",
//             "&:hover": {
//               backgroundColor: "#3A5A85",
//             },
//           }}
//         >
//           Save
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default PopupServiceType;

{
  /* <div className="mt-2 mb-2 flex justify-center bg-[#5787C8] rounded-md">
          {["Wash", "Wash/Dry", "Wash/Dry/Fold"].map((label, index) => (
            <button
              key={index}
              onClick={() => handleTabChange(index)}
              className={`w-full p-2 m-1.5 font-bold text-sm rounded-sm transition-colors duration-200 ${
                selectedTab === index
                  ? "bg-white text-[#5787C8]"
                  : "bg-transparent text-white hover:bg-[#4a6b9c]"
              }`}
            >
              {label}
            </button>
          ))}
        </div> */
}

{
  /* <FormControl
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
                    {option.c_username}
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

        <FormControl fullWidth margin="normal" error={!!errors.weight}>
          <TextField
            label="Weight (kg)"
            variant="outlined"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter weight in kilograms"
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
        </FormControl> */
}

{
  /* <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          marginTop={2}
        >
          <Typography variant="body1">Additional Info</Typography>
          <Button
            onClick={handleAdditionalInfoToggle}
            sx={{ textTransform: "none" }}
          >
            {showAdditionalInfo ? "Hide" : "Show"}
          </Button>
        </Box>

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
        </Collapse> */
}
