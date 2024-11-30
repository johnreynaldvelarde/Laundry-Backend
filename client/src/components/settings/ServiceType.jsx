import React, { useState, useEffect } from "react";
import useAuth from "../../contexts/AuthContext";
import { Divider, Typography, Button, Grid, Box, Paper } from "@mui/material";
import { PlusCircle } from "@phosphor-icons/react";
import PopupServiceType from "./PopupServiceType";
import { getServiceTypeAndStore } from "../../services/api/getApi";

const ServiceType = () => {
  const { userDetails } = useAuth();
  const [storeData, setStoreData] = useState([]);
  const [allServiceTypes, setAllServiceTypes] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);

  const fetchServiceType = async () => {
    if (!userDetails?.storeId) return;

    try {
      const response = await getServiceTypeAndStore.getServiceType(
        userDetails.storeId
      );
      if (response) {
        // Ensure stores and serviceTypes are defined
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
        // Handle the case where response is not as expected
        console.error("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchServiceType();
  }, [userDetails?.storeId]);

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

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: "1200px", margin: "auto" }}>
      {/* Header */}
      <Typography variant="h5" gutterBottom>
        Service Types
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.8, pb: 2 }}>
        Configure your laundry service types and default prices.
      </Typography>
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
                <Typography
                  variant="body2"
                  sx={{
                    textAlign: "center",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: selectedStoreId === store.id ? "#5787C8" : "inherit",
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
      <Grid container spacing={3}>
        {serviceTypes.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.id}>
            <Paper
              sx={{
                boxShadow: "none",
                borderRadius: "12px",
                border: "1px solid",
                borderColor: "divider",
                p: 2,
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.3rem" },
                  wordBreak: "break-word",
                }}
              >
                {service.service_name}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  wordBreak: "break-word",
                }}
              >
                Price: ₱{service.default_price}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button variant="outlined" size="small">
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    color: "red", // Color of the text for the Delete button
                    borderColor: "red", // Border color for the Delete button
                    "&:hover": {
                      borderColor: "darkred", // Darker border color on hover
                      backgroundColor: "rgba(255, 0, 0, 0.1)", // Light red background on hover
                    },
                  }}
                >
                  Delete
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Add New Service Button */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button
          variant="contained"
          startIcon={<PlusCircle size={24} color="#fcfcfc" weight="duotone" />}
          sx={{
            backgroundColor: "#5787C8",
            borderRadius: "5px",
            fontWeight: 600,
            textTransform: "none",
            paddingLeft: "23px",
            paddingRight: "23px",
            fontSize: "16px",
            "&:hover": {
              backgroundColor: "#3b5c9f",
            },
          }}
          onClick={handleAddService}
        >
          Add new service
        </Button>
      </Box>
      <PopupServiceType open={openPopup} onClose={handleClosePopup} />
    </Box>
  );
};

export default ServiceType;

// const fetchServiceType = async () => {
//   if (!userDetails?.storeId) return;

//   try {
//     const response = await getServiceTypeAndStore.getServiceType(
//       userDetails.storeId
//     );
//     if (response) {
//       setStoreData(response.stores || []);
//       setAllServiceTypes(response.serviceTypes || []);
//       if (response.stores.length > 0) {
//         setSelectedStoreId(response.stores[0].id);
//         setServiceTypes(
//           response.serviceTypes.filter(
//             (service) => service.store_id === response.stores[0].id
//           )
//         );
//       } else {
//         setServiceTypes(response.serviceTypes || []);
//       }
//     }
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// };

// import React, { useState, useEffect } from "react";
// import useAuth from "../../contexts/AuthContext";
// import { Divider, Typography, Button, Grid, Box, Paper } from "@mui/material";
// import { PlusCircle } from "@phosphor-icons/react";
// import PopupServiceType from "./PopupServiceType";
// import { getServiceTypeAndStore } from "../../services/api/getApi";

// const ServiceType = () => {
//   const { userDetails } = useAuth();
//   const [storeData, setStoreData] = useState([]);
//   const [allServiceTypes, setAllServiceTypes] = useState([]);
//   const [serviceTypes, setServiceTypes] = useState([]);
//   const [selectedStoreId, setSelectedStoreId] = useState(null);
//   const [openPopup, setOpenPopup] = useState(false);

//   const fetchServiceType = async () => {
//     if (!userDetails?.storeId) return;

//     try {
//       const response = await getServiceTypeAndStore.getServiceType(
//         userDetails.storeId
//       );
//       if (response) {
//         setStoreData(response.stores || []);
//         setAllServiceTypes(response.serviceTypes || []);
//         if (response.stores.length > 0) {
//           setSelectedStoreId(response.stores[0].id);
//           setServiceTypes(
//             response.serviceTypes.filter(
//               (service) => service.store_id === response.stores[0].id
//             )
//           );
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchServiceType();
//   }, [userDetails?.storeId]);

