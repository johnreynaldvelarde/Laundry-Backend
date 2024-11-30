import { ListItemButton, ListItemIcon, Typography } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";
import styles from "../../styles/style";
import { COLORS } from "../../constants/color";

const SideItem = ({ name, icon, url }) => {
  return (
    <NavLink to={url} style={{ textDecoration: "none" }} end>
      {({ isActive }) => (
        <ListItemButton
          className="linkBtn"
          sx={{
            "&:hover": { backgroundColor: "sidebar.hoverBg" },
            paddingY: "15px",
            paddingX: "24px",
            color: COLORS.secondary,
            position: "relative", // Ensure that the button is positioned correctly for the pseudo-element
            // Styles for the active state
            "&::before": isActive
              ? {
                  borderTopRightRadius: 5,
                  borderBottomRightRadius: 5,
                  position: "absolute",
                  content: '""',
                  height: "100%",
                  width: "7px",
                  left: 0,
                  top: 0,
                  backgroundColor: COLORS.secondary,
                }
              : undefined, // Don't apply the before styles if not active
          }}
        >
          <ListItemIcon sx={{ color: COLORS.primary }}>{icon}</ListItemIcon>
          <Typography
            variant="body1"
            sx={{ ml: "-10px", color: COLORS.primary, fontWeight: 400 }}
          >
            {name}
          </Typography>
        </ListItemButton>
      )}
    </NavLink>
  );
};

export default SideItem;
