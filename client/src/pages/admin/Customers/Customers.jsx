import React from "react";
import { Box } from "@mui/material";
import useAuth from "../../../contexts/AuthContext";
import SectionAdminCustomers from "./components/SectionAdminCustomers";
import SectionUserCustomers from "./components/SectionUserCustomers";
import AccessDenied from "../../../components/pages/AccessDenied";

const Customers = () => {
  const { userDetails } = useAuth();
  return (
    <Box sx={{ pt: "100px", pb: "20px", px: "20px" }}>
      {userDetails?.roleName === "Administrator" ? (
        <SectionAdminCustomers storeId={userDetails.storeId} />
      ) : userDetails?.roleName === "Manager" ||
      userDetails?.roleName === "Store Staff" ? (
        <SectionUserCustomers storeId={userDetails.storeId} />
      ) : (
        <AccessDenied />
      )}
    </Box>
  );
};

export default Customers;
