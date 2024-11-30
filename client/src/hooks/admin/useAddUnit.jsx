import { useEffect, useState, useRef } from "react";
import useAuth from "../../contexts/AuthContext";
import { createUnit } from "../../services/api/postApi";
import { getUnitName } from "../../services/api/getApi";
import toast from "react-hot-toast";

const STATUS_MAP = {
  Available: 0,
  Occupied: 1,
  "In Maintenance": 2,
};

const useAddUnit = ({ onClose, refreshData }) => {
  const { userDetails } = useAuth();
  const [unitName, setUnitName] = useState("");
  const [isUnitStatus, setUnitStatus] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const imageInput = useRef(null);

  const fetchSuggestedUnitName = async () => {
    if (userDetails?.storeId) {
      try {
        const response = await getUnitName.getSuggestedUnitName(
          userDetails.storeId
        );
        if (response.success) {
          setUnitName(response.unit_name);
        } else {
          console.error("Failed to fetch suggested unit name");
        }
      } catch (error) {
        console.error("Error fetching suggested unit name:", error);
      }
    } else {
      console.error("Store ID is undefined.");
    }
  };

  useEffect(() => {
    fetchSuggestedUnitName();
  }, [userDetails?.storeId]);

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    if (field === "unitName") {
      setUnitName(value);
    } else if (field === "unitStatus") {
      setUnitStatus(value);
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };

  const validateFields = () => {
    const newErrors = {};
    if (!isUnitStatus) newErrors.unitStatus = "Unit Status is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateFields();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const numericStatus = STATUS_MAP[isUnitStatus];

        const response = await createUnit.setUnit({
          store_id: userDetails.storeId,
          unit_name: unitName,
          isUnitStatus: numericStatus,
        });

        if (response.success) {
          toast.success(response.message);
          refreshData();
          onClose();
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error("Error submitting the form", error);
      }
    }
  };

  return {
    unitName,
    setUnitName,
    isUnitStatus,
    setUnitStatus,
    image,
    setImage,
    errors,
    setErrors,
    imageInput,
    handleInputChange,
    loading,
    handleSubmit,
  };
};

export default useAddUnit;
