import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../../contexts/AuthContext";
import UserImage from "../admin-components/UserImage";
import useLogout from "../../hooks/useLogout";
import logo from "../../assets/images/logo.png";
import styles from "../../styles/style";
import { c_navItems } from "../../constants/index";
import {
  Box,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  Badge,
  Divider,
  Typography,
  useMediaQuery,
  Drawer,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { MdOutlineMailOutline, MdPayments } from "react-icons/md";
import {
  AddressBook,
  List,
  Password,
  SignOut,
  Storefront,
  TextOutdent,
  User,
} from "@phosphor-icons/react";
import { COLORS } from "../../constants/color";
import SideCustomerItem from "./SideCustomerItem";
import { customerLinks } from "../../data/customerLinks";
import noti_logo from "../../assets/images/logo.png";
import usePopup from "../../hooks/common/usePopup";
import PopUpdateProfile from "../../pages/default_customer/components/PopUpdateProfile";
import PopUpdateAddress from "../../pages/default_customer/components/PopUpdateAddress";
import PopUpdatePassword from "../../pages/default_customer/components/PopUpdatePassword";
import PopChangeStore from "../../pages/default_customer/components/PopChangeStore";
import useNavbarData from "../../hooks/common/useNavbarData";
import { formatTimeNotification } from "../../utils/method";

const C_Navbar = () => {
  const { userDetails, fetchUserDetails, accessToken } = useAuth();
  const { loading, notifications, fetchNotificationsData } = useNavbarData({
    userDetails,
  });

  const logout = useLogout();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElMessage, setAnchorElMessage] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isOpen, popupType, openPopup, closePopup, popupData } = usePopup();

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    logout();
    handleClose();
  };
  const handleClickMessage = (event) => setAnchorElMessage(event.currentTarget);
  const handleCloseMessage = () => setAnchorElMessage(null);
  const handleClickNotifications = (event) =>
    setAnchorElNotifications(event.currentTarget);
  const handleCloseNotifications = () => setAnchorElNotifications(null);
  const handleClearAll = () => console.log("Clear Notifications");

  useEffect(() => {
    const currentPath = location.pathname;
    const index = c_navItems.findIndex((item) => item.href === currentPath);
    setActiveIndex(index !== -1 ? index : 0);
  }, [location.pathname]);

  const messages = [];

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("lg"));

  useEffect(() => {
    if (!isSmallScreen) {
      setDrawerOpen(false);
    }
  }, [isSmallScreen]);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLinkClick = () => {
    setDrawerOpen(false);
  };

  useEffect(() => {
    fetchNotificationsData();
  }, [fetchNotificationsData]);

  return (
    <Box className="sticky top-0 z-50 py-3 backdrop-blur-lg bg-white bg-opacity-80 border-b border-neutral-700/40 ">
      <Box className="container px-4 mx-auto flex items-center justify-between">
        {isSmallScreen ? (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
          >
            <List size={32} weight="duotone" />
          </IconButton>
        ) : (
          <Box className="flex items-center flex-shrink-0">
            <img className="h-12 w-12 mb-2" src={logo} alt="logo" />
            <Typography
              sx={{
                display: "flex",
                fontSize: { xs: "1rem", md: "1.125rem", lg: "1.25rem" },
                fontWeight: "normal",
                letterSpacing: "0.01em",
              }}
            >
              <Box
                component="span"
                fontWeight="bold"
                style={{ color: COLORS.secondary }}
              >
                Lizaso
              </Box>
              <Box
                component="span"
                style={{ color: COLORS.primary, marginLeft: "5px" }}
              >
                Laundry Hub
              </Box>
            </Typography>
          </Box>
        )}

        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                px: 1,
                py: 1,
              }}
            >
              <img className="h-12 w-12 mb-2" src={logo} alt="logo" />
              <Typography
                sx={{
                  display: "flex",
                  fontSize: "1.25rem",
                  textAlign: "left",
                }}
              >
                <Box
                  component="span"
                  fontWeight="bold"
                  sx={{ color: COLORS.secondary }}
                >
                  Lizaso
                </Box>
                <Box
                  component="span"
                  sx={{ color: COLORS.primary, marginLeft: "5px" }}
                >
                  Laundry Hub
                </Box>
              </Typography>

              <IconButton
                onClick={toggleDrawer}
                sx={{ color: "black", marginLeft: 5 }}
              >
                <TextOutdent
                  size={30}
                  color={COLORS.primary}
                  weight="duotone"
                />
              </IconButton>
            </Box>
            <Divider />

            {/* Scrollable List */}
            <Box
              sx={{
                flexGrow: 1,
                overflowY: "auto",
                borderRightWidth: 1,
                borderRightColor: "divider",
              }}
            >
              <Box
                sx={{
                  height: "100%",
                }}
                className="sidebar-scrollable"
              >
                {customerLinks && customerLinks.length > 0 ? (
                  customerLinks.map((item, index) => (
                    <div key={index} onClick={handleLinkClick}>
                      <SideCustomerItem {...item} />
                    </div>
                  ))
                ) : (
                  <div>
                    <Typography>No items available</Typography>
                  </div>
                )}
              </Box>
            </Box>
          </Box>
        </Drawer>

        {/* Navigation links (hidden on small screens) */}
        <Box
          className="hidden lg:flex space-x-8 font-medium text-sm md:text-base mr-5 ml-5"
          style={{ color: styles.textColor2 }}
        >
          {c_navItems.map((item, index) => (
            <Box
              key={index}
              onClick={() => setActiveIndex(index)}
              className="relative"
            >
              <Link
                to={item.href}
                className="relative flex items-center px-1 py-1"
                style={{ color: activeIndex === index ? "#5787C8" : "#595959" }}
              >
                <Box component="span">{item.label}</Box>
                {item.notificationCount > 0 && (
                  <Badge
                    badgeContent={
                      item.notificationCount > 99
                        ? "+99"
                        : item.notificationCount
                    }
                    color="error"
                    className="absolute top-[-5px] right-[-10px]"
                  />
                )}
              </Link>

              <Box
                className={`absolute left-0 right-0 bottom-[-5px] h-[2px] bg-[#5787C8] ${
                  activeIndex === index ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </Box>
          ))}
        </Box>

        <Box className="flex items-center space-x-3">
          <Tooltip title="Message" arrow>
            <IconButton onClick={handleClickMessage}>
              <Badge badgeContent={messages.length} color="error">
                <MdOutlineMailOutline style={{ color: styles.black }} />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Notifications" arrow>
            <IconButton onClick={handleClickNotifications}>
              <Badge badgeContent={notifications.length} color="error">
                <NotificationsIcon style={{ color: styles.black }} />
              </Badge>
            </IconButton>
          </Tooltip>

          <UserImage className="h-8 w-8 md:h-10 md:w-10" />
          <Box ml={3}>
            <Typography fontWeight="font-semibold" fontSize="medium">
              {userDetails.fullName}
            </Typography>
            <Typography color="text.secondary" fontSize="xs">
              {userDetails.username}
            </Typography>
          </Box>
          <IconButton
            onClick={handleClick}
            aria-controls="user-menu"
            aria-haspopup="true"
          >
            <ArrowDropDownIcon />
          </IconButton>

          {/* For Message  */}
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
                  onClick={handleClearAll}
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
                    onClick={handleClose}
                    className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
                  >
                    <img
                      alt={message.senderName}
                      src={message.avatar}
                      className="w-10 h-10 rounded-full mr-3 bg-gray-200"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">
                        {message.senderName}
                      </p>
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
            <MenuItem onClick={handleClose} sx={{ justifyContent: "center" }}>
              <Typography variant="body2" color="primary">
                See All Messages
              </Typography>
            </MenuItem>
          </Menu>

          {/* For Notifications */}
          <Menu
            anchorEl={anchorElNotifications}
            id="notifications-menu"
            open={Boolean(anchorElNotifications)}
            onClose={handleCloseNotifications}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                width: "320px",
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
              <div className="pl-3 text-lg">Notifications</div>
              <div>
                <button
                  className="text-sm pr-4 font-normal"
                  onClick={handleClearAll}
                  style={{ pointerEvents: "auto", color: "#5787C8" }}
                >
                  Clear All
                </button>
              </div>
            </div>
            <Divider />
            <div className="scrollables max-h-[300px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex items-center justify-center p-4 text-gray-500">
                  No notifications
                </div>
              ) : (
                notifications.map((notification, index) => (
                  <div
                    key={index}
                    onClick={handleClose}
                    className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
                  >
                    <img
                      alt={notification.senderName}
                      src={noti_logo}
                      className="w-10 h-10 rounded-full mr-3 bg-gray-200"
                    />
                    <div className="flex-1">
                      <p
                        className="font-semibold text-sm"
                        style={{ color: COLORS.text }}
                      >
                        {notification.notification_type}
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-[200px]">
                        {notification.notification_description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTimeNotification(notification.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Divider />
            <MenuItem onClick={handleClose} sx={{ justifyContent: "center" }}>
              <Typography variant="body2" color="#5787C8">
                See All Notifications
              </Typography>
            </MenuItem>
          </Menu>

          {/* Account Menu */}
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={Boolean(anchorEl)}
            onClose={handleClose}
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
            <Box>
              {/* Add MenuItems here */}
              <MenuItem
                onClick={() => openPopup("updateProfile")}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <User size={25} color={COLORS.primary} weight="duotone" />
                <Typography
                  sx={{
                    marginLeft: 1,
                    color: COLORS.primary,
                    fontSize: "16px",
                  }}
                >
                  Update Profile
                </Typography>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => openPopup("updateAddress")}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <AddressBook
                  size={25}
                  color={COLORS.primary}
                  weight="duotone"
                />
                <Typography
                  sx={{
                    marginLeft: 1,
                    color: COLORS.primary,
                    fontSize: "16px",
                  }}
                >
                  Update Address
                </Typography>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => openPopup("updatePassword")}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Password size={25} color={COLORS.primary} weight="duotone" />
                <Typography
                  sx={{
                    marginLeft: 1,
                    color: COLORS.primary,
                    fontSize: "16px",
                  }}
                >
                  Update Password
                </Typography>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => openPopup("updateChangeStore")}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Storefront size={25} color={COLORS.primary} weight="duotone" />
                <Typography
                  sx={{
                    marginLeft: 1,
                    color: COLORS.primary,
                    fontSize: "16px",
                  }}
                >
                  Change Store
                </Typography>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={handleLogout}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <SignOut size={25} color={COLORS.primary} weight="duotone" />
                <Typography
                  sx={{
                    marginLeft: 1,
                    color: COLORS.primary,
                    fontSize: "16px",
                  }}
                >
                  Logout
                </Typography>
              </MenuItem>
            </Box>
          </Menu>
        </Box>
      </Box>

      {isOpen && popupType === "updateProfile" && (
        <PopUpdateProfile
          open={isOpen}
          onClose={closePopup}
          userDetails={userDetails}
          fetchUserDetails={fetchUserDetails}
          accessToken={accessToken}
        />
      )}

      {isOpen && popupType === "updateAddress" && (
        <PopUpdateAddress
          open={isOpen}
          onClose={closePopup}
          userDetails={userDetails}
          fetchUserDetails={fetchUserDetails}
          accessToken={accessToken}
        />
      )}

      {isOpen && popupType === "updatePassword" && (
        <PopUpdatePassword
          open={isOpen}
          onClose={closePopup}
          userDetails={userDetails}
          fetchUserDetails={fetchUserDetails}
          accessToken={accessToken}
        />
      )}

      {isOpen && popupType === "updateChangeStore" && (
        <PopChangeStore
          open={isOpen}
          onClose={closePopup}
          userDetails={userDetails}
          logout={handleLogout}
        />
      )}
    </Box>
  );
};

export default C_Navbar;
