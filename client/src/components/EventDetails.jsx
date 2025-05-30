import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FaClock,
  FaTags,
  FaEllipsisH,
  FaHeart,
  FaShareAlt,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCalendarPlus,
  FaTicketAlt,
} from 'react-icons/fa';

const events = Array.from({ length: 24 }, (_, i) => {
  const types = ['Festival', 'Workshop', 'Adventure', 'Culture', 'Cinema', 'Music'];
  const month = (i % 12) + 1;
  const day = (i % 28) + 1;
  return {
    id: (i + 1).toString(),
    name: `Event #${i + 1} in Tozeur`,
    date: `2024-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
    readTime: `${2 + (i % 5)} min read`,
    description: `This is a full detailed description for Event #${i + 1}, held in Tozeur. Come explore culture, music, and unforgettable experiences.`,
    image: `https://source.unsplash.com/800x500/?tozeur,event,${i + 1}`,
    type: types[i % types.length],
    price: i % 4 === 0 ? `${10 + i} TND` : 'Free',
    location: `Location ${i + 1}, Tozeur`,
    highlights: ['Live Music', 'Traditional Food', 'Cultural Dances', 'Local Crafts'],
    gallery: [
      `https://source.unsplash.com/400x300/?festival,tozeur,${i}`,
      `https://source.unsplash.com/400x300/?desert,event,${i}`,
    ],
  };
});

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(localStorage.getItem('activeTab') || 'recent');
  const [showFilters, setShowFilters] = useState(false);

  const event = events.find(e => e.id === eventId);
  const [mainImage, setMainImage] = useState(event?.image || '');

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    setMainImage(event?.image || '');
  }, [event]);

  if (!event) return <div className="text-center mt-10 text-red-600">Event not found.</div>;

  const sameTopicEvents = events.filter(e => e.type === event.type && e.id !== eventId).slice(0, 5);
  const otherEvents = events.filter(e => e.type !== event.type).slice(0, 5);
  const recentEvents = [...events].slice(-5).reverse();

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

  const renderFilteredEvents = (list) => (
    <div className="space-y-2 mt-3 max-h-[300px] overflow-y-auto">
      {list.map(ev => (
        <Link
          key={ev.id}
          to={`/events/${ev.id}`}
          className="block bg-gray-100 p-2 rounded hover:bg-gray-200 transition"
        >
          <div className="font-medium">{ev.name}</div>
          <div className="text-sm text-gray-500">{formatDate(ev.date)}</div>
        </Link>
      ))}
    </div>
  );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: event.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const downloadICS = () => {
    const content = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.name}
