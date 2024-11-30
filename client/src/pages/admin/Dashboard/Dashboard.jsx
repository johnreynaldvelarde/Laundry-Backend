import React from "react";
import { Box } from "@mui/material";
import useAuth from "../../../contexts/AuthContext";
import SectionAdminDashboard from "./components/SectionAdminDashboard";
import AccessDenied from "../../../components/pages/AccessDenied";
import SectionUserDashboard from "./components/SectionUserDashboard";

const Dashboard = () => {
  const { userDetails } = useAuth();
  return (
    <Box sx={{ pt: "100px", pb: "20px", px: "20px" }}>
      {userDetails?.roleName === "Administrator" ? (
        <SectionAdminDashboard store_id={userDetails.storeId} />
      ) : userDetails?.roleName === "Manager" ? (
        <SectionUserDashboard store_id={userDetails.storeId} />
      ) : userDetails?.roleName === "Store Staff" ? (
        <SectionUserDashboard store_id={userDetails.storeId} />
      ) : (
        <AccessDenied />
      )}
    </Box>
  );
};

export default Dashboard;
