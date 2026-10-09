import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBus, FaTrain, FaTaxi, FaMapMarkerAlt, FaClock, FaChevronDown } from "react-icons/fa";

const Transportation = () => {
  const [selectedDestination, setSelectedDestination] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedTime, setSelectedTime] = useState("");
  const [recentDestinations, setRecentDestinations] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0); // ensure top position
    const stored = JSON.parse(localStorage.getItem("recentDestinations")) || [];
    setRecentDestinations(stored);
  }, []);

  const handleSearch = () => {
    if (!selectedDestination || !selectedDate) {
      alert("Please enter both destination and date.");
      return;
    }

    const updatedRecent = [selectedDestination, ...recentDestinations.filter(dest => dest !== selectedDestination)].slice(0, 5);
    setRecentDestinations(updatedRecent);
    localStorage.setItem("recentDestinations", JSON.stringify(updatedRecent));

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
    <div className="px-4 sm:px-8 md:px-12 lg:px-20 pt-20 sm:pt-24 pb-20 max-w-5xl mx-auto">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-10 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Transportation Finder 🚍
      </h1>

      {/* Search Panel */}
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 flex flex-col gap-6 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Destination */}
          <div className="relative">
            <FaMapMarkerAlt className="absolute top-3.5 left-3 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Enter Destination"
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              className="pl-10 border border-gray-300 rounded-xl py-3 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
            {recentDestinations.length > 0 && showDropdown && (
              <div className="absolute top-14 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow z-10">
                {recentDestinations.map((dest, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDestination(dest)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    {dest}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date */}
          <div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-xl py-3 px-3 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          {/* Type */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-gray-300 rounded-xl py-3 pl-10 pr-8 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none"
            >
              <option value="All">All Types</option>
              <option value="Bus">Bus</option>
              <option value="Train">Train</option>
              <option value="Taxi">Taxi</option>
            </select>
            <div className="absolute top-3.5 left-3 pointer-events-none">
              {typeIcons[selectedType]}
            </div>
            <FaChevronDown className="absolute top-4 right-3 text-gray-400 pointer-events-none" />
          </div>

          {/* Time */}
          <div className="relative">
            <FaClock className="absolute top-3.5 left-3 text-gray-400 pointer-events-none" />
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="pl-10 border border-gray-300 rounded-xl py-3 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="text-center mt-4">
          <button
            onClick={handleSearch}
            className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-3 rounded-xl text-base sm:text-lg font-semibold shadow-md transition-transform transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Search Transport
          </button>
        </div>
      </div>
    </div>
  );
};

export default Transportation;
