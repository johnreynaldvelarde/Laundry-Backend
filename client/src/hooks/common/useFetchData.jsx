// import { useState, useCallback } from "react";

// const useFetchData = () => {
//   const [data, setData] = useState([]);

//   const fetchData = useCallback(async (apiCall, params = {}) => {
//     try {
//       const response = await apiCall(params);
//       if (response) {
//         setData(response.data || []);
//       } else {
//         console.error("Unexpected response format:", response);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   }, []); // Empty dependency array to keep the function stable

//   return { data, fetchData };
// };

// export default useFetchData;
import { useState, useCallback } from "react";

const useFetchData = () => {
  const [data, setData] = useState([]);

  const fetchData = useCallback(async (apiCall, ...params) => {
    try {
      const response = await apiCall(...params); // Spread the params
      if (response) {
        setData(response.data || []);
      } else {
        console.error("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []); // Keep this empty for stable reference

  return { data, fetchData };
};

export default useFetchData;
