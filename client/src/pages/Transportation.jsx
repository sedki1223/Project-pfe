import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBus, FaTrain, FaTaxi, FaMapMarkerAlt, FaClock } from "react-icons/fa";

const Transportation = () => {
  const [selectedDestination, setSelectedDestination] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedTime, setSelectedTime] = useState("");

  const navigate = useNavigate();

  const handleSearch = () => {
    if (!selectedDestination || !selectedDate) {
      alert("Please enter both destination and date.");
      return;
    }

    const params = new URLSearchParams();
    params.append("destination", selectedDestination);
    params.append("date", selectedDate);
    if (selectedType !== "All") params.append("type", selectedType);
    if (selectedTime) params.append("time", selectedTime);

    navigate(`/transport/results?${params.toString()}`);
  };

  const typeIcons = {
    Bus: <FaBus className="text-blue-600" />,
    Train: <FaTrain className="text-green-600" />,
    Taxi: <FaTaxi className="text-yellow-600" />,
    All: <FaMapMarkerAlt className="text-gray-500" />,
  };

  return (
    <div className="px-6 md:px-20 mt-32 mb-20 min-h-screen max-w-7xl mx-auto">
      <h1 className="text-5xl font-extrabold text-center mb-14 text-gradient bg-gradient-to-r from-blue-600 to-purple-600">
        Transportation Finder 🚍
      </h1>

      {/* Search Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
        <div className="relative">
          <FaMapMarkerAlt className="absolute top-3 left-3 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Enter Destination"
            value={selectedDestination}
            onChange={(e) => setSelectedDestination(e.target.value)}
            className="pl-10 border border-gray-300 rounded-lg py-3 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div className="relative">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-lg py-3 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div className="relative">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border border-gray-300 rounded-lg py-3 pl-10 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none"
          >
            <option value="All">All Types</option>
            <option value="Bus">Bus</option>
            <option value="Train">Train</option>
            <option value="Taxi">Taxi</option>
          </select>
          <div className="absolute top-3 left-3 pointer-events-none">
            {typeIcons[selectedType]}
          </div>
        </div>

        <div className="relative">
          <FaClock className="absolute top-3 left-3 text-gray-400 pointer-events-none" />
          <input
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="pl-10 border border-gray-300 rounded-lg py-3 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
      </div>

      {/* Search Button */}
      <div className="text-center">
        <button
          onClick={handleSearch}
          className="inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-xl text-lg font-semibold shadow-lg transition"
        >
          Search Transport
        </button>
      </div>
    </div>
  );
};

export default Transportation;
