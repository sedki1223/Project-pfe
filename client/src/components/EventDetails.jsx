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
import axios from "../api/axiosConfig";
import toast from "react-hot-toast";


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
          <button onClick={() => this.setState({ hasError: false, error: null })} className="mt-2 px-4 py-2 bg-teal-600 text-white rounded">
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

  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "recent"
  );

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
      const { data } = await axios.get(`/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setEvent(data.event);
        setError(null);
      } else {
        setError(data.message || "Failed to load event");
      }
    } catch (err) {
      setError(err.message || "Error fetching event");
      toast.error(err.message || "Error fetching event");
    }
    setLoadingEvent(false);
  };

  // Fetch attendees list
  const fetchAttendees = async () => {
    setLoadingAttendees(true);
    try {
      const token = await getToken();
      const { data } = await axios.get(`/api/events/${eventId}/attendees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setAttendees(data.attendees);
        setError(null);
      } else {
        setError(data.message || "Failed to load attendees");
      }
    } catch (err) {
      setError(err.message || "Error fetching attendees");
    }
    setLoadingAttendees(false);
  };

  // Fetch all events for sidebar tabs
  const fetchAllEvents = async () => {
    setLoadingAllEvents(true);
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setAllEvents(data.events);
      } else {
        toast.error(data.message || "Failed to load events");
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

  // Check if current user has RSVPed
  const hasRSVPed = user && attendees.some((a) => a.userId === user.id);

  // Filtered & searched event lists for sidebar
  const sameTopicEvents = allEvents
    .filter((e) => e.type === event?.type && e.id !== event?.id)
    .filter((e) => e.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 5);

  const otherEvents = allEvents
    .filter((e) => e.type !== event?.type)
    .filter((e) => e.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 5);

  const recentEvents = [...allEvents]
    .filter((e) => e.name.toLowerCase().includes(searchQuery.toLowerCase()))
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
            key={ev.id}
            to={`/events/${ev.id}`}
            className="block bg-gray-100 p-2 rounded hover:bg-gray-200 transition"
            onClick={() => setShowFilters(false)}
            role="listitem"
          >
            <div className="font-medium">{ev.name}</div>
            <div className="text-sm text-gray-500">{formatDate(ev.date)}</div>
          </Link>
        ))}
      </div>
    );
  };

  // RSVP handler with aria-live message update
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
        const { data } = await axios.delete(`/api/events/${eventId}/rsvp`, {
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
          `/api/events/${eventId}/rsvp`,
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
        const { data } = await axios.delete(`/api/events/${eventId}/like`, {
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
          `/api/events/${eventId}/like`,
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
      navigator.share({ title: event.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // ICS calendar download
  const downloadICS = () => {
    const startDate = event.date.replace(/-/g, "") + "T000000Z";
    const endDate = event.date.replace(/-/g, "") + "T235900Z";

    const content = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.name}
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
    link.download = `${event.name.replace(/\s+/g, "_")}.ics`;
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
                alt={event.name}
                className="w-full h-72 lg:h-96 object-cover rounded-lg"
              />
            </div>

            {/* Gallery Thumbnails */}
            <div className="flex lg:flex-col gap-4 max-h-72 overflow-y-auto">
              {[event.image, ...(event.gallery || [])].map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`rounded-lg overflow-hidden shadow cursor-pointer border-2 ${
                    mainImage === img
                      ? "border-teal-600"
                      : "border-transparent"
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
              {(event.highlights || []).map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>

          {/* Like, Share, Book, Calendar Buttons */}
          <div className="flex flex-wrap gap-3 items-center mb-8">
            <button
              onClick={handleLikeToggle}
              aria-pressed={liked}
              aria-label={liked ? "Unlike event" : "Like event"}
              className={`flex items-center gap-2 px-4 py-2 rounded ${
                liked ? "bg-red-500 text-white" : "bg-gray-200"
              } hover:bg-red-600 transition`}
            >
              <FaHeart />
              <span>{likesCount}</span>
            </button>

            <button
              onClick={handleShare}
              aria-label="Share event"
              className="flex items-center gap-2 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
            >
              <FaShareAlt />
              Share
            </button>

            <button
              onClick={() => alert("Booking functionality coming soon")}
              aria-label="Book event"
              className="flex items-center gap-2 px-4 py-2 rounded bg-teal-600 text-white hover:bg-teal-700 transition"
            >
              <FaTicketAlt />
              Book Now
            </button>

            <button
              onClick={downloadICS}
              aria-label="Add event to calendar"
              className="flex items-center gap-2 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              <FaCalendarPlus />
              Add to Calendar
            </button>
          </div>

          {/* RSVP Section */}
          <section
            aria-live="polite"
            aria-atomic="true"
            ref={rsvpStatusRef}
            className="mb-8"
          >
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <FaUsers /> Attendees ({attendees.length})
            </h3>

            <button
              onClick={handleRSVP}
              disabled={rsvping}
              className={`px-6 py-2 rounded font-semibold transition ${
                hasRSVPed
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-teal-600 text-white hover:bg-teal-700"
              }`}
              aria-pressed={hasRSVPed}
            >
              {rsvping ? "Processing..." : hasRSVPed ? "Cancel RSVP" : "RSVP"}
            </button>

            <button
              onClick={() => setShowAttendeesModal(true)}
              className="ml-4 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              aria-haspopup="dialog"
            >
              View Attendees
            </button>

            {rsvpStatusMessage && (
              <p className="mt-2 text-green-600">{rsvpStatusMessage}</p>
            )}
          </section>

          {/* Attendees Modal */}
          {showAttendeesModal && (
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="attendees-title"
              tabIndex={-1}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowAttendeesModal(false)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setShowAttendeesModal(false);
              }}
            >
              <div
                className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto p-6 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <h2
                  id="attendees-title"
                  className="text-2xl font-semibold mb-4"
                  tabIndex={0}
                >
                  Attendees List
                </h2>
                {loadingAttendees ? (
                  <p>Loading attendees...</p>
                ) : attendees.length === 0 ? (
                  <p>No attendees yet.</p>
                ) : (
                  <ul className="list-disc pl-5 space-y-1">
                    {attendees.map((a) => (
                      <li key={a.userId || a.id}>{a.userName || "Anonymous"}</li>
                    ))}
                  </ul>
                )}
                <button
                  onClick={() => setShowAttendeesModal(false)}
                  className="mt-6 px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 absolute top-4 right-4"
                  aria-label="Close attendees modal"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Sidebar Filters */}
        <aside
          id="sidebar-filters"
          className={`${
            showFilters ? "block" : "hidden"
          } lg:block col-span-1 bg-gray-50 rounded p-4 max-h-[80vh] overflow-y-auto`}
          aria-label="Event filters and related events"
        >
          <div className="mb-4 flex flex-col gap-2">
            <label htmlFor="sidebar-search" className="sr-only">
              Search events
            </label>
            <input
              id="sidebar-search"
              type="search"
              placeholder="Search events..."
              className="w-full p-2 rounded border border-gray-300 focus:outline-teal-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-describedby="search-description"
            />
            <small id="search-description" className="text-gray-500 text-xs">
              Filter events by name in all tabs
            </small>
          </div>

          {/* Tabs */}
          <nav
            role="tablist"
            aria-label="Event categories"
            className="flex gap-4 border-b border-gray-300 mb-4"
            onKeyDown={handleTabKeyDown}
          >
            <button
              role="tab"
              aria-selected={activeTab === "recent"}
              aria-controls="tab-panel-recent"
              id="tab-recent"
              tabIndex={activeTab === "recent" ? 0 : -1}
              onClick={() => setActiveTab("recent")}
              ref={tabRefs.recent}
              className={`py-2 px-4 font-semibold ${
                activeTab === "recent"
                  ? "border-b-4 border-teal-600 text-teal-700"
                  : "text-gray-600 hover:text-teal-600"
              } focus:outline-none`}
            >
              Recent
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "topic"}
              aria-controls="tab-panel-topic"
              id="tab-topic"
              tabIndex={activeTab === "topic" ? 0 : -1}
              onClick={() => setActiveTab("topic")}
              ref={tabRefs.topic}
              className={`py-2 px-4 font-semibold ${
                activeTab === "topic"
                  ? "border-b-4 border-teal-600 text-teal-700"
                  : "text-gray-600 hover:text-teal-600"
              } focus:outline-none`}
            >
              Topic
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "other"}
              aria-controls="tab-panel-other"
              id="tab-other"
              tabIndex={activeTab === "other" ? 0 : -1}
              onClick={() => setActiveTab("other")}
              ref={tabRefs.other}
              className={`py-2 px-4 font-semibold ${
                activeTab === "other"
                  ? "border-b-4 border-teal-600 text-teal-700"
                  : "text-gray-600 hover:text-teal-600"
              } focus:outline-none`}
            >
              Other
            </button>
          </nav>

          {/* Tab Panels */}
          <div
            id="tab-panel-recent"
            role="tabpanel"
            aria-labelledby="tab-recent"
            hidden={activeTab !== "recent"}
          >
            {renderFilteredEvents(recentEvents)}
          </div>
          <div
            id="tab-panel-topic"
            role="tabpanel"
            aria-labelledby="tab-topic"
            hidden={activeTab !== "topic"}
          >
            {renderFilteredEvents(sameTopicEvents)}
          </div>
          <div
            id="tab-panel-other"
            role="tabpanel"
            aria-labelledby="tab-other"
            hidden={activeTab !== "other"}
          >
            {renderFilteredEvents(otherEvents)}
          </div>
        </aside>
      </div>
    </ErrorBoundary>
  );
};

export default EventDetails;
