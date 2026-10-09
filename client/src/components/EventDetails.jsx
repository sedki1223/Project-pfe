import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  FaBars,
  FaTimes,
  FaUsers,
} from "react-icons/fa";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || "http://localhost:5000").replace(/\/$/, "");

// Simple Error Boundary for React 16+
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="p-4 text-red-700 bg-red-100 rounded">
          <h2>Something went wrong.</h2>
          <pre>{this.state.error?.toString()}</pre>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-2 px-4 py-2 bg-teal-600 text-white rounded"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const SkeletonLoader = ({ width = "100%", height = "1rem", className = "" }) => (
  <div
    className={`animate-pulse bg-gray-300 rounded ${className}`}
    style={{ width, height }}
    aria-hidden="true"
  />
);

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { axios, getToken, user } = useAppContext();

  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [rsvping, setRsvping] = useState(false);
  const [error, setError] = useState(null);

  // Sidebar open state persisted in localStorage
  const [showFilters, setShowFilters] = useState(
    JSON.parse(localStorage.getItem("sidebarOpen")) ?? false
  );

  const [activeTab, setActiveTab] = useState(localStorage.getItem("activeTab") || "recent");

  const [mainImage, setMainImage] = useState("");
  const [allEvents, setAllEvents] = useState([]);

  const [loadingEvent, setLoadingEvent] = useState(false);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [loadingAllEvents, setLoadingAllEvents] = useState(false);

  // Search query state for sidebar filtering
  const [searchQuery, setSearchQuery] = useState("");

  // Like state
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // RSVP status message for aria-live
  const [rsvpStatusMessage, setRsvpStatusMessage] = useState("");
  const rsvpStatusRef = useRef(null);

  // Modal state for attendees list
  const [showAttendeesModal, setShowAttendeesModal] = useState(false);

  // Fetch event details
  const fetchEvent = async () => {
    setLoadingEvent(true);
    try {
      const token = await getToken();
      const { data } = await axios.get(`${API_BASE_URL}/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data) {
        setEvent(data);
        setError(null);
      } else {
        setError("Failed to load event");
      }
    } catch (err) {
      setError(err.message || "Error fetching event");
      toast.error(err.message || "Error fetching event");
    }
    setLoadingEvent(false);
  };

  // Initialize mainImage and likes when event changes
  useEffect(() => {
    if (event && event.image) {
      setMainImage(event.image);
      setLikesCount(event.likesCount || 0);
      setLiked(event.userHasLiked || false);
    }
  }, [event]);

  // Fetch attendees list
  const fetchAttendees = async () => {
    setLoadingAttendees(true);
    try {
      const token = await getToken();
      const { data } = await axios.get(`${API_BASE_URL}/api/events/${eventId}/attendees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data && Array.isArray(data)) {
        setAttendees(data);
        setError(null);
      } else {
        setAttendees([]);
        setError("Failed to load attendees");
      }
    } catch (err) {
      setAttendees([]);
      setError(err.message || "Error fetching attendees");
    }
    setLoadingAttendees(false);
  };

  // Fetch all events for sidebar tabs
  const fetchAllEvents = async () => {
    setLoadingAllEvents(true);
    try {
      const token = await getToken();
      const { data } = await axios.get(`${API_BASE_URL}/api/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data) {
        setAllEvents(data);
      } else {
        toast.error("Failed to load events");
      }
    } catch (err) {
      toast.error(err.message || "Error fetching events");
    }
    setLoadingAllEvents(false);
  };

  useEffect(() => {
    fetchEvent();
    fetchAttendees();
    fetchAllEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  // Persist sidebar open state
  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(showFilters));
  }, [showFilters]);

  // Persist active tab
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  // Clear RSVP status message after 3s
  useEffect(() => {
    if (rsvpStatusMessage) {
      const timer = setTimeout(() => setRsvpStatusMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [rsvpStatusMessage]);

  // Safe check if attendees is an array before some()
  const hasRSVPed = user && Array.isArray(attendees) && attendees.some((a) => a.userId === user.id);

  // Filtered & searched event lists for sidebar
  const sameTopicEvents = allEvents
    .filter((e) => e.category === event?.category && e._id !== event?._id)
    .filter((e) => e.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 5);

  const otherEvents = allEvents
    .filter((e) => e.category !== event?.category)
    .filter((e) => e.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 5);

  const recentEvents = [...allEvents]
    .filter((e) => e.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(-5)
    .reverse();

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const renderFilteredEvents = (list) => {
    if (loadingAllEvents) return <p>Loading events...</p>;
    if (!list.length) return <p className="text-gray-500">No events found.</p>;
    return (
      <div
        className="space-y-2 mt-3 max-h-[300px] overflow-y-auto"
        role="list"
        aria-label={`${activeTab} events list`}
      >
        {list.map((ev) => (
          <Link
            key={ev._id}
            to={`/events/${ev._id}`}
            className="block bg-gray-100 p-2 rounded hover:bg-gray-200 transition"
            onClick={() => setShowFilters(false)}
            role="listitem"
          >
            <div className="font-medium">{ev.title}</div>
            <div className="text-sm text-gray-500">{formatDate(ev.date)}</div>
          </Link>
        ))}
      </div>
    );
  };

  // RSVP handler
  const handleRSVP = async () => {
    if (!user) {
      alert("Please log in to RSVP.");
      return;
    }
    setRsvping(true);
    try {
      const token = await getToken();
      if (hasRSVPed) {
        // Cancel RSVP
        const { data } = await axios.delete(`${API_BASE_URL}/api/events/${eventId}/rsvp`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.success) {
          setAttendees((prev) => prev.filter((a) => a.userId !== user.id));
          setRsvpStatusMessage("RSVP cancelled");
          toast.success("RSVP cancelled");
        } else {
          setRsvpStatusMessage("Failed to cancel RSVP");
          toast.error(data.message || "Failed to cancel RSVP");
        }
      } else {
        // RSVP
        const { data } = await axios.post(
          `${API_BASE_URL}/api/events/${eventId}/rsvp`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (data.success) {
          setAttendees((prev) => [...prev, { userId: user.id, userName: user.fullName }]);
          setRsvpStatusMessage("Successfully RSVPed");
          toast.success("Successfully RSVPed");
        } else {
          setRsvpStatusMessage("Failed to RSVP");
          toast.error(data.message || "Failed to RSVP");
        }
      }
    } catch (err) {
      setRsvpStatusMessage("Error updating RSVP");
      toast.error(err.message || "Error updating RSVP");
    }
    setRsvping(false);
  };

  // Like toggle handler
  const handleLikeToggle = async () => {
    if (!user) {
      alert("Please log in to like events.");
      return;
    }
    try {
      const token = await getToken();
      if (liked) {
        // Unlike
        const { data } = await axios.delete(`${API_BASE_URL}/api/events/${eventId}/like`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.success) {
          setLiked(false);
          setLikesCount((c) => c - 1);
          toast.success("Like removed");
        } else {
          toast.error(data.message || "Failed to remove like");
        }
      } else {
        // Like
        const { data } = await axios.post(
          `${API_BASE_URL}/api/events/${eventId}/like`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (data.success) {
          setLiked(true);
          setLikesCount((c) => c + 1);
          toast.success("Event liked");
        } else {
          toast.error(data.message || "Failed to like event");
        }
      }
    } catch (err) {
      toast.error(err.message || "Error toggling like");
    }
  };

  // Share handler
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: event.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // ICS calendar download
  const downloadICS = () => {
    if (!event?.date) return;

    const startDate = event.date.replace(/-/g, "") + "T000000Z";
    const endDate = event.date.replace(/-/g, "") + "T235900Z";

    const content = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.title}
DTSTART:${startDate}
DTEND:${endDate}
LOCATION:${event.location}
DESCRIPTION:${event.description}
END:VEVENT
END:VCALENDAR
`.trim();

    const blob = new Blob([content], { type: "text/calendar" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${event.title.replace(/\s+/g, "_")}.ics`;
    link.click();
  };

  // Keyboard support for tabs: move focus with arrow keys
  const tabRefs = {
    recent: useRef(null),
    topic: useRef(null),
    other: useRef(null),
  };

  const tabOrder = ["recent", "topic", "other"];

  const handleTabKeyDown = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const currentIndex = tabOrder.indexOf(activeTab);
      const nextIndex = (currentIndex + 1) % tabOrder.length;
      const nextTab = tabOrder[nextIndex];
      setActiveTab(nextTab);
      tabRefs[nextTab].current?.focus();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const currentIndex = tabOrder.indexOf(activeTab);
      const prevIndex = (currentIndex - 1 + tabOrder.length) % tabOrder.length;
      const prevTab = tabOrder[prevIndex];
      setActiveTab(prevTab);
      tabRefs[prevTab].current?.focus();
    }
  };

  if (error)
    return (
      <div className="text-center mt-10 text-red-600">
        <p>{error}</p>
        <button
          className="mt-3 px-4 py-2 bg-teal-600 text-white rounded"
          onClick={() => {
            setError(null);
            fetchEvent();
            fetchAttendees();
            fetchAllEvents();
          }}
        >
          Retry
        </button>
      </div>
    );

  if (loadingEvent)
    return (
      <div className="pt-20 px-4 md:px-6 lg:px-10 container mx-auto">
        <SkeletonLoader height="32px" className="mb-4" />
        <SkeletonLoader height="400px" className="mb-4" />
        <SkeletonLoader height="20px" className="mb-2" />
        <SkeletonLoader height="20px" className="mb-2" />
        <SkeletonLoader height="20px" className="mb-2" />
      </div>
    );

  if (!event) return null;

  return (
    <ErrorBoundary>
      <div
        className="pt-20 px-4 md:px-6 lg:px-10 container mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6"
        role="main"
      >
        {/* Sidebar toggle button for mobile */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden mb-4 px-4 py-2 bg-teal-600 text-white rounded flex items-center gap-2"
          aria-expanded={showFilters}
          aria-controls="sidebar-filters"
        >
          {showFilters ? <FaTimes /> : <FaBars />}
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>

        {/* Main Content */}
        <main className="lg:col-span-3">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 text-teal-600 hover:underline"
          >
            ← Back to Events
          </button>

          {/* Main Photo + Gallery */}
          <div className="flex flex-col lg:flex-row gap-6 mb-6">
            {/* Main Image */}
            <div className="flex-1 rounded-lg overflow-hidden shadow-md">
              <img
                src={mainImage}
                alt={event.title}
                className="w-full h-72 lg:h-96 object-cover rounded-lg"
              />
            </div>

            {/* Gallery Thumbnails */}
            {event.gallery && event.gallery.length > 0 && (
              <div className="flex lg:flex-col gap-4 max-h-72 overflow-y-auto">
                {[event.image, ...event.gallery].map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`rounded-lg overflow-hidden shadow cursor-pointer border-2 ${
                      mainImage === img ? "border-teal-600" : "border-transparent"
                    } hover:border-teal-400 transition`}
                    style={{ width: "80px", height: "80px", flexShrink: 0 }}
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
            )}
          </div>

          {/* Event Metadata */}
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="flex items-center bg-teal-100 px-3 py-1 rounded-full text-sm">
              <FaTags className="mr-1" /> {event.category}
            </span>
            <span className="flex items-center bg-blue-100 px-3 py-1 rounded-full text-sm">
              <FaMoneyBillWave className="mr-1" /> ${event.price}
            </span>
            <span className="flex items-center bg-red-100 px-3 py-1 rounded-full text-sm">
              <FaMapMarkerAlt className="mr-1" /> {event.location}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-800 mb-6">{event.description}</p>

          {/* Highlights */}
          {event.highlights && event.highlights.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Event Highlights</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                {event.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Like, Share, Book, Calendar Buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <button
              onClick={handleLikeToggle}
              className={`flex items-center gap-2 px-4 py-2 rounded ${
                liked ? "bg-red-500 text-white" : "bg-gray-200"
              } hover:bg-red-600 transition`}
              aria-pressed={liked}
              aria-label={liked ? "Unlike event" : "Like event"}
            >
              <FaHeart />
              <span>{likesCount}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              aria-label="Share event"
            >
              <FaShareAlt />
              Share
            </button>

            <button
              onClick={downloadICS}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              aria-label="Add event to calendar"
            >
              <FaCalendarPlus />
              Add to Calendar
            </button>

            <button
              onClick={() => {
                if (!user) {
                  alert("Please log in to RSVP.");
                  return;
                }
                handleRSVP();
              }}
              disabled={rsvping}
              className={`flex items-center gap-2 px-4 py-2 rounded ${
                hasRSVPed ? "bg-yellow-500 text-white" : "bg-gray-300"
              } hover:bg-yellow-600 transition disabled:opacity-50`}
              aria-pressed={hasRSVPed}
              aria-label={hasRSVPed ? "Cancel RSVP" : "RSVP to event"}
            >
              <FaTicketAlt />
              {rsvping ? "Processing..." : hasRSVPed ? "Cancel RSVP" : "RSVP"}
            </button>
          </div>

          {/* RSVP status live region */}
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            ref={rsvpStatusRef}
            className="sr-only"
          >
            {rsvpStatusMessage}
          </div>

          {/* Attendees Section */}
          <section aria-labelledby="attendees-heading" className="mb-10">
            <h2
              id="attendees-heading"
              className="text-xl font-semibold flex items-center gap-2"
            >
              <FaUsers /> Attendees ({attendees.length})
              <button
                onClick={() => setShowAttendeesModal(true)}
                className="ml-4 px-2 py-1 bg-teal-600 text-white rounded hover:bg-teal-700"
              >
                View List
              </button>
            </h2>
          </section>

          {/* Attendees Modal */}
          {showAttendeesModal && (
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="attendees-modal-title"
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
              onClick={() => setShowAttendeesModal(false)}
            >
              <div
                className="bg-white rounded-lg max-w-md w-full p-6 overflow-y-auto max-h-[80vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <h3
                  id="attendees-modal-title"
                  className="text-lg font-bold mb-4 flex justify-between items-center"
                >
                  Attendees List
                  <button
                    onClick={() => setShowAttendeesModal(false)}
                    aria-label="Close attendees list"
                    className="text-red-600 hover:text-red-900 text-xl"
                  >
                    &times;
                  </button>
                </h3>
                {loadingAttendees ? (
                  <p>Loading attendees...</p>
                ) : attendees.length === 0 ? (
                  <p>No attendees yet.</p>
                ) : (
                  <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                    {attendees.map((a, idx) => (
                      <li key={idx} className="py-2">
                        {a.userName || "Anonymous User"}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Sidebar Filters */}
        {showFilters && (
          <aside
            id="sidebar-filters"
            className="lg:col-span-1 sticky top-20 bg-gray-50 p-4 rounded shadow-md max-h-[calc(100vh-5rem)] overflow-y-auto"
          >
            <h2 className="font-bold text-lg mb-3">Filters & Tabs</h2>

            {/* Search Box */}
            <input
              type="search"
              aria-label="Search events"
              placeholder="Search events..."
              className="w-full px-3 py-2 border rounded mb-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Tabs */}
            <div
              role="tablist"
              aria-label="Event filter tabs"
              className="flex space-x-3 mb-4"
              onKeyDown={handleTabKeyDown}
            >
              <button
                role="tab"
                id="tab-recent"
                aria-selected={activeTab === "recent"}
                aria-controls="tabpanel-recent"
                tabIndex={activeTab === "recent" ? 0 : -1}
                className={`px-3 py-1 rounded ${
                  activeTab === "recent" ? "bg-teal-600 text-white" : "bg-gray-200"
                }`}
                onClick={() => setActiveTab("recent")}
                ref={tabRefs.recent}
              >
                <FaClock className="inline mr-1" />
                Recent
              </button>
              <button
                role="tab"
                id="tab-topic"
                aria-selected={activeTab === "topic"}
                aria-controls="tabpanel-topic"
                tabIndex={activeTab === "topic" ? 0 : -1}
                className={`px-3 py-1 rounded ${
                  activeTab === "topic" ? "bg-teal-600 text-white" : "bg-gray-200"
                }`}
                onClick={() => setActiveTab("topic")}
                ref={tabRefs.topic}
              >
                <FaTags className="inline mr-1" />
                Topic
              </button>
              <button
                role="tab"
                id="tab-other"
                aria-selected={activeTab === "other"}
                aria-controls="tabpanel-other"
                tabIndex={activeTab === "other" ? 0 : -1}
                className={`px-3 py-1 rounded ${
                  activeTab === "other" ? "bg-teal-600 text-white" : "bg-gray-200"
                }`}
                onClick={() => setActiveTab("other")}
                ref={tabRefs.other}
              >
                <FaEllipsisH className="inline mr-1" />
                Other
              </button>
            </div>

            {/* Tab Panels */}
            <div
              id="tabpanel-recent"
              role="tabpanel"
              aria-labelledby="tab-recent"
              hidden={activeTab !== "recent"}
            >
              {renderFilteredEvents(recentEvents)}
            </div>
            <div
              id="tabpanel-topic"
              role="tabpanel"
              aria-labelledby="tab-topic"
              hidden={activeTab !== "topic"}
            >
              {renderFilteredEvents(sameTopicEvents)}
            </div>
            <div
              id="tabpanel-other"
              role="tabpanel"
              aria-labelledby="tab-other"
              hidden={activeTab !== "other"}
            >
              {renderFilteredEvents(otherEvents)}
            </div>
          </aside>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default EventDetails;
