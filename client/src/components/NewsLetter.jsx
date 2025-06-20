import React from 'react';
import { assets } from '../assets/assets';
import Title from './Title';

const NewsLetter = () => {
  return (
    <div className="flex flex-col items-center px-4 py-16 md:py-20 bg-gradient-to-br from-[#b45309] via-[#7c3aed] to-[#111827] text-white rounded-2xl max-w-5xl mx-auto my-24">
      {/* Title */}
      <Title
        title="📬 Stay Inspired"
        subTitle="Join our newsletter and be the first to discover new events, exclusive offers, and trip inspiration."
      />

      {/* Input & Button */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8 w-full max-w-xl">
        <input
          type="email"
          placeholder="Enter your email"
          className="bg-white/10 px-5 py-3 border border-white/20 rounded-md outline-none w-full text-sm placeholder-white/70 focus:ring-2 focus:ring-white/30 transition-all"
        />
        <button className="flex items-center justify-center gap-2 group bg-white text-black font-semibold px-6 py-3 rounded-md hover:bg-gray-100 transition-all active:scale-95">
          Subscribe
          <img
            src={assets.arrowIcon}
            alt="arrow icon"
            className="w-4 group-hover:translate-x-1 transition-transform invert"
          />
        </button>
      </div>

      {/* Terms */}
      <p className="text-white/70 mt-6 text-xs text-center max-w-md">
        By subscribing, you agree to our Privacy Policy and consent to receive occasional updates from VisitTozeur.
      </p>
    </div>
  );
};

export default NewsLetter;
