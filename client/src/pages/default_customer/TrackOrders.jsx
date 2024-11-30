import React, { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import useAuth from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import norequest from "../../assets/images/no_data_table.jpg";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/style";
import {
  ArrowFatLineLeft,
  ArrowFatLineRight,
  CheckCircle,
  XCircle,
} from "@phosphor-icons/react";
import { COLORS } from "../../constants/color";
import PopMessageStaff from "./components/PopMessageStaff";
import usePopup from "../../hooks/common/usePopup";
import useFetchData from "../../hooks/common/useFetchData";
import { getCustomerTrackOrderAndProgress } from "../../services/api/customerApi";
import { QRCodeCanvas } from "qrcode.react";
import background_1 from "../../assets/images/background_2.jpg";
import PopReceipt from "./components/PopReceipt";
import PopFeedbackAndReview from "./components/PopFeedbackAndReview";

const TrackOrders = () => {
  const navigate = useNavigate();
  const { userDetails } = useAuth();
  const [loading, setLoading] = useState(true);
  const { isOpen, popupType, openPopup, closePopup, popupData } = usePopup();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: orders, fetchData: fetchCustomerTrackOrder } = useFetchData();

  const fetchCustomerTrackOrderData = useCallback(async () => {
    setLoading(true);
    await fetchCustomerTrackOrder(
      getCustomerTrackOrderAndProgress.getCustomerTrackOrder,
      userDetails.userId
    );
    setLoading(false);
  }, [fetchCustomerTrackOrder, userDetails?.userId]);

  useEffect(() => {
    fetchCustomerTrackOrderData();
    const intervalId = setInterval(() => {
      fetchCustomerTrackOrderData();
    }, 3000);
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchCustomerTrackOrderData]);

  const nextOrder = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % orders.length);
  };

  const prevOrder = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? orders.length - 1 : prevIndex - 1
    );
  };

  const handleFeedbackSubmit = () => {
    setCurrentIndex(0); // Reset to the first order
    fetchCustomerTrackOrderData(); // Fetch new order data
  };

  return (
    <div
      className="flex flex-col flex-grow bg-gray-100 px-4 pt-2 pb-6 md:px-5 lg:px-10 lg:pb-8 3xl:px-8 3xl:pt-4 4xl:px-20 4xl:pb-9"
      style={{
        background: `linear-gradient(to right, rgba(87, 151, 200, 0.9), rgba(68, 127, 140, 0.9)), url(${background_1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-7xl mx-auto w-full">
        <h1
          className="text-3xl font-bold text-center mb-8 mt-8"
          style={{ color: styles.white }}
        >
          Track Your Laundry Orders
        </h1>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div
              className="bg-white rounded-lg shadow-sm p-4 max-w-md w-full relative"
              style={{ borderColor: styles.border, borderWidth: 1 }}
            >
              <img
                src={norequest}
                alt="No service request yet."
                className="w-full h-auto "
              />
            </div>
            <p
              className="text-lg font-semibold mb-4 mt-5"
              style={{ color: styles.white }}
            >
              You have not made any service requests yet
            </p>
            <button
              className={`bg-[${COLORS.accent}] text-white px-4 py-2 rounded mt-2 hover:bg-[#e76a4b]`}
              onClick={() => navigate("/customer-page/laundry-services")}
            >
              Go to Laundry Services
            </button>
          </div>
        ) : (
          <div className="relative flex items-center justify-center">
            {orders.length > 1 && (
              <button
                onClick={prevOrder}
                className="absolute left-0 z-10 w-12 h-12 flex items-center justify-center bg-white rounded-full border border-gray-300 shadow-md focus:outline-none hover:bg-gray-300"
              >
                <ArrowFatLineLeft
                  size={30}
                  color={COLORS.secondary}
                  weight="duotone"
                />
              </button>
            )}
            {/* Order Box */}
            <motion.div
              key={currentIndex}
              className="bg-white p-6 sm:p-10 lg:p-10 rounded-lg shadow-md border border-gray-300 mb-6 flex flex-col md:flex-row"
              initial={{ x: 100 }}
              animate={{ x: 0 }}
              exit={{ x: -100 }}
              transition={{ duration: 0.5 }}
            >
              {/* Order Info on the left */}
              <div className="flex-grow mb-20 md:mb-0 flex flex-col justify-between">
                <div className="mb-10">
                  <h2
                    className="text-base font-normal"
                    style={{ color: styles.primary }}
                  >
                    Tracking Number:
                  </h2>
                  <p
                    className="text-3xl font-bold"
                    style={{ color: styles.text3 }}
                  >
                    {orders[currentIndex]?.service_request.tracking_code ||
                      "N/A"}
                  </p>
                </div>

                <div className="flex flex-col md:flex-row justify-between mb-4">
                  <div className="mb-4 md:mb-0">
                    <p className="mb-2" style={{ color: styles.primary }}>
                      <span className="font-bold">Status:</span>
                      <span
                        className={`ml-2 inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          orders[currentIndex].service_request
                            .request_status === "Pending Pickup"
                            ? "bg-[#ff7f50] text-white"
                            : orders[currentIndex].service_request
                                .request_status === "Ongoing Pickup"
                            ? "bg-[#28a745] text-white"
                            : orders[currentIndex].service_request
                                .request_status === "Completed Pickup"
                            ? "bg-[#5787C8] text-white"
                            : orders[currentIndex].service_request
                                .request_status === "In Laundry"
                            ? "bg-[#17a2b8] text-white"
                            : orders[currentIndex].service_request
                                .request_status === "Ready for Delivery"
                            ? "bg-[#800080] text-white"
                            : orders[currentIndex].service_request
                                .request_status === "Completed Delivery"
                            ? "bg-[#5787C8] text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {orders[currentIndex].service_request.request_status}
                      </span>
                    </p>
                    <p className="mb-2 flex" style={{ color: styles.primary }}>
                      <span className="font-bold">Pickup Time:</span>
                      <span className="ml-2" style={{ color: styles.primary }}>
                        {orders[currentIndex].service_request.pickup_date}
                      </span>
                    </p>
                    <p className="mb-2 flex" style={{ color: COLORS.primary }}>
                      <span className="font-bold">Delivery Time:</span>
                      <span className="ml-2" style={{ color: COLORS.primary }}>
                        {orders[currentIndex].service_request.delivery_date}
                      </span>
                    </p>
                    <p className="mb-2 flex" style={{ color: COLORS.primary }}>
                      <span className="font-bold">Payment Method:</span>
                      <span
                        className="ml-2 font-semibold"
                        style={{ color: styles.secondary }}
                      >
                        {orders[currentIndex].service_request.payment_method}
                      </span>
                    </p>
                    <p className="mb-2 flex" style={{ color: styles.primary }}>
                      <span className="font-bold">
                        Pickup or Delivery Staff:
                      </span>
                      <span
                        className="ml-2 font-normal"
                        style={{ color: styles.primary }}
                      >
                        {orders[currentIndex].service_request.user_name}
                      </span>
                    </p>
                    <div className="relative inline-block">
                      {orders[currentIndex].service_request.request_status ===
                      "Completed Delivery" ? (
                        // "Add Feedback and Review" button when status is "Completed Delivery"
                        <button
                          className="bg-[#4CAF50] text-white px-4 py-2 rounded mt-2 hover:bg-[#388E3C]"
                          onClick={() => {
                            openPopup(
                              "addFeedback",
                              orders[currentIndex].service_request.user_id
                            );
                          }}
                        >
                          Share Your Feedback and Review
                        </button>
                      ) : (
                        // "Message the Delivery Staff" button for other statuses
                        <button
                          className={`bg-[#5787C8] text-white px-4 py-2 rounded mt-2 ${
                            orders[currentIndex].service_request.user_id
                              ? "hover:bg-[#3E5B8C]"
                              : "opacity-50 cursor-not-allowed"
                          }`}
                          onClick={() => {
                            openPopup(
                              "messageStaff",
                              orders[currentIndex].service_request.user_id
                            );
                          }}
                          disabled={
                            !orders[currentIndex].service_request.user_id
                          }
                        >
                          Message the Delivery Staff
                        </button>
                      )}

                      {/* Badge element - only shows if status is not "Completed Delivery" */}
                      {orders[currentIndex].service_request.request_status !==
                        "Completed Delivery" &&
                        orders[currentIndex].service_request.user_id > 0 &&
                        orders[currentIndex].service_request.unread_messages >
                          0 && (
                          <span className="absolute top-3 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                            {
                              orders[currentIndex].service_request
                                .unread_messages
                            }
                          </span>
                        )}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 flex" style={{ color: styles.primary }}>
                      <span className="font-bold">Selected Service:</span>
                      <span
                        className="ml-2 font-semibold"
                        style={{ color: styles.secondary }}
                      >
                        {orders[currentIndex].service_request.service_name}
                      </span>
                    </p>
                    <p className="mb-2" style={{ color: styles.primary }}>
                      <span className="font-bold">Base Price:</span>
                      <span
                        className="ml-2 font-semibold"
                        style={{ color: styles.error }}
                      >
                        {
                          orders[currentIndex].service_request
                            .service_default_price
                        }
                      </span>
                    </p>
                    <p className="mb-2" style={{ color: styles.primary }}>
                      <span className="font-bold">Assigned Unit:</span>
                      <span className="ml-2" style={{ color: styles.primary }}>
                        {orders[currentIndex].service_request.unit_name}
                      </span>
                    </p>
                    <p className="mb-2" style={{ color: styles.primary }}>
                      <span className="font-bold">Transaction:</span>
                      <span
                        className="ml-2 text-sm px-3 py-1 rounded-full font-semibold"
                        style={{
                          color:
                            orders[currentIndex].service_request
                              .transaction_status === "Pending"
                              ? COLORS.white
                              : orders[currentIndex].service_request
                                  .transaction_status === "Completed"
                              ? COLORS.white
                              : orders[currentIndex].service_request
                                  .transaction_status === "Waiting..."
                              ? COLORS.primary
                              : COLORS.secondary,
                          backgroundColor:
                            orders[currentIndex].service_request
                              .transaction_status === "Pending"
                              ? COLORS.error
                              : orders[currentIndex].service_request
                                  .transaction_status === "Completed"
                              ? COLORS.success
                              : orders[currentIndex].service_request
                                  .transaction_status === "Waiting..."
                              ? COLORS.background
                              : "transparent",
                        }}
                      >
                        {
                          orders[currentIndex].service_request
                            .transaction_status
                        }
                      </span>
                    </p>
                  </div>
                </div>

                {/* QR Code Below Timeline */}
                <div className="flex flex-col items-center mt-10">
                  <QRCodeCanvas
                    value={orders[currentIndex].service_request.qr_code}
                    alt="QR Code"
                    size={300}
                  />
                  <p
                    className="mt-4 text-center font-normal"
                    style={{ color: styles.primary }}
                  >
                    Wait for the staff to scan this QR code to update the
                    progress of your laundry order.
                  </p>
                </div>
                {/* Always positioned at the bottom */}
                <div className="mt-12 w-full flex flex-col md:flex-row justify-between items-center">
                  <p
                    className="text-2xl font-bold text-center md:text-left"
                    style={{ color: COLORS.text }}
                  >
                    Total Amount:
                    {orders[currentIndex].service_request.assignment_id ===
                    "Waiting for total amount..." ? (
                      <span
                        style={{
                          color: COLORS.primary,
                          fontWeight: 400,
                          marginLeft: 10,
                          fontSize: 20,
                        }}
                      >
                        {orders[currentIndex].service_request.assignment_id}
                      </span>
                    ) : (
                      <span style={{ color: COLORS.secondary, marginLeft: 10 }}>
                        ₱{orders[currentIndex].total_amount}
                      </span>
                    )}
                  </p>
                  <div className="flex flex-col md:flex-row items-center mt-4 md:mt-0">
                    <button
                      className={`ml-4 bg-[#5787C8] text-white px-6 py-2 rounded hover:bg-[#3E5B8C] w-full md:w-auto mb-2 md:mb-0 ${
                        orders[currentIndex].service_request.assignment_id ===
                        "Waiting for total amount..."
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() => {
                        if (
                          orders[currentIndex].service_request.assignment_id !==
                          "Waiting for total amount..."
                        ) {
                          openPopup(
                            "showReceipt",
                            orders[currentIndex].service_request.assignment_id
                          );
                        }
                      }}
                      disabled={
                        orders[currentIndex].service_request.assignment_id ===
                        "Waiting for total amount..."
                      }
                    >
                      View Receipt
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress Timeline on the right */}
              <div className="md:w-auto flex-shrink-0 md:pl-20 ">
                <h3
                  className="text-xl font-bold mb-4"
                  style={{ color: styles.secondary }}
                >
                  Service Request Progress
                </h3>
                <div className="relative pt-2">
                  <div className="border-l-2 border-[#5787C8] pl-4 space-y-4">
                    {orders[currentIndex].progress.map((step, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div
                          className={`h-6 w-6 rounded-full flex items-center justify-center ${
                            step.completed ? "bg-[#5787C8]" : "bg-gray-300"
                          }`}
                        >
                          {step.completed ? (
                            <CheckCircle
                              size={20}
                              color={COLORS.white}
                              weight="duotone"
                            />
                          ) : (
                            <XCircle
                              size={20}
                              color={COLORS.white}
                              weight="duotone"
                            />
                          )}
                        </div>
                        <div>
                          <p
                            className="font-bold"
                            style={{ color: styles.text3 }}
                          >
                            {step.stage}
                          </p>
                          <p
                            className="font-normal"
                            style={{ color: styles.text3 }}
                          >
                            {step.status_date && (
                              <span className="text-[#5787C8] text-xs">
                                {format(
                                  new Date(step.status_date),
                                  "MMMM d, yyyy, h:mm a"
                                )}
                              </span>
                            )}
                          </p>
                          <p
                            className="text-[#595959] text-sm font-normal"
                            style={{ color: styles.primary }}
                          >
                            {step.completed
                              ? step.description
                              : step.false_description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
            {orders.length > 1 && (
              <button
                onClick={nextOrder}
                className="absolute right-0 z-10 w-12 h-12 flex items-center justify-center bg-white rounded-full border border-gray-300 shadow-md focus:outline-none hover:bg-gray-300"
              >
                <ArrowFatLineRight
                  size={30}
                  color={COLORS.secondary}
                  weight="duotone"
                />
              </button>
            )}
          </div>
        )}
      </div>
      {/* Popup */}
      {isOpen && popupType === "messageStaff" && (
        <PopMessageStaff
          open={isOpen}
          onClose={closePopup}
          receiverId={popupData}
        />
      )}
      {isOpen && popupType === "showReceipt" && (
        <PopReceipt
          open={isOpen}
          onClose={closePopup}
          assignmentId={orders[currentIndex].service_request.assignment_id}
          customerData={orders[currentIndex]}
        />
      )}

      {isOpen && popupType === "addFeedback" && (
        <PopFeedbackAndReview
          open={isOpen}
          onClose={closePopup}
          userId={userDetails.userId}
          storeId={userDetails.storeId}
          serviceRequest={orders[currentIndex].service_request.id}
          onFeedbackSubmit={handleFeedbackSubmit}
        />
      )}
    </div>
  );
};

export default TrackOrders;
