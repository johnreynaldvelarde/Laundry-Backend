import { jsPDF } from "jspdf";
import {
  isWithinInterval,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isToday,
  format,
} from "date-fns";

export const generatePDF = async (ref) => {
  const input = ref.current;

  if (input) {
    const canvas = await html2canvas(input); // Convert to canvas
    const imgData = canvas.toDataURL("image/png"); // Get image data
    const pdf = new jsPDF(); // Create a new PDF instance
    pdf.addImage(imgData, "PNG", 0, 0); // Add image to PDF
    pdf.save("transaction_receipt.pdf"); // Save the PDF
  }
};

export const transactionDate = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long", // Full month name (e.g., January)
  day: "numeric",
});

export const transactionTime = new Date().toLocaleTimeString("en-US", {
  hour: "numeric",
  minute: "numeric",
  hour12: true, // 12-hour format with AM/PM
});

export const checkDateMatch = (option, date) => {
  const now = new Date();
  switch (option) {
    case "Last 24 Hours":
      return isWithinInterval(date, { start: subDays(now, 1), end: now });
    case "Last 7 Days":
      return isWithinInterval(date, { start: subDays(now, 7), end: now });
    case "Last 30 Days":
      return isWithinInterval(date, { start: subDays(now, 30), end: now });
    case "This Month":
      return isWithinInterval(date, {
        start: startOfMonth(now),
        end: endOfMonth(now),
      });
    case "This Year":
      return isWithinInterval(date, {
        start: startOfYear(now),
        end: endOfYear(now),
      });
    case "All Time":
      return true; // All dates match
    default:
      return false; // Handle any unknown options
  }
};

export const getCurrentDay = () => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = new Date();
  return daysOfWeek[today.getDay()];
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return distance.toFixed(1);
};

export const formatTimeNotification = (dateString) => {
  if (!dateString) {
    return "No date available";
  }

  const notificationDate = new Date(dateString);

  if (isNaN(notificationDate.getTime())) {
    return "Invalid date";
  }

  // Format the date
  if (isToday(notificationDate)) {
    return format(notificationDate, "hh:mm a");
  } else {
    return format(notificationDate, "MMMM d, yyyy");
  }
};
