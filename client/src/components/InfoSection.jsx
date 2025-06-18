import React, { useEffect, useState } from 'react';
import { FaShare } from 'react-icons/fa';

const FALLBACK_IMAGE_URL = '/fallback-image.jpg'; // Make sure this image exists in your public folder

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

async function searchPhotos(query) {
  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1`,
    {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    }
  );
  if (!response.ok) throw new Error('Unsplash API error');
  const data = await response.json();
  return data.results;
}

function InfoSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState(FALLBACK_IMAGE_URL);

  useEffect(() => {
    let isMounted = true;

    const fetchPhoto = async () => {
      try {
        const query = trip?.userSelection?.lookingFor;
        if (!query) {
          setPhotoUrl(FALLBACK_IMAGE_URL);
          return;
        }

        const photos = await searchPhotos(query);

        if (photos.length > 0 && photos[0]?.urls?.regular) {
          if (isMounted) setPhotoUrl(photos[0].urls.regular);
        } else {
          if (isMounted) setPhotoUrl(FALLBACK_IMAGE_URL);
        }
      } catch (error) {
        console.error('Error fetching Unsplash photo:', error);
        if (isMounted) setPhotoUrl(FALLBACK_IMAGE_URL);
      }
    };

    fetchPhoto();

    return () => {
      isMounted = false;
    };
  }, [trip]);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Trip: ${trip?.userSelection?.lookingFor || 'Your Trip'}`,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      alert('Share not supported on this browser');
    }
  };

  const getTitle = (item) => {
    if (!item) return 'N/A';
    if (typeof item === 'string') return item;
    if (typeof item === 'object' && item.title) return item.title;
    return 'N/A';
  };

  return (
    <div>
      <img
        src={photoUrl}
        className="h-[340px] w-full object-cover rounded"
        alt={`Trip Location: ${trip?.userSelection?.lookingFor || ''}`}
      />

      <div className="flex justify-between items-center">
        <div className="my-5 flex flex-col gap-2">
          <h2 className="font-bold text-2xl">{trip?.userSelection?.lookingFor || 'Your Trip'}</h2>
          <div className="flex gap-5">
            <span className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
              📅 {trip?.userSelection?.days || 0} Days
            </span>
            <span className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
              💰 {getTitle(trip?.userSelection?.budget)}
            </span>
            <span className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
              ✈️ {getTitle(trip?.userSelection?.travelers)}
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
