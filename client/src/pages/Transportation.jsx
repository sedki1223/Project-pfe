import React, { useState } from "react";
import transportData from "../data/TransportData"; // make sure this path is correct

const Transportation = () => {
  const [selectedDestination, setSelectedDestination] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedTime, setSelectedTime] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = () => {
    if (!selectedDestination || !selectedDate) {
      alert("Please enter both destination and date.");
      return;
    }

    const filtered = transportData.filter(item => {
      const destinationMatch = item.destination
        .toLowerCase()
        .includes(selectedDestination.toLowerCase());
      const dateMatch = item.date === selectedDate;
      const typeMatch = selectedType === "All" || item.type === selectedType;
      const timeMatch = !selectedTime || item.time === selectedTime;

      return destinationMatch && dateMatch && typeMatch && timeMatch;
    });

    setFilteredData(filtered);
  };

  return (
    <div className="px-4 md:px-20 mt-32 mb-20 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-10">
        Transportation Finder 🚍
      </h1>

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
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-blue-700 transition-all duration-300"
        >
          Search Transport
        </button>
      </div>

      {/* Results */}
      {filteredData.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item, idx) => (
            <div
              key={idx}
              className="border rounded-xl p-5 shadow-lg bg-white hover:scale-105 transition-transform"
            >
              <h2 className="text-xl font-bold mb-1">{item.type}</h2>
              <p className="text-gray-700 mb-1">
                <strong>Destination:</strong> {item.destination}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Date:</strong> {item.date}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Time:</strong> {item.time}
              </p>
              <p className="text-gray-700">
                <strong>Price:</strong> ${item.price}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No transport options found. Try different filters.</p>
      )}
    </div>
  );
};

export default Transportation;
