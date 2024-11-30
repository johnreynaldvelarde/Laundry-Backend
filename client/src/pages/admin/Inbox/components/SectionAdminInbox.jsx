import React, { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import CustomHeaderTitle from "../../../../components/common/CustomHeaderTitle";
import { COLORS } from "../../../../constants/color";
import CustomInbox from "./CustomInbox";
import CustomMessage from "./CustomMessage";

const SectionAdminInbox = ({ userId }) => {
  const [selectedMessage, setSelectedMessage] = useState(null);

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
  };

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("lg"));

  return (
    <>
      {/* Header */}
      <Box
        className="flex items-center justify-between mb-8"
        sx={{
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "center", sm: "flex-start" },
          width: "100%",
        }}
      >
        <CustomHeaderTitle
          title={"Inbox"}
          subtitle={"Explore Messages & Customer Interactions"}
        />
      </Box>

      {/* Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: isMobile ? "100%" : "30%",
            marginBottom: isMobile ? "16px" : "0",
          }}
        >
          <CustomInbox
            onSelectMessage={handleSelectMessage}
            selectedMessage={selectedMessage}
            userId={userId}
          />
        </Box>
        <Box
          sx={{
            width: isMobile ? "100%" : "70%",
            borderLeft: isMobile ? "none" : `1px solid ${COLORS.border}`,
            paddingLeft: isMobile ? 0 : 2,
          }}
        >
          <CustomMessage selectedMessage={selectedMessage} userId={userId} />
        </Box>
      </Box>
    </>
  );
};

export default SectionAdminInbox;
