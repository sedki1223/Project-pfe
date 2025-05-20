import React from "react";

const About = () => {
  return (
    <div className="px-4 max-w-5xl mx-auto mt-24 mb-20">
      <h1 className="text-4xl font-bold mb-6 text-center">About Us</h1>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Why Choose Us</h2>
        <p className="text-gray-700 leading-relaxed">
          We strive to provide the best travel experience by combining convenience,
          affordability, and personalized service. Whether you’re booking a hotel,
          ordering delicious food, or planning your entire trip, our platform is
          designed to make your journey seamless and enjoyable.
        </p>
      </section>

      <section className="mt-16 mb-20">
        <h2 className="text-2xl font-semibold mb-6">Services We Provide</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Hotel Booking</h3>
            <p className="text-gray-700 leading-relaxed">
              Easily find and reserve your ideal hotel rooms with competitive prices and
              detailed descriptions to help you make the best choice for your stay.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Food Delivery</h3>
            <p className="text-gray-700 leading-relaxed">
              Order tasty meals from a wide range of restaurants and get them delivered
              straight to your doorstep or hotel room, hassle-free.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Transportation Schedules</h3>
            <p className="text-gray-700 leading-relaxed">
              Access up-to-date schedules and book transportation options including buses,
              trains, and taxis to keep your trip moving smoothly.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Events</h3>
            <p className="text-gray-700 leading-relaxed">
              Stay updated with the latest event schedules in your destination — concerts,
              festivals, exhibitions, and more — so you never miss out on the fun.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">AI Trip Planner</h3>
            <p className="text-gray-700 leading-relaxed">
              Let our smart AI planner suggest the perfect itinerary tailored to your
              interests and travel preferences, saving you time and effort.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
