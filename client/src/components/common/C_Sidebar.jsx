import React from "react";
import { Link } from "react-router-dom";
import { c_navItems } from "../../constants/index"; // Import your nav items
import LaundryIcon from "@mui/icons-material/LocalLaundryService"; // Replace with appropriate icons
import TrackOrdersIcon from "@mui/icons-material/TrackChanges"; // Replace with appropriate icons
import PaymentHistoryIcon from "@mui/icons-material/Payment"; // Replace with appropriate icons

function C_Sidebar() {
  return (
    <div className="fixed top-1/2 left-0 transform -translate-y-1/2 w-64 h-auto bg-white shadow-lg py-4 px-2">
      <div className="flex flex-col items-center space-y-4">
        {c_navItems.map((item, index) => {
          // Determine which icon to display based on the item label
          let icon;
          switch (item.label) {
            case "Laundry Services":
              icon = <LaundryIcon />;
              break;
            case "Track Orders":
              icon = <TrackOrdersIcon />;
              break;
            case "Payment History":
              icon = <PaymentHistoryIcon />;
              break;
            default:
              icon = null;
          }

          return (
            <div key={index} className="relative">
              <Link
                to={item.href}
                className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-200"
              >
                <span className="text-2xl">{icon}</span>{" "}
                {/* Increase icon size if needed */}
                {item.notificationCount > 0 && (
                  <span className="absolute top-[-5px] right-[-10px] bg-red-500 text-white text-xs font-normal rounded-full w-5 h-5 flex items-center justify-center">
                    {item.notificationCount > 99
                      ? "+99"
                      : item.notificationCount}
                  </span>
                )}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default C_Sidebar;
