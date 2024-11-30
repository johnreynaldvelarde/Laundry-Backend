import React from "react";
import {
  House,
  CurrencyDollar,
  Handshake,
  Share,
  Layout,
  WashingMachine,
  Calendar,
  Storefront,
  Users,
  User,
  ChatsCircle,
  Gear,
  ShoppingCart,
  Stack,
  ArchiveBox,
  EnvelopeSimple,
  Rss,
  Archive,
  ReadCvLogo,
  Pulse,
  CellSignalHigh,
} from "@phosphor-icons/react";

const iconSize = 20; // Set your desired icon size here

export const links = [
  {
    name: "Dashboard",
    icon: React.createElement(Layout, { weight: "duotone", size: iconSize }),
    url: "/main/dashboard",
  },
  {
    name: "Monitored Units",
    icon: React.createElement(WashingMachine, {
      weight: "duotone",
      size: iconSize,
    }),
    url: "/main/unit-monitor",
  },
  {
    name: "View Schedules",
    icon: React.createElement(Calendar, { weight: "duotone", size: iconSize }),
    url: "/main/schedule",
  },
  {
    name: "View Customers",
    icon: React.createElement(User, { weight: "duotone", size: iconSize }),
    url: "/main/customers",
  },
  {
    name: "Inbox",
    icon: React.createElement(ChatsCircle, {
      weight: "duotone",
      size: iconSize,
    }),
    url: "/main/inbox",
  },
  {
    name: "Inventory",
    icon: React.createElement(ArchiveBox, {
      weight: "duotone",
      size: iconSize,
    }),
    url: "/main/inventory",
  },
  {
    name: "Store Management",
    icon: React.createElement(Storefront, {
      weight: "duotone",
      size: iconSize,
    }),
    url: "/main/store",
  },
  {
    name: "User Management",
    icon: React.createElement(Users, { weight: "duotone", size: iconSize }),
    url: "/main/all-user",
  },
  {
    name: "Reviews",
    icon: React.createElement(Rss, {
      weight: "duotone",
      size: iconSize,
    }),
    url: "/main/reviews",
  },
  {
    name: "Services Management",
    icon: React.createElement(CellSignalHigh, {
      weight: "duotone",
      size: iconSize,
    }),
    url: "/main/services-management",
  },
  {
    name: "Transactions History",
    icon: React.createElement(ReadCvLogo, {
      weight: "duotone",
      size: iconSize,
    }),
    url: "/main/transactions-history",
  },
  {
    name: "Activity Log",
    icon: React.createElement(Pulse, { weight: "duotone", size: iconSize }),
    url: "/main/activity-log",
  },
  {
    name: "Settings",
    icon: React.createElement(Gear, { weight: "duotone", size: iconSize }),
    url: "/main/settings",
  },
  {
    name: "Configuration",
    icon: React.createElement(Stack, { weight: "duotone", size: iconSize }),
    url: "/main/configuration",
  },
  {
    name: "Archived",
    icon: React.createElement(Archive, { weight: "duotone", size: iconSize }),
    url: "/main/configuration",
  },
];
