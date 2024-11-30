import React from "react";
import { Box } from "@mui/material";
import useAuth from "../../../contexts/AuthContext";
import AccessDenied from "../../../components/pages/AccessDenied";
import SectionAdminTransaction from "./components/SectionAdminTransaction";
import SectionUserTransaction from "./components/SectionUserTransaction";

const TransactionHistory = () => {
  const { userDetails } = useAuth();
  return (
    <Box sx={{ pt: "100px", pb: "20px", px: "20px" }}>
      {userDetails?.roleName === "Administrator" ? (
        <SectionAdminTransaction storeId={userDetails.storeId} />
      ) : userDetails?.roleName === "Manager" ? (
        <SectionAdminTransaction storeId={userDetails.storeId} />
      ) : (
        <AccessDenied />
      )}
    </Box>
  );
};

export default TransactionHistory;
