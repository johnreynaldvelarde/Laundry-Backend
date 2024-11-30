import { useState } from "react";
import { toast } from "react-hot-toast";
import CustomToast from "../../components/common/CustomToast";

import { createStore } from "../../services/api/postApi";

const useAddBranch = () => {
  const [storeNo, setStoreNo] = useState("");
  const [storeName, setStoreName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [location, setLocation] = useState("");
  const [errors, setErrors] = useState({});

  const handleClear = () => {
    setStoreName("");
    setStoreNo("");
    setContactNumber("");
    setLocation("");
    setErrors({});
  };

  const handleGenerateStoreNo = () => {
    const generatedStoreNo = "LIZASO" + Math.floor(1000 + Math.random() * 9000);
    setStoreNo(generatedStoreNo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!storeName) newErrors.storeName = "Store Name is required";
    if (!storeNo) newErrors.storeNo = "Store No is required";
    if (!contactNumber) newErrors.contactNumber = "Contact Number is required";
    if (!location) newErrors.location = "Location is required";
    setErrors(newErrors);

    // Proceed only if there are no validation errors
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await createStore.setStore({
          store_no: storeNo,
          store_name: storeName,
          store_address: location,
          store_contact: contactNumber,
        });

        if (!response.success) {
          // alert(response.message || "Cannot Proceed");
          <CustomToast
            t={t}
            type="error"
            message={response.message || "Cannot Proceed"}
          />;
        } else {
          alert("Submission Successful!");
          // <CustomToast t={t} type="success" message="Submission Successful!" />;
          handleClear();
        }
      } catch (error) {
        // alert(error.message || "Cannot Proceed");
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="error"
            message={error.message || "Cannot Proceed"}
          />
        ));
      }
    }
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    switch (field) {
      case "storeNo":
        setStoreNo(value);
        break;
      case "storeName":
        setStoreName(value);
        break;
      case "contactNumber":
        setContactNumber(value);
        break;
      case "location":
        setLocation(value);
        break;
      default:
        break;
    }
    // Clear the specific error for the field being edited
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };

  return {
    storeNo,
    setStoreNo,
    storeName,
    setStoreName,
    contactNumber,
    setContactNumber,
    location,
    setLocation,
    errors,
    setErrors,
    handleGenerateStoreNo,
    handleSubmit,
    handleInputChange,
    handleClear,
  };
};

export default useAddBranch;
