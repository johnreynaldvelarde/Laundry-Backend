import React from "react";
import { Menu, MenuItem, Typography, Divider } from "@mui/material";

const A_DropMessage = ({ anchorElMessage, handleCloseMessage, messages }) => {
  return (
    <>
      <Menu
        anchorEl={anchorElMessage}
        id="message-menu"
        open={Boolean(anchorElMessage)}
        onClose={handleCloseMessage}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            width: "320px", // Set a wider width for better readability
            "& .MuiAvatar-root": {
              width: 40,
              height: 40,
              ml: 1,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <div
          className="flex justify-between items-center p-0 py-2 font-bold text-lg text-[#595959]"
          style={{ pointerEvents: "none" }}
        >
          <div className="pl-3 text-lg">Message</div>
          <div>
            <button
              className="text-sm pr-4 font-normal"
              // onClick={handleClearAll}
              style={{ pointerEvents: "auto", color: "#5787C8" }}
            >
              Clear All
            </button>
          </div>
        </div>
        <Divider />

        <div className="scrollable max-h-[300px] overflow-y-auto">
          {messages.length === 0 ? ( // Check if there are no notifications
            <div className="flex items-center justify-center p-4 text-gray-500">
              No message
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                // onClick={handleClose}
                className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
              >
                <img
                  alt={message.senderName}
                  src={message.avatar}
                  className="w-10 h-10 rounded-full mr-3 bg-gray-200"
                />
                <div className="flex-1">
                  <p className="font-semibold text-sm">{message.senderName}</p>
                  <p className="text-xs text-gray-500 truncate max-w-[200px]">
                    {message.preview}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        <Divider />
        <MenuItem sx={{ justifyContent: "center" }}>
          <Typography variant="body2" color="primary">
            See All Messages
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default A_DropMessage;
