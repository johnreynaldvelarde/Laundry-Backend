import React from "react";
import logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";

import styles from "../../style";

import Button from "@mui/material/Button";

// icons
import { RxDashboard } from "react-icons/rx";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { MdOutlineStorefront } from "react-icons/md";
import { MdOutlineWarehouse } from "react-icons/md";

const AdminSidebar = () => {
  return (
    <div className="sidebar fixed top-0 left-0 z-[100] w-[15%] bg-white h-full shadow-md">
      <Link to="/">
        <div className="flex items-center flex-shrink-0 p-4">
          <img className="h-12 w-12 mr-1" src={logo} alt="logo" />
          <span className="text-xl tracking-tight">
            <span className="font-bold" style={{ color: styles.textColor1 }}>
              Lizaso
            </span>
            <span className="font-regular" style={{ color: styles.textColor2 }}>
              Laundry Hub
            </span>
          </span>
        </div>
      </Link>

      <div className="sidebarTabs">
        <Button
          fullWidth
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: 2,
            px: 3,
            borderRadius: 1,
          }}
        >
          <span className="icon mr-2 w-[25px] h-[25px] flex items-center justify-center rounded-md">
            <RxDashboard className="w-full h-full" />
          </span>
          Dashboard
        </Button>

        <Button
          fullWidth
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: 2,
            px: 3,
            borderRadius: 1,
          }}
        >
          <span className="icon mr-2 w-[25px] h-[25px] flex items-center justify-center rounded-md">
            <RxDashboard className="w-full h-full" />
          </span>
          Laundry Unit
        </Button>

        <Button
          fullWidth
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: 2,
            px: 3,
            borderRadius: 1,
          }}
        >
          <span className="icon mr-2 w-[25px] h-[25px] flex items-center justify-center rounded-md">
            <RiCalendarScheduleLine className="w-full h-full" />
          </span>
          Schedule
        </Button>

        <Button
          fullWidth
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: 2,
            px: 3,
            borderRadius: 1,
          }}
        >
          <span className="icon mr-2 w-[25px] h-[25px] flex items-center justify-center rounded-md">
            <MdOutlineStorefront className="w-full h-full" />
          </span>
          Multi-Store
        </Button>

        <Button
          fullWidth
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: 2,
            px: 3,
            borderRadius: 1,
          }}
        >
          <span className="icon mr-2 w-[25px] h-[25px] flex items-center justify-center rounded-md">
            <MdOutlineWarehouse className="w-full h-full" />
          </span>
          Inventory
        </Button>
      </div>

      {/* <div className="sidebarTabs px-3">
        <Link className="w-full">
          <button className="w-full flex items-center justify-center py-2 px-4 text-left text-white rounded-md">
            <RxDashboard className="mr-2 w-6 h-6" /> Dashboard
          </button>
        </Link>
      </div> */}
    </div>
  );
};

export default AdminSidebar;
