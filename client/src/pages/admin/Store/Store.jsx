import React from "react";
import { Box } from "@mui/material";
import AccessDenied from "../../../components/pages/AccessDenied";
import SectionAdminStore from "./components/SectionAdminStore";
import SectionUserStore from "./components/SectionUserStore";
import useAuth from "../../../contexts/AuthContext";

const Store = () => {
  const { userDetails } = useAuth();
  return (
    <Box sx={{ pt: "100px", pb: "20px", px: "20px" }}>
      {userDetails?.roleName === "Administrator" ? (
        <SectionAdminStore />
      ) : userDetails?.roleName === "Manager" ? (
        <SectionUserStore />
      ) : (
        <AccessDenied />
      )}
    </Box>
  );
};

export default Store;
