import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaShareAlt,
  FaCalendarPlus,
  FaTicketAlt,
  FaMapMarkerAlt,
  FaTrash,
} from "react-icons/fa";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import Title from "@/components/Title";

const NO_IMAGE = "https://via.placeholder.com/600x400?text=No+Image";

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { axios, getToken, user } = useAppContext();

  const [event, setEvent] = useState(null);
  const [mainImage, setMainImage] = useState(NO_IMAGE);
  const [attendees, setAttendees] = useState([]);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  const fetchEvent = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvent(data);
      setLikesCount(data.likesCount || 0);
      setLiked(data.likedBy?.includes(user?.id) || false);
      setReviews(data.reviews || []);

      // Determine main image with new logic
      let chosenImage = NO_IMAGE;

      if (Array.isArray(data.imageUrl) && data.imageUrl.length > 0) {
        chosenImage = data.imageUrl[0];
      } else if (Array.isArray(data.images) && data.images.length > 0) {
        chosenImage = data.images[0];
      } else if (typeof data.image === "string" && data.image.trim() !== "") {
        chosenImage = data.image;
      }
      setMainImage(chosenImage);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error loading event.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendees = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`/api/events/${eventId}/attendees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAttendees(data);
    } catch {
      setAttendees([]);
    }
  };

  const handleLike = async () => {
    if (!user) return toast.error("Please log in to like events.");
    try {
      const token = await getToken();
      if (liked) {
        await axios.delete(`/api/events/${eventId}/like`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLiked(false);
        setLikesCount((prev) => prev - 1);
        toast.success("Like removed");
      } else {
        await axios.post(
          `/api/events/${eventId}/like`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLiked(true);
        setLikesCount((prev) => prev + 1);
        toast.success("Event liked");
      }
    } catch {
      toast.error("Error updating like status.");
    }
  };

  const handleRSVP = async () => {
    if (!user) return toast.error("Please log in to RSVP.");
    try {
      const token = await getToken();
      const isAttending = attendees.some((a) => a.userId === user.id);
      if (isAttending) {
        await axios.delete(`/api/events/${eventId}/rsvp`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAttendees((prev) => prev.filter((a) => a.userId !== user.id));
        toast.success("RSVP cancelled");
      } else {
        await axios.post(
          `/api/events/${eventId}/rsvp`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAttendees((prev) => [...prev, { userId: user.id, name: user.fullName }]);
        toast.success("RSVP successful");
      }
    } catch {
      toast.error("Error updating RSVP status.");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Event link copied to clipboard!");
  };

  const downloadICS = () => {
    if (!event?.date) return;
    const start = new Date(event.date)
      .toISOString()
      .replace(/[-:]/g, "")
      .split(".")[0];
    const end = new Date(new Date(event.date).getTime() + 2 * 60 * 60 * 1000)
      .toISOString()
      .replace(/[-:]/g, "")
      .split(".")[0];
    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.title}
DTSTART:${start}
DTEND:${end}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`.trim();
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${event.title.replace(/\s+/g, "_")}.ics`;
    link.click();
  };

  const addReview = async () => {
    if (!user) return toast.error("Please log in to add reviews.");
    try {
      const token = await getToken();
      await axios.post(`/api/events/${eventId}/review`, newReview, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Review added");
      setNewReview({ rating: 5, comment: "" });
      fetchEvent();
    } catch {
      toast.error("Failed to add review.");
    }
  };

  const deleteEvent = async () => {
    if (!window.confirm("Delete this event?")) return;
    try {
      const token = await getToken();
      await axios.delete(`/api/admin/delete-event/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Event deleted");
      navigate("/admin");
    } catch {
      toast.error("Failed to delete event.");
    }
  };

  // fallback image on error
  const handleImageError = (e) => {
    e.target.src = NO_IMAGE;
  };

  useEffect(() => {
    fetchEvent();
    fetchAttendees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  if (loading) {
    return (
      <p className="text-center mt-20 text-teal-600 animate-pulse">
        Loading event details...
      </p>
    );
  }

  if (!event) {
    return <p className="text-center mt-20 text-gray-500">Event not found.</p>;
  }

  // Prepare thumbnails array for gallery
  let galleryImages = [];

  if (Array.isArray(event.imageUrl) && event.imageUrl.length > 0) {
    galleryImages = event.imageUrl;
  } else if (Array.isArray(event.images) && event.images.length > 0) {
    galleryImages = event.images;
  } else if (typeof event.image === "string" && event.image.trim() !== "") {
    galleryImages = [event.image];
  } else {
    galleryImages = [NO_IMAGE];
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 mt-15 space-y-8">
      <Title title={event.title} />

      {/* Image Gallery */}
      <div>
        {/* Main large image */}
        <img
          src={mainImage}
          alt={event.title}
          onError={handleImageError}
          className="w-full h-64 object-cover rounded"
        />

        {/* Thumbnails */}
        <div className="flex gap-2 mt-2 overflow-x-auto">
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setMainImage(img)}
              className={`border rounded overflow-hidden ${
                mainImage === img ? "border-teal-600" : "border-gray-300"
              }`}
              style={{ minWidth: "64px", height: "64px" }}
              aria-label={`Select image ${idx + 1}`}
            >
              <img
                src={img}
                alt={`${event.title} - ${idx + 1}`}
                onError={handleImageError}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white shadow rounded p-4 space-y-4">
        <h2 className="text-2xl font-bold">{event.title}</h2>
        <p className="text-gray-600 flex items-center gap-2">
          <FaMapMarkerAlt /> {event.location || "Tozeur"}
        </p>
        <p>{event.description}</p>
        <p className="text-sm text-gray-500">
          Date: {new Date(event.date).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-500">Likes: {likesCount}</p>
        <p className="text-sm text-gray-500">Attendees: {attendees.length}</p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={handleLike}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded font-semibold transition ${
            liked ? "bg-red-500 text-white" : "bg-gray-200 text-gray-800"
          } hover:scale-105`}
        >
          <FaHeart /> {liked ? "Unlike" : "Like"}
        </button>
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded font-semibold bg-blue-500 text-white hover:scale-105 transition"
        >
          <FaShareAlt /> Share
        </button>
        <button
          onClick={downloadICS}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded font-semibold bg-green-500 text-white hover:scale-105 transition"
        >
          <FaCalendarPlus /> Add to Calendar
        </button>
        <button
          onClick={handleRSVP}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded font-semibold transition ${
            attendees.some((a) => a.userId === user?.id)
              ? "bg-yellow-500 text-white"
              : "bg-gray-200 text-gray-800"
          } hover:scale-105`}
        >
          <FaTicketAlt />{" "}
          {attendees.some((a) => a.userId === user?.id) ? "Cancel RSVP" : "RSVP"}
        </button>
      </div>

      {/* Reviews Section */}
      <div className="bg-white shadow rounded p-4 space-y-4">
        <h3 className="text-lg font-bold">Reviews</h3>
        {reviews.length > 0 ? (
          reviews.map((review, idx) => (
            <div key={idx} className="border p-2 rounded">
              <p className="font-semibold">
                {review.user?.name || "Anonymous"} - {review.rating} ⭐
              </p>
              <p className="text-sm text-gray-600">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
              <p>{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}

        <div className="space-y-2">
          <input
            type="number"
            min={1}
            max={5}
            value={newReview.rating}
            onChange={(e) =>
              setNewReview((prev) => ({ ...prev, rating: Number(e.target.value) }))
            }
            className="border p-2 rounded w-24"
            aria-label="Rating (1-5)"
          />
          <textarea
            placeholder="Your review..."
            value={newReview.comment}
            onChange={(e) =>
              setNewReview((prev) => ({ ...prev, comment: e.target.value }))
            }
            className="border p-2 rounded w-full"
            aria-label="Review comment"
          ></textarea>
          <button
            onClick={addReview}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Submit Review
          </button>
        </div>
      </div>

      {/* Map Section */}
      <div className="aspect-video rounded overflow-hidden shadow">
        <iframe
          src={`https://www.google.com/maps?q=${encodeURIComponent(
            event.location || "Tozeur"
          )}&output=embed`}
          width="100%"
          height="100%"
          loading="lazy"
          title="Event location map"
        ></iframe>
      </div>

      {/* Admin Delete Button */}
      {user?.role === "admin" && (
        <div className="bg-red-50 p-4 rounded shadow">
          <button
            onClick={deleteEvent}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2"
          >
            <FaTrash /> Delete Event
          </button>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
