import { useEffect, useCallback } from "react";
import useFetchData from "../../hooks/common/useFetchData";

const usePollingFetch = (apiCalls, interval = 5000) => {
  const fetchDataCallbacks = apiCalls.map(() => useFetchData()); // Create an array of hooks

  const fetchData = useCallback(() => {
    fetchDataCallbacks.forEach((fetchCallback, index) => {
      const { fetchFunc, params } = apiCalls[index]; // Destructure here
      if (params.storeId) {
        fetchCallback.fetchData(fetchFunc, params); // Call fetchData with correct params
      }
    });
  }, [fetchDataCallbacks, apiCalls]);

  useEffect(() => {
    fetchData(); // Initial fetch

    const intervalId = setInterval(fetchData, interval); // Set up polling

    return () => {
      clearInterval(intervalId); // Clean up
    };
  }, [fetchData, interval]);

  return fetchDataCallbacks; // Return the data and loading/error states
};

export default usePollingFetch;
