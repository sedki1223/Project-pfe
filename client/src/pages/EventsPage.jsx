import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaTags,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaSearch,
  FaThList,
} from 'react-icons/fa';

// Example events array (replace with your real data if different)
const events = Array.from({ length: 24 }, (_, i) => {
  const types = ['Festival', 'Workshop', 'Adventure', 'Culture', 'Cinema', 'Music'];
  const month = (i % 12) + 1;
  const day = (i % 28) + 1;
  return {
    id: (i + 1).toString(),
    name: `Event #${i + 1} in Tozeur`,
    date: `2024-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
    description: `This is a detailed description for Event #${i + 1}, held in Tozeur. Come explore culture, music, and unforgettable experiences.`,
    image: `https://source.unsplash.com/800x500/?tozeur,event,${i + 1}`,
    type: types[i % types.length],
    price: i % 4 === 0 ? `${10 + i} TND` : 'Free',
    location: `Location ${i + 1}, Tozeur`,
  };
});

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const EventsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');

  // Get unique categories from events
  const categories = useMemo(() => {
    const setCategories = new Set(events.map(e => e.type));
    return Array.from(setCategories);
  }, []);

  // Filter events by active category
  const filteredByCategory = useMemo(() => {
    if (activeTab === 'all') return events;
    return events.filter(e => e.type === activeTab);
  }, [activeTab]);

  // Apply search and price filters
  const finalFilteredEvents = filteredByCategory.filter(e => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPrice =
      priceFilter === 'all' ||
      (priceFilter === 'free' && e.price.toLowerCase() === 'free') ||
      (priceFilter === 'paid' && e.price.toLowerCase() !== 'free');

    return matchesSearch && matchesPrice;
  });

  return (
    <div className="pt-20 px-4 md:px-6 lg:px-10 container mx-auto max-w-7xl">
      <h1 className="text-3xl font-bold text-center mb-8">Explore Events in Tozeur</h1>

      {/* Category Tabs */}
      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded ${
            activeTab === 'all' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          title="All Events"
        >
          <FaThList /> All
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              activeTab === category ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            title={`Filter by ${category}`}
          >
            <FaTags /> {category}
          </button>
        ))}
      </div>

      {/* Search and Price Filters */}
      <div className="flex flex-col md:flex-row md:justify-between items-center mb-8 gap-4 max-w-3xl mx-auto">
        <div className="flex items-center w-full md:w-2/3 border rounded px-3 py-2 shadow-sm">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search by name or location..."
            className="w-full outline-none"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="w-full md:w-1/3 border rounded px-3 py-2 shadow-sm"
          value={priceFilter}
          onChange={e => setPriceFilter(e.target.value)}
        >
          <option value="all">All Prices</option>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {/* Events Grid */}
      {finalFilteredEvents.length === 0 ? (
        <p className="text-center text-gray-600">No events match your filters.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {finalFilteredEvents.map(event => (
            <Link
              to={`/events/${event.id}`}
              key={event.id}
              className="block rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white"
              title={event.name}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
                  <h3 className="text-lg font-semibold">{event.name}</h3>
                  <p className="text-xs">{formatDate(event.date)}</p>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaTags /> <span>{event.type}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaMapMarkerAlt /> <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaMoneyBillWave /> <span>{event.price}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
