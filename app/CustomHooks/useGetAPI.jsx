import { useState, useEffect } from "react";
import axios from "axios";

const useGETAPI = (url) => {
  const [data, setData] = useState(null); // Use null instead of [] to support objects or arrays
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Optional: add error handling

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        setData(response.data); // Generic: use response.data directly
        console.log("Fetched Data:", response.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useGETAPI;