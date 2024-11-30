import React from "react";
import { Box } from "@mui/material";
import useAuth from "../../../contexts/AuthContext";
import AccessDenied from "../../../components/pages/AccessDenied";
import SectionAdminActivityLog from "./components/SectionAdminActivityLog";
import SectionUserDashboard from "../Dashboard/components/SectionUserDashboard";

const ActivityLog = () => {
  const { userDetails } = useAuth();
  return (
    <Box sx={{ pt: "100px", pb: "20px", px: "20px" }}>
      {userDetails?.roleName === "Administrator" ? (
        <SectionAdminActivityLog storeId={userDetails.storeId} />
      ) : userDetails?.roleName === "Manager" ? (
        <SectionAdminActivityLog storeId={userDetails.storeId} />
      ) : (
        <AccessDenied />
      )}
    </Box>
  );
};

export default ActivityLog;
