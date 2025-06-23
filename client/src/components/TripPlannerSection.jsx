import React from 'react';
import Title from './Title';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const TripPlannerSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative px-6 md:px-16 lg:px-24 xl:px-32 py-20 bg-white text-gray-900">
      <Title
        title="Plan Your Smart Trip"
        subTitle="AI-powered itineraries tailored for you."
      />

      <div className="mt-12 flex flex-col md:flex-row gap-10 items-center justify-between">
        {/* Illustration */}
        <div className="w-full md:w-1/2">
          <img
            src="https://res.cloudinary.com/dk9y2o5tl/image/upload/v1750622690/maxresdefault_l64z7a.jpg"
            alt="Trip planner illustration"
            className="w-full h-auto rounded-xl shadow-md"
          />
        </div>

        {/* Text & CTA */}
        <div className="w-full md:w-1/2">
          <p className="text-base text-gray-700 mb-6 leading-relaxed">
            Whether you're a culture lover, nature explorer, or food enthusiast — our intelligent trip planner curates the perfect desert adventure just for you. Say goodbye to the stress of planning!
          </p>
          <button
            onClick={() => navigate('/aiplanner')}
            className="px-6 py-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium transition-all"
          >
            Generate Your Itinerary
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripPlannerSection;
