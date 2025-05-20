import React from 'react';
import { Link } from 'react-router-dom';

const AiPlanner = () => {
  return (
    <section className="mt-24 mb-24 px-6 lg:px-56">
      <div className="flex flex-col items-center text-center gap-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
          <span className="text-[#f56551]">Discover Your Next Adventure With AI:</span><br />
          Personalized Itineraries at Your Fingertips
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl">
          Your personal trip planner and travel curator — creating custom itineraries tailored to your interests and budget.
        </p>
        <Link to={'/createtrip'}>
            <button className="bg-[#f56551] text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-[#e85a47] transition duration-300 shadow-md">
            Get Started Now
        </button>
        </Link>
      </div>
    </section>
  );
};

export default AiPlanner;