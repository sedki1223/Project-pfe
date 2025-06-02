import React from 'react';
import HotelCard from './HotelCard';
import { useNavigate } from 'react-router-dom';
import Title from './Title';
import { useAppContext } from '@/context/AppContext'; // ✅ Import the context

const FeaturedDestination = () => {
  const { rooms } = useAppContext();
  const navigate = useNavigate(); // ✅ This is separate from context

  if (rooms.length === 0) return null;

  return (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>
      <Title
        title='Featured Hotels'
        subTitle='Discover our handpicked selection of exceptional properties around our beautiful city, offering unparalleled luxury and unforgettable experiences.'
      />

      <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
        {rooms.slice(0, 4).map((room, index) => (
          <HotelCard key={room._id} room={room} index={index} />
        ))}
      </div>

      <button
        onClick={() => {
          navigate('/rooms');
          scrollTo(0, 0);
        }}
        className='my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer'
      >
        View all Hotels
      </button>
    </div>
  );
};

export default FeaturedDestination;
