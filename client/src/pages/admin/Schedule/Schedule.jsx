import React from "react";
import { Box } from "@mui/material";
import SectionAdminSchedule from "./components/SectionAdminSchedule";
import AccessDenied from "../../../components/pages/AccessDenied";
import useAuth from "../../../contexts/AuthContext";

const Schedule = () => {
  const { userDetails } = useAuth();
  return (
    <Box sx={{ pt: "100px", pb: "20px", px: "20px" }}>
      {userDetails?.roleName === "Administrator" ? (
        <SectionAdminSchedule storeId={userDetails.storeId} />
      ) : userDetails?.roleName === "Manager" ? (
        <SectionAdminSchedule storeId={userDetails.storeId} />
      ) : userDetails?.roleName === "Store Staff" ? (
        <SectionAdminSchedule storeId={userDetails.storeId} />
      ) : (
        <AccessDenied />
      )}
    </Box>
  );
};

export default Schedule;
