import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useAuth from "../../contexts/AuthContext";
import { createCustomerServiceRequest } from "../../services/api/customerApi";
import { useNavigate } from "react-router-dom";
import { AccountBalance, AccountBalanceWallet } from "@mui/icons-material";

const useLaundryPlans = (onClose) => {
  const { userDetails } = useAuth();
  const [qrCode, setQrCode] = useState("");
  const [name, setName] = useState(userDetails.fullName);
  const [note, setNote] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("Cash on Delivery");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const paymentMethods = [
    {
      label: "Cash on Delivery",
      icon: <AccountBalanceWallet />,
      id: "Cash on Delivery",
    },
    { label: "GCash", icon: <AccountBalance />, id: "GCash" },
  ];

  const validateFields = () => {
    const newErrors = {};
    if (!name) {
      newErrors.name = "Customer name is required";
    }
    return newErrors;
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;

    if (field === "name") {
      setName(value);
    }
    if (field === "service_name") {
      setServiceType(value);
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };

  const handleSubmit = async (serviceId, e, selectedPayment, service_name) => {
    e.preventDefault();

    const newErrors = validateFields();
    setErrors(newErrors);

    if (!selectedPayment) {
      toast.error("Please select a payment method.");
      return;
    }

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      setTimeout(async () => {
        const storeId = userDetails.storeId;
        const customerData = {
          store_id: storeId,
          service_type_id: serviceId,
          service_name: service_name,
          customer_name: name,
          notes: note,
          payment_method: selectedPayment,
        };

        try {
          const response =
            await createCustomerServiceRequest.setCustomerServiceRequest(
              userDetails.userId,
              customerData
            );
          if (response.success) {
            toast.success(response.message);
            setQrCode(response.qr_code);
          } else {
            toast.error(response.message);
          }
        } catch (error) {
          toast.error(`Error with service request: ${error.message || error}`);
          console.log(error);
        } finally {
          setLoading(false);
        }
      }, 1000);
    } else {
      setLoading(false);
    }
  };

  return {
    qrCode,
    name,
    note,
    setName,
    setNote,
    serviceType,
    setServiceType,
    selectedService,
    setSelectedService,
    selectedPayment,
    setSelectedPayment,
    paymentMethods,
    handleInputChange,
    handleSubmit,
    loading,
    setLoading,
    errors,
    setErrors,
  };
};

export default useLaundryPlans;
