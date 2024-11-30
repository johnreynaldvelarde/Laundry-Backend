import styled from "@emotion/styled";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { FiChevronRight, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { NavLink, useLocation } from "react-router-dom";
import styles from "../../styles/style";

const SideCollapse = ({ name, icon, url, subLinks }) => {
  const [open, setOpen] = React.useState(false);
  const currentPath = useLocation().pathname;

  useEffect(() => {
    subLinks.forEach((link) => {
      if (currentPath === link.url) {
        setOpen(true);
      }
    });
  }, [currentPath, subLinks]);

  const CustomListItemText = styled(ListItemText)({
    fontSize: "10px !important",
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      border: `2px solid ${styles.IconColor1}`,
      top: "50%",
      left: "-20px",
      transform: "translateY(-50%)",
    },
  });

  return (
    <>
      <ListItemButton
        onClick={() => setOpen(!open)}
        sx={{
          "&:hover": { backgroundColor: "sidebar.hoverBg" },
          paddingY: "10px",
          paddingX: "24px",
        }}
      >
        <ListItemIcon sx={{ color: "sidebar.textColor" }}>{icon}</ListItemIcon>
        <ListItemText
          primary={name}
          sx={{ ml: "-10px", color: styles.textColor2 }}
          // primaryTypographyProps={{ fontWeight: "500" }}
        />
        {open ? <FiChevronDown /> : <FiChevronRight />}
      </ListItemButton>
      <Collapse in={open} timeout="auto">
        <List>
          {subLinks.map(({ name, url }, index) => (
            <NavLink
              to={url}
              style={{ textDecoration: "none" }}
              key={index}
              end
              activeclassname="active"
            >
              <ListItemButton
                className="linkBtn sub-link"
                key={index}
                sx={{
                  "&:hover": { backgroundColor: "sidebar.hoverBg" },
                  paddingY: "8px",
                  paddingLeft: "70px",
                }}
              >
                <CustomListItemText
                  primary={name}
                  sx={{
                    color: styles.textColor2,
                    // color: "sidebar.textColor",
                  }}
                  // primaryTypographyProps={{ fontWeight: "500" }}
                />
              </ListItemButton>
            </NavLink>
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default SideCollapse;
