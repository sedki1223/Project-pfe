import React from 'react';
import { assets } from '../assets/assets';

const Hero = () => {
  return (
    <div
      className='relative h-screen bg-center bg-cover bg-no-repeat text-white flex items-center'
      style={{ backgroundImage: `url(https://res.cloudinary.com/dk9y2o5tl/image/upload/v1750816996/wallpaperflare.com_wallpaper_js3nrz.jpg)` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-[#00000077] to-[#00000033]" />

      {/* Content */}
      <div className="relative z-10 px-6 md:px-16 lg:px-24 xl:px-32 max-w-7xl w-full">
        <p className="bg-[#49B9FF]/60 px-4 py-1 rounded-full inline-block text-sm tracking-wide">
          Discover the Spirit of the Sahara
        </p>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-extrabold leading-tight mt-4 max-w-3xl">
          Plan Your Perfect Escape to Tozeur
        </h1>

        <p className="mt-4 text-base md:text-lg max-w-md text-white/90">
          Explore desert oases, local cuisine, and unique cultural experiences.
        </p>

        {/* Form */}
        <form className="bg-white text-gray-700 rounded-xl px-6 py-5 mt-10 flex flex-col md:flex-row gap-4 shadow-lg max-w-4xl">
          {/* Check In */}
          <div className="flex flex-col">
            <label htmlFor="checkIn" className="flex items-center gap-2 text-sm font-medium">
              <img src={assets.calenderIcon} alt="" className="h-4" />
              Check In
            </label>
            <input
              id="checkIn"
              type="date"
              className="mt-2 rounded border border-gray-300 px-3 py-2 text-sm outline-none"
            />
          </div>

          {/* Check Out */}
          <div className="flex flex-col">
            <label htmlFor="checkOut" className="flex items-center gap-2 text-sm font-medium">
              <img src={assets.calenderIcon} alt="" className="h-4" />
              Check Out
            </label>
            <input
              id="checkOut"
              type="date"
              className="mt-2 rounded border border-gray-300 px-3 py-2 text-sm outline-none"
            />
          </div>

          {/* Guests */}
          <div className="flex flex-col">
            <label htmlFor="guests" className="text-sm font-medium">Guests</label>
            <input
              id="guests"
              type="number"
              min={1}
              max={10}
              className="mt-2 rounded border border-gray-300 px-3 py-2 text-sm outline-none w-20"
              placeholder="2"
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-md bg-[#d97706] hover:bg-[#b45309] text-white px-6 py-3 font-semibold w-full md:w-auto mt-2 md:mt-6"
          >
            <img src={assets.searchIcon} alt="search icon" className="h-5" />
            <span>Search</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Hero;
