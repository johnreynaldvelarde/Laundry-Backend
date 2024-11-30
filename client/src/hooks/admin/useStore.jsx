import React, { useState } from "react";
import { viewStore } from "../../services/api/getApi";

const useStore = () => {
  const [storeData, setStoreData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStoreData = async () => {
    try {
      const response = await viewStore.getStoreList({});
      setStoreData(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return {
    storeData,
    loading,
    error,

    fetchStoreData,
  };
};

export default useStore;
