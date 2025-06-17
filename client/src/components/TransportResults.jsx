import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

const TransportResults = () => {
  const location = useLocation();
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransport = async () => {
      setLoading(true);
      setError(null);

      // Parse query params
      const params = new URLSearchParams(location.search);
      const destination = params.get("destination") || "";
      const date = params.get("date") || "";
      let type = params.get("type") || "";
      const time = params.get("time") || "";

      // If type is "All" or empty, don't send it in query params
      if (type === "All") {
        type = "";
      }

      try {
        // Build API URL with query parameters, omit empty params
        const queryParams = new URLSearchParams();
        if (destination) queryParams.append("destination", destination);
        if (date) queryParams.append("date", date);
        if (type) queryParams.append("type", type);
        if (time) queryParams.append("time", time);

        const response = await fetch(`/api/transport?${queryParams.toString()}`);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        setFilteredData(data);
      } catch (err) {
        setError(err.message || "Failed to fetch transport data");
      } finally {
        setLoading(false);
      }
    };

    fetchTransport();
  }, [location.search]);

  // Helper: format ISO date string as readable date (YYYY-MM-DD)
  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    try {
      const d = new Date(isoDate);
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return isoDate;
    }
  };

  return (
    <div className="px-4 md:px-20 mt-20 mb-20 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-10 text-center text-gray-900">
        Available Transport Options
      </h1>

      {loading && (
        <p className="text-center text-gray-500 text-lg mt-20">Loading transport options...</p>
      )}

      {error && (
        <p className="text-center text-red-600 text-lg mt-20">
          Error: {error}
        </p>
      )}

      {!loading && !error && filteredData.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredData.map((item, idx) => (
            <div
              key={item._id || idx} // Prefer unique _id if available
              className="border border-gray-200 rounded-xl p-6 shadow-md bg-white hover:shadow-lg hover:scale-[1.03] transition-transform duration-300"
            >
              <h2 className="text-2xl font-semibold mb-3 text-blue-700">{item.type}</h2>
              <p className="mb-1 text-gray-700">
                <strong>Destination:</strong> {item.destination}
              </p>
              <p className="mb-1 text-gray-700">
                <strong>Date:</strong> {formatDate(item.date)}
              </p>
              <p className="mb-1 text-gray-700">
                <strong>Time:</strong> {item.time}
              </p>
              <p className="mb-3 text-gray-700">
                <strong>Price:</strong>{" "}
                <span className="text-green-600 font-semibold">${item.price}</span>
              </p>
              <p className="mt-2 text-gray-500 text-sm leading-relaxed italic">
                {item.details || "No additional details provided."}
              </p>
            </div>
          ))}
        </div>
      ) : (
        !loading && !error && (
          <p className="text-center text-gray-500 text-lg mt-20">
            No transport options found. Try different filters.
          </p>
        )
      )}

      <div className="text-center mt-16">
        <Link
          to="/transport"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg shadow hover:bg-blue-700 transition-colors duration-300 font-semibold"
        >
          Back to Search
        </Link>
      </div>
    </div>
  );
};

export default TransportResults;
