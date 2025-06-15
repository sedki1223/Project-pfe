import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { doc, getDoc } from 'firebase/firestore';
import { db } from "../service/firebaseConfig";
import Footer from '@/components/Footer';
import InfoSection from '@/components/InfoSection';
import PlacesToVisit from '@/components/PlacesToVisit';
import Hotels from "@/components/Hotels";

const ViewTrip = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tripId) {
      GetTripData();
    }
  }, [tripId]);

  const GetTripData = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'AiTrips', tripId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTrip(docSnap.data());
      } else {
        toast.error('No Trip Found!');
      }
    } catch (error) {
      toast.error('Error fetching trip data');
      console.error('Error getting trip:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading trip details...</div>;

  if (!trip) return <div className="p-10 text-center text-red-600">Trip not found.</div>;

  return (
    <div className="p-10 md:px-20 lg:px-44 xl:px-56">
      <InfoSection trip={trip} />
      <Hotels trip={trip} />
      <PlacesToVisit trip={trip} />
      <Footer />
    </div>
  );
};

export default ViewTrip;
