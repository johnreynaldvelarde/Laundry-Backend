import { Box, Divider, Drawer, List, Toolbar } from "@mui/material";
import React from "react";
import logo from "../../assets/images/logo.png";
import { links } from "../../data/links";
import styles from "../../styles/style";
import SideItem from "./SideItem";
import SideCollapse from "./SideCollapse";
import useAuth from "../../contexts/AuthContext";

const Sidebar = ({ window, sideBarWidth, mobileOpen, handleDrawerToggle }) => {
  const { userDetails } = useAuth();
  const filteredLinks = links.filter(
    (link) =>
      link.name !== "Configuration" &&
      link.name !== "Archived" &&
      link.name !== "Settings" &&
      (link.name !== "Store Management" ||
        userDetails?.roleName === "Administrator")
  );
  const drawer = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%", // Ensure the Box takes up full height
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backgroundColor: "sidebar.background",
        }}
      >
        <Toolbar>
          <img className="h-12 w-12 mr-1 mb-2" src={logo} alt="Logo" />
          <span className="text-xl tracking-tight">
            <span className="font-bold" style={{ color: styles.textColor1 }}>
              Lizaso
            </span>
            <span className="font-regular" style={{ color: styles.textColor2 }}>
              {" "}
              Laundry Hub
            </span>
          </span>
        </Toolbar>
        <Divider />
      </Box>

      {/* Scrollable List */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          borderRightWidth: 1,
          borderRightColor: "divider",
        }}
      >
        <List
          disablePadding
          sx={{
            height: "100%",
          }}
          className="sidebar-scrollable"
        >
          {filteredLinks.map((link, index) =>
            link?.subLinks ? (
              <SideCollapse {...link} key={index} />
            ) : (
              <SideItem {...link} key={index} />
            )
          )}
        </List>
      </Box>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box
      component="nav"
      sx={{
        width: { md: sideBarWidth },
        flexShrink: { md: 0 },
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        height: "100vh", // Ensure the Sidebar takes up full viewport height
      }}
      aria-label="mailbox folders"
    >
      {/* For Mobile and Small-Sized Tablets */}
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: sideBarWidth,
            backgroundColor: "sidebar.background",
            color: "sidebar.textColor",
            overflow: "auto",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* For Desktop and large-sized tablets */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: sideBarWidth,
            boxSizing: "border-box",
            borderRight: 0,
            backgroundColor: "sidebar.background",
            color: "sidebar.textColor",
            overflow: "auto",
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