DTSTART:${event.date.replace(/-/g, '')}T180000Z
DTEND:${event.date.replace(/-/g, '')}T200000Z
LOCATION:${event.location}
DESCRIPTION:${event.description}
END:VEVENT
END:VCALENDAR
`.trim();

    const blob = new Blob([content], { type: 'text/calendar' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${event.name.replace(/\s+/g, '_')}.ics`;
    link.click();
  };

  return (
    <div className="pt-20 px-4 md:px-6 lg:px-10 container mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Content */}
      <main className="lg:col-span-3">
        <button onClick={() => navigate(-1)} className="mb-6 text-teal-600 hover:underline">
          ← Back to Events
        </button>

        {/* Main Photo + Gallery */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {/* Main Image */}
          <div className="flex-1 rounded-lg overflow-hidden shadow-md">
            <img
              src={mainImage}
              alt={event.name}
              className="w-full h-72 lg:h-96 object-cover rounded-lg"
            />
          </div>

          {/* Gallery Thumbnails */}
          <div className="flex lg:flex-col gap-4 max-h-72 overflow-y-auto">
            {[event.image, ...event.gallery].map((img, idx) => (
              <button
                key={idx}
                onClick={() => setMainImage(img)}
                className={`rounded-lg overflow-hidden shadow cursor-pointer border-2 ${
                  mainImage === img ? 'border-teal-600' : 'border-transparent'
                } hover:border-teal-400 transition`}
                style={{ width: '80px', height: '80px', flexShrink: 0 }}
                aria-label={`Show image ${idx + 1}`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Event Metadata */}
        <div className="flex flex-wrap gap-3 mb-6">
          <span className="flex items-center bg-teal-100 px-3 py-1 rounded-full text-sm">
            <FaTags className="mr-1" /> {event.type}
          </span>
          <span className="flex items-center bg-blue-100 px-3 py-1 rounded-full text-sm">
            <FaMoneyBillWave className="mr-1" /> {event.price}
          </span>
          <span className="flex items-center bg-red-100 px-3 py-1 rounded-full text-sm">
            <FaMapMarkerAlt className="mr-1" /> {event.location}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-800 mb-6">{event.description}</p>

        {/* Highlights */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Event Highlights</h3>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            {event.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>

        {/* Location Map - centered and square */}
        <div className="mb-6 flex justify-center">
          <iframe
            title="Event Location"
            className="w-full max-w-md h-64 rounded shadow"
            src="https://www.google.com/maps?q=Tozeur+Tunisia&output=embed"
            loading="lazy"
            style={{ aspectRatio: '1 / 1' }}
          ></iframe>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 mt-6">
          <button
            className="bg-teal-600 text-white px-6 py-3 rounded shadow hover:bg-teal-700 flex items-center gap-3 transition-transform active:scale-95"
            onClick={() => alert('Booking functionality coming soon!')}
          >
            <FaTicketAlt size={18} /> Book Now
          </button>
          <button
            className="bg-yellow-500 text-white px-6 py-3 rounded shadow hover:bg-yellow-600 flex items-center gap-3 transition-transform active:scale-95"
            onClick={downloadICS}
          >
            <FaCalendarPlus size={18} /> Add to Calendar
          </button>
          <button
            className="text-red-600 border border-red-600 px-5 py-3 rounded flex items-center gap-2 hover:bg-red-600 hover:text-white transition-colors transition-transform active:scale-95"
            aria-label="Like event"
          >
            <FaHeart size={18} /> Like
          </button>
          <button
            className="text-blue-600 border border-blue-600 px-5 py-3 rounded flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors transition-transform active:scale-95"
            onClick={handleShare}
            aria-label="Share event"
          >
            <FaShareAlt size={18} /> Share
          </button>
        </div>
      </main>

      {/* Sidebar Tabs */}
      <aside
        className={`transition-all duration-300 ease-in-out transform lg:translate-x-0 ${
          showFilters ? 'translate-x-0' : 'translate-x-full'
        } lg:block lg:col-span-1 bg-white p-6 rounded shadow-lg max-h-[calc(100vh-8rem)] overflow-auto`}
      >
        <h2 className="text-xl font-semibold mb-4">Explore More</h2>
        <div className="space-y-2">
          <button
            onClick={() => setActiveTab('recent')}
            className={`w-full text-left px-4 py-3 rounded flex items-center gap-3 text-sm font-medium ${
              activeTab === 'recent'
                ? 'bg-teal-600 text-white shadow'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            <FaClock /> Recent
          </button>
          {activeTab === 'recent' && renderFilteredEvents(recentEvents)}

          <button
            onClick={() => setActiveTab('topic')}
            className={`w-full text-left px-4 py-3 rounded flex items-center gap-3 text-sm font-medium ${
              activeTab === 'topic'
                ? 'bg-teal-600 text-white shadow'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            <FaTags /> Topic
          </button>
          {activeTab === 'topic' && renderFilteredEvents(sameTopicEvents)}

          <button
            onClick={() => setActiveTab('other')}
            className={`w-full text-left px-4 py-3 rounded flex items-center gap-3 text-sm font-medium ${
              activeTab === 'other'
                ? 'bg-teal-600 text-white shadow'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            <FaEllipsisH /> Other
          </button>
          {activeTab === 'other' && renderFilteredEvents(otherEvents)}
        </div>
      </aside>
    </div>
  );
};

export default EventDetails;
