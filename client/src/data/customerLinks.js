import React from "react";
import { WashingMachine, Basket, CalendarCheck } from "@phosphor-icons/react";

const iconSize = 20; // Set your desired icon size here

export const customerLinks = [
  {
    name: "Laundry Services",
    icon: React.createElement(Basket, {
      weight: "duotone",
      size: iconSize,
    }),
    url: "/customer-page/laundry-services",
  },
  {
    name: "Track Orders",
    icon: React.createElement(WashingMachine, {
      weight: "duotone",
      size: iconSize,
    }),
    url: "/customer-page/track-orders",
  },
  {
    name: "Payment History",
    icon: React.createElement(CalendarCheck, {
      weight: "duotone",
      size: iconSize,
    }),
    url: "/customer-page/payment-history",
  },
];
