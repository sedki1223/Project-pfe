import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../service/firebaseConfig";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";

// Utility to fix broken map links
const sanitizeMapUrl = (url, fallbackQuery = "Tozeur") => {
  if (!url || url.includes("goo.gl")) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      fallbackQuery
    )}`;
  }
  return url;
};

const fallbackImage =
  "https://res.cloudinary.com/dk9y2o5tl/image/upload/v1750816996/wallpaperflare.com_wallpaper_js3nrz.jpg";

// Animation variants
const cardVariants = {
  offscreen: { opacity: 0, y: 30 },
  onscreen: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.15, duration: 0.6 } },
};
const containerVariants = {
  offscreen: {},
  onscreen: { transition: { staggerChildren: 0.15 } },
};

const validImage = (url) => (url && url.trim() !== "" ? url : fallbackImage);

const ViewTrip = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tripId) fetchTrip();
  }, [tripId]);

  const fetchTrip = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "AiTrips", tripId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTrip(docSnap.data());
      } else {
        toast.error("Trip not found.");
      }
    } catch (err) {
      toast.error("Error fetching trip.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="p-10 text-center text-lg">Loading trip details...</div>;
  if (!trip)
    return (
      <div className="p-10 text-center text-red-600 font-semibold">Trip not found.</div>
    );

  const { itinerary, reply } = trip;
  const days = itinerary?.days || [];
  const hotels = itinerary?.hotels || [];
  const events = itinerary?.events || [];

  // 1. Share Itinerary Button Handler
  const handleShare = () => {
    const shareData = {
      title: "My Tozeur Trip Itinerary",
      text: "Check out my AI-generated trip itinerary for Tozeur!",
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => toast.error("Sharing failed or cancelled"));
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success("Trip URL copied to clipboard!"))
        .catch(() => toast.error("Failed to copy URL"));
    }
  };

  // 2. Add to Calendar (generate simple ICS file)
  const handleAddToCalendar = () => {
    if (days.length === 0) {
      toast.error("No itinerary days to add to calendar.");
      return;
    }

    const firstDay = days[0];
    const startDate = new Date(firstDay.date || Date.now());
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 8);

    const formatDate = (date) =>
      date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Visit Tozeur//EN
BEGIN:VEVENT
UID:${Date.now()}@visittozeur.app
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:Tozeur Trip - ${days.length} Days Itinerary
DESCRIPTION:Your AI-generated trip to Tozeur.
LOCATION:Tozeur, Tunisia
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent.trim()], { type: "text/calendar" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "tozeur_trip.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Calendar event downloaded!");
  };

  // 3. Download PDF summary using jsPDF
  const handleDownloadPdf = () => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("Your Tozeur Trip Itinerary", 14, 25);

    let y = 40;
    const lineHeight = 8;
    const margin = 14;
    const pageHeight = 280;

    days.forEach((day, i) => {
      doc.setFontSize(16);
      doc.setTextColor("#000080");
      doc.text(`Day ${i + 1}: ${day.title}`, margin, y);
      y += lineHeight;

      doc.setFontSize(12);
      doc.setTextColor("#000000");

      const sections = [
        { label: "Morning", text: day.morning },
        { label: "Afternoon", text: day.afternoon },
        { label: "Evening", text: day.evening },
      ];

      sections.forEach(({ label, text }) => {
        if (text) {
          const splitText = doc.splitTextToSize(`${label}: ${text}`, 180);
          doc.text(splitText, margin, y);
          y += lineHeight * splitText.length;
        }
      });

      y += lineHeight;

      if (y > pageHeight) {
        doc.addPage();
        y = 25;
      }
    });

    doc.save("Tozeur_Trip_Itinerary.pdf");
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-14 mt-12">
      {/* Hero Banner */}
      <div className="relative rounded-xl overflow-hidden shadow-lg">
        <img
          src="https://source.unsplash.com/featured/?tozeur-desert"
          alt="Tozeur"
          className="w-full h-72 object-cover"
          onError={(e) => {
                    e.currentTarget.src = fallbackImage;
                  }}
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center p-6">
          <h1 className="text-4xl font-extrabold">
            Your 4-Day Adventure in Tozeur 🇹🇳
          </h1>
          <p className="text-lg mt-2 max-w-2xl">
            An AI-powered trip tailored just for you — full of culture, flavor,
            and desert magic.
          </p>
        </div>
      </div>

      {/* Daily Itinerary */}
      {days.length > 0 && (
        <section>
          <h2 className="text-3xl font-semibold mb-6 border-b border-gray-300 pb-2">
            🗓️ Daily Plan
          </h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            {days.map((day, i) => (
              <motion.div
                key={i}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md"
                variants={cardVariants}
              >
                <img
                  src={validImage(day.image)}
                  alt={day.title}
                  className="w-full h-52 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = fallbackImage;
                  }}
                />
                <div className="p-5 space-y-3">
                  <h3 className="text-2xl font-bold">{`Day ${i + 1}: ${day.title}`}</h3>

                  {day.location && (
                    <a
                      href={sanitizeMapUrl(day.map, day.location)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm hover:underline"
                    >
                      📍 {day.location} (View on Map)
                    </a>
                  )}

                  <div className="text-gray-800 space-y-1">
                    <p>
                      <strong>🌅 Morning:</strong> {day.morning || "N/A"}
                    </p>
                    <p>
                      <strong>🐫 Afternoon:</strong> {day.afternoon || "N/A"}
                    </p>
                    <p>
                      <strong>🌙 Evening:</strong> {day.evening || "N/A"}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Hotels */}
      {hotels.length > 0 && (
        <section>
          <h2 className="text-3xl font-semibold mb-4 border-b border-gray-300 pb-2">
            🏨 Hotels
          </h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            {hotels.map((hotel, i) => (
              <motion.div
                key={i}
                className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm space-y-2"
                variants={cardVariants}
              >
                <img
                  src={validImage(hotel.image)}
                  alt={hotel.name}
                  className="w-full h-44 object-cover rounded-md mb-3"
                  onError={(e) => {
                    e.currentTarget.src = fallbackImage;
                  }}
                />
                <h3 className="text-xl font-bold">{hotel.name}</h3>
                <p>{hotel.stars}</p>
                <p className="text-gray-600">{hotel.address}</p>
                {hotel.map && (
                  <a
                    href={sanitizeMapUrl(hotel.map, hotel.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    📍 View on Map
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Events */}
      {events.length > 0 && (
        <section>
          <h2 className="text-3xl font-semibold mb-4 border-b border-gray-300 pb-2">
            🎉 Events
          </h2>
          <motion.div
            className="space-y-6"
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            {events.map((event, i) => (
              <motion.div
                key={i}
                className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm space-y-1"
                variants={cardVariants}
              >
                <img
                  src={validImage(event.image)}
                  alt={event.name}
                  className="w-full h-44 object-cover rounded-md mb-3"
                  onError={(e) => {
                    e.currentTarget.src = fallbackImage;
                  }}
                />
                <h3 className="text-xl font-bold">{event.name}</h3>
                <p>
                  📅 {event.date} | 📍 {event.location}
                </p>
                {event.map && (
                  <a
                    href={sanitizeMapUrl(event.map, event.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View on Map
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* AI Raw Reply */}
      {reply && (
        <section className="bg-gray-100 p-6 rounded-md border text-sm text-gray-800">
          <h2 className="font-bold text-xl mb-3">🧠 AI Summary (Raw)</h2>
          <pre className="whitespace-pre-wrap">{reply}</pre>
        </section>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-6 mt-10">
        <button
          onClick={handleShare}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          📤 Share Itinerary
        </button>
        <button
          onClick={handleAddToCalendar}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          📅 Add to Calendar
        </button>
        <button
          onClick={handleDownloadPdf}
          className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold"
        >
          🧾 Download PDF
        </button>
      </div>
    </div>
  );
};

export default ViewTrip;
