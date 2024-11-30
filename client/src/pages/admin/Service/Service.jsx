import React from "react";
import { Box } from "@mui/material";
import useAuth from "../../../contexts/AuthContext";
import AccessDenied from "../../../components/pages/AccessDenied";
import SectionAdminServiceManagement from "./components/SectionAdminServiceManagement";

const Service = () => {
  const { userDetails } = useAuth();
  return (
    <Box sx={{ pt: "100px", pb: "20px", px: "20px" }}>
      {userDetails?.roleName === "Administrator" ? (
        <SectionAdminServiceManagement
          storeId={userDetails.storeId}
          userDetails={userDetails}
        />
      ) : userDetails?.roleName === "Manager" ? (
        <SectionAdminServiceManagement
          storeId={userDetails.storeId}
          userDetails={userDetails}
        />
      ) : (
        <AccessDenied />
      )}
    </Box>
  );
};

export default Service;
