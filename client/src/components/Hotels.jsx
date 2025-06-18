import React from 'react';

const Hotels = ({ hotels }) => {
  // Defensive check: hotels should be an array with length > 0
  if (!hotels || !Array.isArray(hotels) || hotels.length === 0) {
    return <p className="text-gray-500 mt-5">No hotels found.</p>;
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-4xl font-bold mb-8">Hotels</h2>
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {hotels.map((hotel) => {
          // Destructure safely with defaults
          const {
            id,
            name,
            address,
            image,
            rating,
            price,
          } = hotel || {};

          // Helper to safely parse value to string
          const safeString = (val, fallback = '') =>
            typeof val === 'string'
              ? val
              : val !== undefined && val !== null
              ? JSON.stringify(val)
              : fallback;

          return (
            <div
              key={id || Math.random().toString(36)} // fallback key if id missing (not ideal, but prevents error)
              className="rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {image && typeof image === 'string' && (
                <img
                  src={image}
                  alt={safeString(name, 'Hotel Image')}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-5">
                <h3 className="text-xl font-semibold">
                  {safeString(name, 'Unnamed Hotel')}
                </h3>

                {address && (
                  <p className="mt-2 text-gray-600">
                    {safeString(address)}
                  </p>
                )}

                {rating !== undefined && rating !== null && (
                  <p className="mt-2 text-yellow-500 font-semibold">
                    ⭐ {typeof rating === 'number' ? rating.toFixed(1) : safeString(rating)} / 5
                  </p>
                )}

                {price !== undefined && price !== null && (
                  <p className="mt-2 text-green-600 font-semibold">
                    From ${typeof price === 'number' || typeof price === 'string' ? price : safeString(price)} / night
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Hotels;
