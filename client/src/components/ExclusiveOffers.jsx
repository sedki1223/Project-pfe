import React from 'react';
import Title from './Title';
import { assets, exclusiveOffers } from '../assets/assets';

const ExclusiveOffers = () => {
  return (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 xl:px-32 py-20 bg-white text-gray-900">
      {/* Section Heading */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full">
        <Title
          align="left"
          title="🔥 Exclusive Offers"
          subTitle="Take advantage of limited-time deals and elevate your oasis adventure with exclusive packages curated just for you."
        />

        <button className="group flex items-center gap-2 text-amber-700 font-semibold mt-8 md:mt-0 hover:underline">
          View All Offers
          <img
            src={assets.arrowIcon}
            alt="arrow-icon"
            className="h-4 group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 w-full">
        {exclusiveOffers.map((item) => (
          <div
            key={item._id}
            className="relative rounded-xl overflow-hidden shadow-lg group bg-cover bg-center text-white h-[320px] flex flex-col justify-between p-6 transition-all duration-300"
            style={{ backgroundImage: `url(${item.image})` }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300 z-0" />

            {/* Discount Tag */}
            <p className="absolute top-4 left-4 z-10 px-3 py-1 text-xs font-semibold bg-white text-gray-900 rounded-full">
              {item.priceOff}% OFF
            </p>

            {/* Text Content */}
            <div className="z-10 relative">
              <p className="text-2xl font-playfair font-semibold">{item.title}</p>
              <p className="mt-1 text-sm">{item.description}</p>
              <p className="text-xs text-white/70 mt-3">Expires {item.expiryDate}</p>
            </div>

            {/* CTA */}
            <button className="z-10 relative mt-4 flex items-center gap-2 text-sm font-medium hover:underline">
              View Offer
              <img
                src={assets.arrowIcon}
                alt="arrow-icon"
                className="h-4 group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExclusiveOffers;
