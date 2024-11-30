import {
  AppBar,
  Badge,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
} from "@mui/material";

import useAuth from "../../contexts/AuthContext";
import useLogout from "../../hooks/useLogout";

// icons
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { ArrowDropDown } from "@mui/icons-material";

import React, { useState, useContext, useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import UserImage from "../admin-components/UserImage";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaRegBell } from "react-icons/fa";
import A_DropNotifications from "./A_DropNotifications";
import A_DropMessage from "./A_DropMessage";
import useNavbarData from "../../hooks/common/useNavbarData";

const Navbar = ({ sideBarWidth, handleDrawerToggle }) => {
  const { userDetails, fetchUserDetails, accessToken } = useAuth();
  const { loading, notifications, fetchNotificationsData } = useNavbarData({
    userDetails,
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [messageAnchorEl, setMessageAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const openMessages = Boolean(messageAnchorEl);
  const openNotifications = Boolean(notificationAnchorEl);

  const logout = useLogout();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMessagesClick = (event) => {
    setMessageAnchorEl(event.currentTarget);
  };

  const handleMessagesClose = () => {
    setMessageAnchorEl(null);
  };

  const handleNotificationsClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationAnchorEl(null);
  };

  // For message
  const [anchorElMessage, setAnchorElMessage] = useState(null);
  const handleOpenMessage = (event) => {
    setAnchorElMessage(event.currentTarget);
  };
  const handleCloseMessage = () => {
    setAnchorElMessage(null);
  };

  const messages = [
    {
      senderName: "John Doe",
      avatar: "https://via.placeholder.com/150",
      preview: "Hey, are you available tomorrow?",
      timestamp: "5 min ago",
    },
    {
      senderName: "Jane Smith",
      avatar: "https://via.placeholder.com/150",
      preview: "Let's catch up soon!",
      timestamp: "15 min ago",
    },
    {
      senderName: "Mark Lee",
      avatar: "https://via.placeholder.com/150",
      preview: "Don't forget the meeting at 3 PM.",
      timestamp: "1 hour ago",
    },
  ];

  // For notificatons
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const handleOpenNotifications = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };
  const handleCloseNotifications = () => {
    setAnchorElNotifications(null);
  };

  const notificationss = [
    {
      id: 1,
      senderName: "Laundry Hub",
      avatar: "/images/laundry-icon.png",
      message: "Your laundry is ready for pickup.",
      timestamp: "10 minutes ago",
    },
    {
      id: 2,
      senderName: "Laundry Hub",
      avatar: "/images/laundry-icon.png",
      message: "Your laundry is ready for pickup.",
      timestamp: "10 minutes ago",
    },
  ];

  useEffect(() => {
    fetchNotificationsData();
  }, [fetchNotificationsData]);

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${sideBarWidth}px)` },
        ml: { md: `${sideBarWidth}px` },
        boxShadow: "unset",
        backgroundColor: "background.paper",
        color: "text.primary",
        borderBottomWidth: 1,
        borderBottomColor: "divider",
      }}
    >
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Tooltip title="Menu" arrow>
              <IconButton
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: "none" } }}
              >
                <FiMenu />
              </IconButton>
            </Tooltip>

            {/* <Typography
              variant="h5"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              Dashboard
            </Typography> */}
          </Box>

          <Stack direction="row" spacing={1.5} alignItems="center">
            {/* For message */}
            {/* <Tooltip title="Messages" arrow>
              <IconButton
                className="rounded-circle"
                onClick={handleOpenMessage}
              >
                <Badge badgeContent={messages.length} color="error">
                  <MdOutlineMailOutline />
                </Badge>
              </IconButton>
            </Tooltip> */}

            {/* For notications */}
            <Tooltip title="Notifications" arrow>
              <IconButton
                className="rounded-circle"
                onClick={handleOpenNotifications}
              >
                <Badge badgeContent={notifications.length} color="error">
                  <FaRegBell />
                </Badge>
              </IconButton>
            </Tooltip>

            <div>
              <UserImage />
            </div>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                textAlign: "right",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "500",
                    textAlign: "right",
                  }}
                >
                  {userDetails.fullName}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "400",
                    color: "text.secondary",
                    textAlign: "right",
                  }}
                >
                  {userDetails.username}
                </Typography>
              </Box>
              <IconButton sx={{ ml: 1 }} onClick={handleClick}>
                <ArrowDropDown />
              </IconButton>
            </Box>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
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
              {/* <MenuItem onClick={handleClose}>
                <Avatar /> Profile
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Avatar /> My account
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem> */}
              <MenuItem onClick={logout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Stack>
        </Box>
      </Toolbar>

      {/* For message */}
      <A_DropMessage
        anchorElMessage={anchorElMessage}
        handleCloseMessage={handleCloseMessage}
        messages={messages}
      />

      {/* For notications */}
      <A_DropNotifications
        anchorElNotifications={anchorElNotifications}
        handleCloseNotifications={handleCloseNotifications}
        notifications={notifications}
      />
    </AppBar>
  );
};

export default Navbar;
