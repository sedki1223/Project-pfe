import React, { useEffect, useState } from 'react';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';

const TestPlaceDetails = () => {
  const [photoUrl, setPhotoUrl] = useState('');
  const [placeName, setPlaceName] = useState('');

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const data = {
          textQuery: "Eiffel Tower" // 🔁 You can change this to any place
        };
        const response = await GetPlaceDetails(data);
        const place = response.data.places?.[0];

        if (place?.photos?.[0]?.name) {
          const url = PHOTO_REF_URL.replace('{NAME}', place.photos[0].name);
          setPhotoUrl(url);
          setPlaceName(place.displayName?.text || 'Unnamed');
        } else {
          console.warn('No photo found for place');
        }
      } catch (err) {
        console.error('Error fetching place details:', err);
      }
    };

    fetchPlace();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold mb-4">Place Preview</h1>
      {photoUrl ? (
        <img src={photoUrl} alt="Place" className="rounded shadow-lg w-[400px]" />
      ) : (
        <p>Loading photo...</p>
      )}
      <h2 className="mt-4">{placeName}</h2>
    </div>
  );
};

export default TestPlaceDetails;
