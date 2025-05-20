import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function HotelCardItem({ hotel }) {
  const [PhotoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    hotel && GetPlacePhoto();
  }, [hotel]);

  const GetPlacePhoto = async () => {
    try {
      const data = {
        textQuery: hotel?.hotelName
      };
      const result = await GetPlaceDetails(data);
      const name = result?.data?.places?.[0]?.photos?.[3]?.name;
      if (name) {
        const url = PHOTO_REF_URL.replace('{NAME}', name);
        setPhotoUrl(url);
      }
    } catch (error) {
      console.error("Error fetching hotel photo:", error);
    }
  };

  return (
    <Link
      to={`https://www.google.com/maps/search/?api=1&query=${hotel?.hotelName},${hotel?.hotelAdress}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="hover:scale-105 transition-all cursor-pointer">
        <img
          src={PhotoUrl ? PhotoUrl : "/heroImage.png"}
          alt="Hotel"
          className="rounded-xl h-[180px] w-full object-cover"
        />
        <div className="my-2 flex flex-col gap-2">
          <h2 className="font-medium">{hotel?.hotelName}</h2>
          <h2 className="text-xs text-gray-500">📍{hotel?.hotelAdress}</h2>
          <h2 className="text-sm">💲{hotel?.price}</h2>
          <h2 className="text-sm">⭐{hotel?.rating}</h2>
        </div>
      </div>
    </Link>
  );
}

export default HotelCardItem;
