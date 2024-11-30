import { useState } from "react";

const usePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [popupData, setPopupData] = useState(null); // Store the popupData (like user_id)

  const openPopup = (type, data) => {
    setPopupType(type);
    setPopupData(data); // Set the data when opening the popup
    setIsOpen(true);
  };

  const closePopup = () => {
    setPopupType(null);
    setPopupData(null); // Clear popup data
    setIsOpen(false);
  };

  return {
    isOpen,
    popupType,
    popupData, // Return popupData
    openPopup,
    closePopup,
  };
};

export default usePopup;

// const usePopup = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [popupType, setPopupType] = useState(null);
//   const [popupData, setPopupData] = useState(null); // State for additional data

//   const openPopup = (type, data = null) => {
//     // Accept an optional data argument
//     setPopupType(type);
//     setPopupData(data); // Store the passed data
//     setIsOpen(true);
//   };

//   const closePopup = () => {
//     setPopupType(null);
//     setPopupData(null); // Reset the data when closing
//     setIsOpen(false);
//   };

//   return {
//     isOpen,
//     popupType,
//     popupData, // Return the data alongside other values
//     openPopup,
//     closePopup,
//   };
// };

// export default usePopup;

// import { useState } from "react";

// const usePopup = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [popupType, setPopupType] = useState(null);
//   const [popupData, setPopupData] = useState(null);

//   const openPopup = (type) => {
//     setPopupType(type);
//     setIsOpen(true);
//   };

//   const closePopup = () => {
//     setPopupType(null);
//     setIsOpen(false);
//   };

//   return {
//     isOpen,
//     popupType,
//     openPopup,
//     closePopup,
//   };
// };

// export default usePopup;
