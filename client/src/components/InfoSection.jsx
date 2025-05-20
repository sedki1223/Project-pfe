import { GetPlaceDetails } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { FaShare } from 'react-icons/fa';

const PHOTO_REF_URL =
  'https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key=' +
  import.meta.env.VITE_GOOGLE_PLACE_ID;

function InfoSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    if (trip?.userSelection?.lookingFor) {
      fetchPlacePhoto();
    }
  }, [trip]);

  const fetchPlacePhoto = async () => {
    try {
      const data = {
        textQuery: trip.userSelection.lookingFor,
      };
      const result = await GetPlaceDetails(data);
      const photos = result?.data?.places?.[0]?.photos;
      const photoName = photos && photos.length > 0 ? photos[0].name : null;
      if (photoName) {
        const url = PHOTO_REF_URL.replace('{NAME}', photoName);
        setPhotoUrl(url);
      }
    } catch (error) {
      console.error('Error fetching place photo:', error);
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
          <h2 className="font-bold text-2xl">
            {trip?.userSelection?.lookingFor || 'Your Trip'}
          </h2>
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
        <button aria-label="Share Trip">
          <FaShare />
        </button>
      </div>
    </div>
  );
}

export default InfoSection;
