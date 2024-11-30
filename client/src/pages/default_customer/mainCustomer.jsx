import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import C_Navbar from "../../components/common/C_Navbar";
import C_Footer from "../../components/common/C_Footer";
import LoadingBar from "../../components/LoadingBar";
import showNotification from "../../utils/showNotification";

const LaundryServices = lazy(() =>
  import("../../pages").then((module) => ({ default: module.LaundryServices }))
);

const TrackOrders = lazy(() =>
  import("../../pages").then((module) => ({ default: module.TrackOrders }))
);

const PaymentHistory = lazy(() =>
  import("../../pages").then((module) => ({ default: module.PaymentHistory }))
);

const MainCustomer = () => {
  // useEffect(() => {
  //   // Show a toast every 5 seconds
  //   const intervalId = setInterval(() => {
  //     showNotification({
  //       message: "This is an automatic notification.",
  //       type: "info",
  //     });
  //   }, 5000);

  //   // Clear the interval on component unmount
  //   return () => clearInterval(intervalId);
  // }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <C_Navbar />
      <LoadingBar />
      <main className=" flex-grow bg-[#f1f1f1]">
        <section>
          <Suspense fallback={<LoadingBar />}>
            {/* <Suspense fallback={<div>Loading...</div>}> */}
            <Routes>
              <Route path="/" element={<Navigate to="laundry-services" />} />
              <Route path="laundry-services" element={<LaundryServices />} />
              <Route path="track-orders" element={<TrackOrders />} />
              <Route path="payment-history" element={<PaymentHistory />} />

              <Route
                path="*"
                element={<Navigate to="laundry-services" replace />}
              />
            </Routes>
          </Suspense>
        </section>
      </main>
      <C_Footer />
    </div>
  );
};

export default MainCustomer;
