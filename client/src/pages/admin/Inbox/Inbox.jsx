import React from "react";
import { Box } from "@mui/material";
import useAuth from "../../../contexts/AuthContext";
import AccessDenied from "../../../components/pages/AccessDenied";
import SectionAdminInbox from "./components/SectionAdminInbox";

const Inbox = () => {
  const { userDetails } = useAuth();
  return (
    <Box sx={{ pt: "100px", pb: "20px", px: "20px" }}>
      {userDetails?.roleName === "Administrator" ? (
        <SectionAdminInbox userId={userDetails.userId} />
      ) : userDetails?.roleName === "Manager" ? (
        <SectionAdminInbox userId={userDetails.userId} />
      ) : userDetails?.roleName === "Store Staff" ? (
        <SectionAdminInbox userId={userDetails.userId} />
      ) : (
        <AccessDenied />
      )}
    </Box>
  );
};

export default Inbox;