//   const handleStoreSelect = (storeId) => {
//     setSelectedStoreId(storeId);
//     setServiceTypes(
//       allServiceTypes.filter((service) => service.store_id === storeId)
//     );
//   };

//   const handleAddService = () => {
//     setOpenPopup(true);
//   };

//   const handleClosePopup = () => {
//     setOpenPopup(false);
//   };

//   return (
//     <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: "1200px", margin: "auto" }}>
//       {/* Header */}
//       <Typography variant="h5" gutterBottom>
//         Service Types
//       </Typography>
//       <Typography variant="body2" sx={{ opacity: 0.8, pb: 2 }}>
//         Configure your laundry service types and default prices.
//       </Typography>
//       <Divider sx={{ mb: 3 }} />

//       {/* Show the list of stores */}
//       <Box
//         className="hori-scrollable"
//         sx={{ overflowX: "auto", mb: 4, mt: 2, paddingBottom: 1 }}
//       >
//         <Box sx={{ display: "inline-flex", gap: 2 }}>
//           {storeData.map((store) => (
//             <Paper
//               key={store.id}
//               onClick={() => handleStoreSelect(store.id)}
//               sx={{
//                 p: 2,
//                 minWidth: "120px",
//                 cursor: "pointer",
//                 borderRadius: "8px",
//                 border: `1px solid`, // Border style
//                 borderColor:
//                   selectedStoreId === store.id
//                     ? "#5787C8"
//                     : (theme) => theme.palette.divider, // Dynamic border color
//                 backgroundColor:
//                   selectedStoreId === store.id ? "#ECF1F8" : "#fff",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 flexShrink: 0, // Prevent shrinking of Paper
//                 whiteSpace: "normal", // Ensure the text can wrap if needed
//                 overflow: "hidden", // Hide overflow text
//                 boxShadow: "none", // Remove shadow
//               }}
//             >
//               <Typography
//                 variant="body2"
//                 sx={{
//                   textAlign: "center",
//                   overflow: "hidden",
//                   textOverflow: "ellipsis",
//                   color: selectedStoreId === store.id ? "#5787C8" : "inherit", // Change text color when selected
//                 }}
//               >
//                 {store.store_name}
//               </Typography>
//             </Paper>
//           ))}
//         </Box>
//       </Box>

//       {/* Service List */}
//       <Grid container spacing={3}>
//         {serviceTypes.map((service) => (
//           <Grid item xs={12} sm={6} md={4} key={service.id}>
//             <Paper
//               sx={{
//                 boxShadow: "none",
//                 borderRadius: "12px",
//                 border: "1px solid",
//                 borderColor: "divider",
//                 p: 2,
//               }}
//             >
//               <Typography
//                 variant="h6"
//                 gutterBottom
//                 sx={{
//                   fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.3rem" },
//                   wordBreak: "break-word",
//                 }}
//               >
//                 {service.service_name}
//               </Typography>
//               <Typography
//                 variant="body1"
//                 sx={{
//                   fontSize: { xs: "0.9rem", sm: "1rem" },
//                   wordBreak: "break-word",
//                 }}
//               >
//                 Price: ₱{service.default_price}
//               </Typography>
//               <Divider sx={{ my: 2 }} />
//               <Button variant="outlined" size="small">
//                 Edit
//               </Button>
//             </Paper>
//           </Grid>
//         ))}
//       </Grid>

//       {/* Add New Service Button */}
//       <Box sx={{ mt: 4, textAlign: "center" }}>
//         <Button
//           variant="contained"
//           startIcon={<PlusCircle size={24} color="#fcfcfc" weight="duotone" />}
//           sx={{
//             backgroundColor: "#5787C8",
//             borderRadius: "5px",
//             fontWeight: 600,
//             textTransform: "none",
//             paddingLeft: "23px",
//             paddingRight: "23px",
//             fontSize: "16px",
//             "&:hover": {
//               backgroundColor: "#3b5c9f",
//             },
//           }}
//           onClick={handleAddService}
//         >
//           Add new service
//         </Button>
//       </Box>
//       <PopupServiceType open={openPopup} onClose={handleClosePopup} />
//     </Box>
//   );
// };

// export default ServiceType;

