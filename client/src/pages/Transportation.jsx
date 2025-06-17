import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Transportation = () => {
  const [selectedDestination, setSelectedDestination] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!selectedDestination || !selectedDate) {
      alert("Please enter both destination and date.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Build query string with all filters except 'All' type
      const params = new URLSearchParams();
      params.append("destination", selectedDestination);
      params.append("date", selectedDate);
      if (selectedType !== "All") params.append("type", selectedType);
      if (selectedTime) params.append("time", selectedTime);

      // *** Fix API URL: use /api/transport (not /api/transportation) ***
      const response = await fetch(`/api/transport?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch transportation options");
      }

      const data = await response.json();

      // Navigate to results page passing query params (better for reload)
      navigate(`/transport/results?${params.toString()}`);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 md:px-20 mt-32 mb-20 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-10">Transportation Finder 🚍</h1>

      {/* Search Panel */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <input
          type="text"
          placeholder="Destination"
          value={selectedDestination}
          onChange={(e) => setSelectedDestination(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg shadow focus:outline-none"
        />

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg shadow focus:outline-none"
        />

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg shadow focus:outline-none"
        >
          <option value="All">All Types</option>
          <option value="Bus">Bus</option>
          <option value="Train">Train</option>
          <option value="Taxi">Taxi</option>
        </select>

        <input
          type="time"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg shadow focus:outline-none"
        />
      </div>

      {/* Search Button */}
      <div className="text-center mb-16">
        <button
          onClick={handleSearch}
          disabled={loading}
          className={`${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          } text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-md transition-all duration-300`}
        >
          {loading ? "Searching..." : "Search Transport"}
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-center text-red-600 font-semibold mb-4">{error}</p>}
    </div>
  );
};

export default Transportation;
