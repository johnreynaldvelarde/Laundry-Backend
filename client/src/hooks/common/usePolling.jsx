import { useEffect, useState } from "react";

const usePolling = (fetchData, interval) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPolling, setIsPolling] = useState(true);

  useEffect(() => {
    const fetchAndUpdate = async () => {
      if (!isPolling) return;

      setLoading(true);
      try {
        const result = await fetchData();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchAndUpdate();
    const pollingInterval = setInterval(fetchAndUpdate, interval);

    return () => {
      clearInterval(pollingInterval);
    };
  }, [fetchData, interval, isPolling]);

  return { data, loading, error, setIsPolling };
};

export default usePolling;