{
  /* <Box
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
                boxShadow: selectedStoreId === store.id ? 2 : 1,
                border:
                  selectedStoreId === store.id
                    ? "2px solid #1976d2"
                    : "1px solid #e0e0e0",
                backgroundColor:
                  selectedStoreId === store.id ? "#e3f2fd" : "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0, // Prevent shrinking of Paper
                whiteSpace: "normal", // Ensure the text can wrap if needed
                overflow: "hidden", // Hide overflow text
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  textAlign: "center",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {store.store_name}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box> */
}

{
  /* <Box sx={{ overflowX: "auto", mb: 4 }}>
        <Box sx={{ display: "flex", gap: 2, minWidth: "100%" }}>
          {storeData.map((store) => (
            <Button
              key={store.id}
              variant={selectedStoreId === store.id ? "contained" : "outlined"}
              onClick={() => handleStoreSelect(store.id)}
              sx={{
                minWidth: "120px",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
                borderRadius: "8px",
              }}
            >
              {store.store_name}
            </Button>
          ))}
        </Box>
      </Box> */
}

// import React, { useState, useEffect } from "react";
// import useAuth from "../../contexts/AuthContext";
// import { Divider, Typography, Button, Grid, Box, Paper } from "@mui/material";
// import { PlusCircle } from "@phosphor-icons/react";
// import PopupServiceType from "./PopupServiceType";
// import { getServiceTypeAndStore } from "../../services/api/getApi";

// const ServiceType = () => {
//   const { userDetails } = useAuth();
//   const [storeData, setStoreData] = useState([]);
//   const [allServiceTypes, setAllServiceTypes] = useState([]);
//   const [serviceTypes, setServiceTypes] = useState([]);
//   const [selectedStoreId, setSelectedStoreId] = useState(null);
//   const [openPopup, setOpenPopup] = useState(false);

//   const fetchServiceType = async () => {
//     if (!userDetails?.storeId) return;

//     try {
//       const response = await getServiceTypeAndStore.getServiceType(
//         userDetails.storeId
//       );
//       if (response) {
//         setStoreData(response.stores || []);
//         setAllServiceTypes(response.serviceTypes || []);
//         if (response.stores.length > 0) {
//           setSelectedStoreId(response.stores[0].id);
//           // Set service types for the first store
//           setServiceTypes(
//             response.serviceTypes.filter(
//               (service) => service.store_id === response.stores[0].id
//             )
//           );
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchServiceType();
//   }, [userDetails?.storeId]);

//   const handleStoreSelect = (storeId) => {
//     setSelectedStoreId(storeId);
//     // Update service types for the selected store
//     setServiceTypes(
//       allServiceTypes.filter((service) => service.store_id === storeId)
//     );
//   };

//   const handleAddService = () => {
//     setOpenPopup(true);
//   };

//   const handleClosePopup = () => {
//     setOpenPopup(false);
//   };

//   return (
//     <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: "1200px", margin: "auto" }}>
//       {/* Header */}
//       <Typography variant="h5" gutterBottom>
//         Service Types
//       </Typography>
//       <Typography variant="body2" sx={{ opacity: 0.8, pb: 2 }}>
//         Configure your laundry service types and default prices.
//       </Typography>
//       <Divider sx={{ mb: 3 }} />

//       {/* Show the list of stores */}
//       <Box sx={{ overflowX: "auto", mb: 4 }}>
//         <Box sx={{ display: "flex", gap: 2 }}>
//           {storeData.map((store) => (
//             <Button
//               key={store.id}
//               variant={selectedStoreId === store.id ? "contained" : "outlined"}
//               onClick={() => handleStoreSelect(store.id)}
//             >
//               {store.store_name}
//             </Button>
//           ))}
//         </Box>
//       </Box>

//       {/* Service List */}
//       <Grid container spacing={3}>
//         {serviceTypes.map((service) => (
//           <Grid item xs={12} sm={6} md={4} key={service.id}>
//             <Paper
//               sx={{
//                 boxShadow: "none",
//                 borderRadius: "12px",
//                 border: "1px solid",
//                 borderColor: "divider", // Use divider color for the border
//                 p: 2,
//               }}
//             >
//               <Typography
//                 variant="h6"
//                 gutterBottom
//                 sx={{
//                   fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.3rem" },
//                   wordBreak: "break-word",
//                 }}
//               >
//                 {service.service_name}
//               </Typography>
//               <Typography
//                 variant="body1"
//                 sx={{
//                   fontSize: { xs: "0.9rem", sm: "1rem" },
//                   wordBreak: "break-word",
//                 }}
//               >
//                 Price: ₱{service.default_price}
//               </Typography>
//               <Divider sx={{ my: 2 }} />
//               <Button variant="outlined" size="small">
//                 Edit
//               </Button>
//             </Paper>
//           </Grid>
//         ))}
//       </Grid>

