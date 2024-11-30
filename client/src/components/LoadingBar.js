// import React, { useEffect } from "react";
// import NProgress from "nprogress"; // Import NProgress
// import { useLocation } from "react-router-dom";
// import "../styles/nprogress.css";

// const LoadingTopBar = () => {
//   const location = useLocation(); // Get the current location

//   useEffect(() => {
//     NProgress.configure({ showSpinner: false }); // Configure NProgress
//     NProgress.start(); // Start the loading bar

//     // Complete the loading bar after a short delay
//     const timer = setTimeout(() => {
//       NProgress.done(); // Complete the loading bar
//     }, 500); // Adjust the time as needed

//     return () => {
//       clearTimeout(timer); // Cleanup on unmount
//       NProgress.done(); // Ensure loading completes
//     };
//   }, [location]); // Run effect when the location changes

//   return null; // No UI needed
// };

// export default LoadingTopBar;

// import React, { useEffect } from "react";
// import NProgress from "nprogress";
// import { useLocation } from "react-router-dom";
// import "../styles/nprogress.css";

// const LoadingTopBar = () => {
//   const location = useLocation();

//   useEffect(() => {
//     NProgress.start();

//     // Simulate loading or data fetching
//     const handle = () => {
//       NProgress.done();
//     };

//     // Cleanup function to ensure loading completes
//     return () => {
//       NProgress.done();
//     };
//   }, [location]); // Trigger effect on route change

//   return null;
// };

// export default LoadingTopBar;

// import React, { useEffect } from "react";
// import NProgress from "nprogress"; // Import NProgress
// import { useLocation } from "react-router-dom";
// import "../styles/nprogress.css"; // Import NProgress styles

// const LoadingBar = () => {
//   const location = useLocation(); // Get the current location

//   useEffect(() => {
//     NProgress.configure({ showSpinner: false }); // Disable the spinner
//     NProgress.start(); // Start the loading bar

//     return () => {
//       NProgress.done(); // Complete the loading bar on unmount
//     };
//   }, [location]); // Run effect when the location changes

//   return null; // No UI needed
// };

// export default LoadingBar;

import React, { useEffect } from "react";
import NProgress from "nprogress"; // Import NProgress
import { useLocation } from "react-router-dom";
import "../styles/nprogress.css"; // Import NProgress styles

const LoadingBar = () => {
  const location = useLocation(); // Get the current location

  useEffect(() => {
    NProgress.configure({ showSpinner: false }); // Disable the spinner
    NProgress.start(); // Start the loading bar

    // Wait until the next tick to call done, allowing for the render to finish
    const timer = setTimeout(() => {
      NProgress.done(); // Complete the loading bar after a delay
    }, 300); // Adjust the time as needed

    return () => {
      clearTimeout(timer); // Cleanup timer
      NProgress.done(); // Ensure loading completes on unmount
    };
  }, [location]); // Run effect when the location changes

  return null; // No UI needed
};

export default LoadingBar;
