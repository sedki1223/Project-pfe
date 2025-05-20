import React, { useEffect, useState } from 'react';
import { FaMapLocationDot } from "react-icons/fa6";
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';

function PlaceCardItem({ place }) {
  const [PhotoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    place && GetPlacePhoto();
  }, [place]);

  const GetPlacePhoto = async () => {
    try {
      const data = {
        textQuery: place.placeName,
      };
      const result = await GetPlaceDetails(data);
      const name = result?.data?.places?.[0]?.photos?.[3]?.name;
      if (name) {
        const url = PHOTO_REF_URL.replace('{NAME}', name);
        setPhotoUrl(url);
      }
    } catch (err) {
      console.error("Error fetching place photo:", err);
    }
  };

  return (
    <a
      href={`https://www.google.com/maps/search/?api=1&query=${place?.placeName}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className='border rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all hover:shadow-md cursor-pointer'>
        <img
          src={PhotoUrl ? PhotoUrl : "/heroImage.png"}
          alt="Place"
          className='w-[130px] h-[130px] rounded-xl object-cover'
        />
        <div className='mt-5'>
          <h2 className='font-bold text-lg'>{place.placeName}</h2>
          <p className='text-sm text-gray-400'>{place.placeDetails}</p>
          <h2 className='mt-2'>🕰️ {place.timeToTravel}</h2>
          <button><FaMapLocationDot /></button>
        </div>
      </div>
    </a>
  );
}

export default PlaceCardItem;
