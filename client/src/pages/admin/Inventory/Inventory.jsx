import React from "react";
import useAuth from "../../../contexts/AuthContext";
import { Box } from "@mui/material";
import SectionAdminInventory from "./components/SectionAdminInventory";
import SectionManagerInventory from "./components/SectionManagerInventory";
import AccessDenied from "../../../components/pages/AccessDenied";

const Inventory = () => {
  const { userDetails } = useAuth();
  return (
    <Box sx={{ pt: "100px", pb: "20px", px: "20px" }}>
      {userDetails?.roleName === "Administrator" ? (
        <SectionAdminInventory />
      ) : userDetails?.roleName === "Manager"? (
        <SectionAdminInventory />
      ) : (
        <AccessDenied />
      )}
    </Box>
  );
};

export default Inventory;
