import Available from "../../../../assets/images/Available.png";
import Occupied from "../../../../assets/images/Occupied.png";
import Reserved from "../../../../assets/images/Reserved.png";
import In_Maintaince from "../../../../assets/images/Not_Available.png";

export const getUnitImage = (status) => {
  switch (status) {
    case 0:
      return Available;
    case 1:
      return Occupied;
    case 2:
      return In_Maintaince;
    default:
      return Available;
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
