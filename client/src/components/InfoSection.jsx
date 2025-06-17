import { GetPlaceDetails } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { FaShare } from 'react-icons/fa';

const PHOTO_REF_URL = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&maxheight=1000&photoreference={NAME}&key=${import.meta.env.VITE_GOOGLE_API_KEY}`;

function InfoSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    let isMounted = true;

    const fetchPlacePhoto = async () => {
      try {
        const data = { textQuery: trip.userSelection.lookingFor };
        const result = await GetPlaceDetails(data);
        const photos = result?.data?.places?.[0]?.photos;
        const photoName = photos && photos.length > 0 ? photos[0].photoReference || photos[0].name : null;
        if (photoName && isMounted) {
          const url = PHOTO_REF_URL.replace('{NAME}', photoName);
          setPhotoUrl(url);
        }
      } catch (error) {
        console.error('Error fetching place photo:', error);
      }
    };

    if (trip?.userSelection?.lookingFor) {
      fetchPlacePhoto();
    }

    return () => {
      isMounted = false;
    };
  }, [trip]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Trip: ${trip.userSelection.lookingFor}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert('Share not supported on this browser');
    }
  };

  return (
    <div>
      <img
        src={photoUrl || '/heroImage.png'}
        className="h-[340px] w-full object-cover rounded"
        alt="Trip Location"
      />
      <div className="flex justify-between items-center">
        <div className="my-5 flex flex-col gap-2">
          <h2 className="font-bold text-2xl">{trip?.userSelection?.lookingFor || 'Your Trip'}</h2>
          <div className="flex gap-5">
            <span className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
              📅 {trip?.userSelection?.days || 0} Days
            </span>
            <span className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
              💰 {trip?.userSelection?.budget?.title || 'N/A'} Budget
            </span>
            <span className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
              ✈️ {trip?.userSelection?.travelers?.title || 'N/A'} Travelers
            </span>
          </div>
        </div>
        <button aria-label="Share Trip" title="Share this trip" onClick={handleShare}>
          <FaShare />
        </button>
      </div>
    </div>
  );
}

export default InfoSection;
