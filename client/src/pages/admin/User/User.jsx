import React from "react";
import useAuth from "../../../contexts/AuthContext";
import { Box } from "@mui/material";
import SectionAdminUser from "./components/SectionAdminUser";
import AccessDenied from "../../../components/pages/AccessDenied";
import SectionManagerUser from "./components/SectionManagerUser";

const User = () => {
  const { userDetails } = useAuth();
  return (
    <Box sx={{ pt: "100px", pb: "20px", px: "20px" }}>
      {userDetails?.roleName === "Administrator" ? (
        <SectionAdminUser />
      ) : userDetails?.roleName === "Manager" ? (
        <SectionManagerUser storeId={userDetails.storeId} />
      ) : (
        <AccessDenied />
      )}
    </Box>
  );
};

export default User;
