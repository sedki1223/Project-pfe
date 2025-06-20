import React from 'react';
import Hero from '../components/Hero';
import FeaturedDestination from '../components/FeaturedDestination';
import ExclusiveOffers from '../components/ExclusiveOffers';
import FoodSection from '../components/FoodSection';
import EventSection from '../components/EventSection';
import TransportSection from '../components/TransportSection';
import TripPlannerSection from '../components/TripPlannerSection';
import Testimonial from '../components/Testimonial';
import NewsLetter from '../components/NewsLetter';

const Home = () => {
  return (
    <div >
      {/* Hero Section */}
      <section>
        <Hero />
      </section>

      {/* Featured Destinations */}
      <section >
        <FeaturedDestination />
      </section>

      

      {/* Food Section */}
      <section>
        <FoodSection />
      </section>

      {/* Event Section */}
      <section>
        <EventSection />
      </section>

      {/* Transport Section */}
      <section>
        <TransportSection />
      </section>

      {/* AI Trip Planner Section */}
      <section>
        <TripPlannerSection />
      </section>

      {/* Exclusive Offers */}
      <section >
        <ExclusiveOffers />
      </section>

      {/* Testimonials */}
      <section >
        <Testimonial />
      </section>

      {/* Newsletter */}
      <section >
        <NewsLetter />
      </section>
    </div>
  );
};

export default Home;
