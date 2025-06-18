import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../service/firebaseConfig";
import Footer from "@/components/Footer";
import InfoSection from "@/components/InfoSection";
import Hotels from "@/components/Hotels";
import PlacesToVisit from "@/components/PlacesToVisit";

const ViewTrip = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tripId) {
      getTripData();
    }
  }, [tripId]);

  const getTripData = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "AiTrips", tripId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTrip(docSnap.data());
      } else {
        toast.error("No Trip Found!");
      }
    } catch (error) {
      toast.error("Error fetching trip data");
      console.error("Error getting trip:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="p-10 text-center text-lg">Loading trip details...</div>;

  if (!trip)
    return (
      <div className="p-10 text-center text-red-600 text-lg font-semibold">
        Trip not found.
      </div>
    );

  const itineraryDays = trip.itinerary?.days || [];
  const places = trip.itinerary?.places || []; // ✅ Added this line for places

  let lastDayDescription = itineraryDays.length
    ? itineraryDays[itineraryDays.length - 1].description
    : "";
  let mainDescriptions = lastDayDescription;
  let additionalTips = null;

  if (lastDayDescription.includes("**Additional Tips and Recommendations**")) {
    const parts = lastDayDescription.split("**Additional Tips and Recommendations**");
    mainDescriptions = parts[0].trim();
    additionalTips = parts[1].trim();
    itineraryDays[itineraryDays.length - 1].description = mainDescriptions;
  }

  return (
    <div className="p-6 md:px-16 lg:px-32 xl:px-48 space-y-12 max-w-7xl mx-auto">
      <InfoSection trip={trip} />

      <Hotels trip={trip} />

      {/* ✅ New Section: Places to Visit */}
      {places.length > 0 && (
        <section>
          <PlacesToVisit places={places} />
        </section>
      )}

      <section>
        <h2 className="text-3xl font-bold mb-6 border-b border-gray-300 pb-2">
          Itinerary
        </h2>
        <div className="space-y-10">
          {itineraryDays.map(({ title, description, location, image, map }, index) => (
            <article
              key={index}
              className="p-6 bg-white shadow-md rounded-lg border border-gray-200"
            >
              <h3 className="text-2xl font-semibold mb-3">{title}</h3>
              {location && map && (
                <a
                  href={map}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mb-4 text-sm text-blue-600 hover:underline"
                >
                  View on map ({location})
                </a>
              )}
              <p className="whitespace-pre-line text-gray-700">{description}</p>
              {image && (
                <img
                  src={image}
                  alt={title}
                  className="mt-4 rounded-md max-h-48 w-full object-cover"
                />
              )}
            </article>
          ))}
        </div>
      </section>

      {additionalTips && (
        <section className="bg-yellow-50 p-6 rounded-md border border-yellow-300">
          <h2 className="text-2xl font-semibold mb-3 text-yellow-700">
            Additional Tips and Recommendations
          </h2>
          <p className="whitespace-pre-line text-yellow-900">{additionalTips}</p>
        </section>
      )}

      {trip.reply && (
        <section className="bg-gray-100 p-6 rounded-md prose max-w-none">
          <h2>AI Trip Summary (Raw)</h2>
          <pre className="whitespace-pre-wrap">{trip.reply}</pre>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default ViewTrip;