//       {/* Add New Service Button */}
//       <Box sx={{ mt: 4, textAlign: "center" }}>
//         <Button
//           variant="contained"
//           startIcon={<PlusCircle size={24} color="#fcfcfc" weight="duotone" />}
//           sx={{
//             backgroundColor: "#5787C8",
//             borderRadius: "5px",
//             fontWeight: 600,
//             textTransform: "none",
//             paddingLeft: "23px",
//             paddingRight: "23px",
//             fontSize: "16px",
//             "&:hover": {
//               backgroundColor: "#3b5c9f",
//             },
//           }}
//           onClick={handleAddService}
//         >
//           Add new service
//         </Button>
//       </Box>
//       <PopupServiceType open={openPopup} onClose={handleClosePopup} />
//     </Box>
//   );
// };

// export default ServiceType;

// import React, { useState, useEffect } from "react";
// import useAuth from "../../contexts/AuthContext";
// import { Divider, Typography, Button, Grid, Box, Paper } from "@mui/material";
// import { PlusCircle } from "@phosphor-icons/react";
// import PopupServiceType from "./PopupServiceType";
// import { getServiceTypeAndStore } from "../../services/api/getApi";

// const ServiceType = () => {
//   const { userDetails } = useAuth();
//   const [storeData, setStoreData] = useState([]);
//   const [serviceTypes, setServiceTypes] = useState([]);
//   const [selectedStoreId, setSelectedStoreId] = useState(null);
//   const [openPopup, setOpenPopup] = useState(false);

//   const fetchServiceType = async () => {
//     if (!userDetails?.storeId) return;

//     try {
//       const response = await getServiceTypeAndStore.getServiceType(
//         userDetails.storeId
//       );
//       if (response) {
//         setStoreData(response.stores || []);
//         setServiceTypes(response.serviceTypes || []);
//         // Optionally set the first store as selected
//         if (response.stores.length > 0) {
//           setSelectedStoreId(response.stores[0].id);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchServiceType();
//   }, [userDetails?.storeId]);

//   const handleStoreSelect = (storeId) => {
//     setSelectedStoreId(storeId);
//     // Update service types based on the selected store
//     setServiceTypes((prevServiceTypes) =>
//       prevServiceTypes.filter((service) => service.store_id === storeId)
//     );
//   };

//   const handleAddService = () => {
//     setOpenPopup(true);
//   };

//   const handleClosePopup = () => {
//     setOpenPopup(false);
//   };

//   return (
//     <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: "1200px", margin: "auto" }}>
//       {/* Header */}
//       <Typography variant="h5" gutterBottom>
//         Service Types
//       </Typography>
//       <Typography variant="body2" sx={{ opacity: 0.8, pb: 2 }}>
//         Configure your laundry service types and default prices.
//       </Typography>
//       <Divider sx={{ mb: 3 }} />

//       {/* Show the list of stores */}
//       <Box sx={{ overflowX: "auto", mb: 4 }}>
//         <Box sx={{ display: "flex", gap: 2 }}>
//           {storeData.map((store) => (
//             <Button
//               key={store.id}
//               variant={selectedStoreId === store.id ? "contained" : "outlined"}
//               onClick={() => handleStoreSelect(store.id)}
//             >
//               {store.store_name}
//             </Button>
//           ))}
//         </Box>
//       </Box>

//       {/* Service List */}
//       <Grid container spacing={3}>
//         {serviceTypes.map((service) => (
//           <Grid item xs={12} sm={6} md={4} key={service.id}>
//             <Paper
//               sx={{
//                 boxShadow: "none",
//                 borderRadius: "12px",
//                 border: "1px solid",
//                 borderColor: "divider", // Use divider color for the border
//                 p: 2,
//               }}
//             >
//               <Typography
//                 variant="h6"
//                 gutterBottom
//                 sx={{
//                   fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.3rem" },
//                   wordBreak: "break-word",
//                 }}
//               >
//                 {service.service_name}
//               </Typography>
//               <Typography
//                 variant="body1"
//                 sx={{
//                   fontSize: { xs: "0.9rem", sm: "1rem" },
//                   wordBreak: "break-word",
//                 }}
//               >
//                 Price: ₱{service.default_price}
//               </Typography>
//               <Divider sx={{ my: 2 }} />
//               <Button variant="outlined" size="small">
//                 Edit
//               </Button>
//             </Paper>
//           </Grid>
//         ))}
//       </Grid>

//       {/* Add New Service Button */}
//       <Box sx={{ mt: 4, textAlign: "center" }}>
//         <Button
//           variant="contained"
//           startIcon={<PlusCircle size={24} color="#fcfcfc" weight="duotone" />}
//           sx={{
//             backgroundColor: "#5787C8",
//             borderRadius: "5px",
//             fontWeight: 600,
//             textTransform: "none",
//             paddingLeft: "23px",
//             paddingRight: "23px",
//             fontSize: "16px",
//             "&:hover": {
//               backgroundColor: "#3b5c9f",
//             },
//           }}
//           onClick={handleAddService}
//         >
//           Add new service
//         </Button>
//       </Box>
//       <PopupServiceType open={openPopup} onClose={handleClosePopup} />
//     </Box>
//   );
// };

// export default ServiceType;

// import React, { useState, useEffect } from "react";
// import useAuth from "../../contexts/AuthContext";
// import { Divider, Typography, Button, Grid, Box, Paper } from "@mui/material";
// import { PlusCircle } from "@phosphor-icons/react";
// import PopupServiceType from "./PopupServiceType";
// import { getServiceTypeAndStore } from "../../services/api/getApi";

// // Sample service types data with IDs
// const initialServiceTypes = [
//   { id: 1, name: "Wash", price: "55.00" },
//   { id: 2, name: "Wash/Dry", price: "55.00" },
//   { id: 3, name: "Wash/Dry/Fold", price: "30.00" },
// ];

// const ServiceType = () => {
//   const { userDetails } = useAuth();
//   const [serviceTypes, setServiceTypes] = useState(initialServiceTypes);
//   const [openPopup, setOpenPopup] = useState(false);
//   const [servicesData, setServicesData] = useState([]);

//   const fetchServiceType = async () => {
//     if (!userDetails?.storeId) return;

//     try {
//       const response = await getServiceTypeAndStore.getServiceType(
//         userDetails.storeId
//       );
//       if (response) {
//         setServicesData(response);
//       }
//     } catch (error) {
//       console.error("Error fetching customer:", error);
//     }
//   };

//   useEffect(() => {
//     fetchServiceType();
//   }, [userDetails?.storeId]);

//   const handleAddService = () => {
//     setOpenPopup(true);
//   };

//   const handleClosePopup = () => {
//     setOpenPopup(false);
//   };

//   return (
//     <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: "1200px", margin: "auto" }}>
//       {/* Header */}
//       <Typography variant="h5" gutterBottom>
//         Service Types
//       </Typography>
//       <Typography variant="body2" sx={{ opacity: 0.8, pb: 2 }}>
//         Configure your laundry service types and default prices.
//       </Typography>
//       <Divider sx={{ mb: 3 }} />

//       {/* Show the list of store */}
//       <Box className="flex flex-col gap-4"></Box>

//       {/* Service List */}
//       <Grid container spacing={3}>
//         {serviceTypes.map((service) => (
//           <Grid item xs={12} sm={6} md={4} key={service.id}>
//             <Paper
//               sx={{
//                 boxShadow: "none",
//                 borderRadius: "12px",
//                 border: "1px solid",
//                 borderColor: "divider", // Use divider color for the border
//                 p: 2,
//               }}
//             >
//               <Typography
//                 variant="h6"
//                 gutterBottom
//                 sx={{
//                   fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.3rem" },
//                   wordBreak: "break-word",
//                 }}
//               >
//                 {service.name}
//               </Typography>
//               <Typography
//                 variant="body1"
//                 sx={{
//                   fontSize: { xs: "0.9rem", sm: "1rem" },
//                   wordBreak: "break-word",
//                 }}
//               >
//                 Price: ₱{service.price}
//               </Typography>
//               <Divider sx={{ my: 2 }} />
//               <Button variant="outlined" size="small">
//                 Edit
//               </Button>
//             </Paper>
//           </Grid>
//         ))}
//       </Grid>

//       {/* Add New Service Button */}
//       <Box sx={{ mt: 4, textAlign: "center" }}>
//         <Button
//           variant="contained"
//           startIcon={<PlusCircle size={24} color="#fcfcfc" weight="duotone" />}
//           sx={{
//             backgroundColor: "#5787C8",
//             borderRadius: "5px",
//             fontWeight: 600,
//             textTransform: "none",
//             paddingLeft: "23px",
//             paddingRight: "23px",
//             fontSize: "16px",
//             "&:hover": {
//               backgroundColor: "#3b5c9f",
//             },
//           }}
//           onClick={handleAddService}
//         >
//           Add new service
//         </Button>
//       </Box>
//       <PopupServiceType open={openPopup} onClose={handleClosePopup} />
//     </Box>
//   );
// };

// export default ServiceType;
