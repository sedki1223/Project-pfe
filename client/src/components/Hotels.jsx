import React from 'react';

const Hotels = ({ hotels }) => {
  if (!hotels || !Array.isArray(hotels) || hotels.length === 0) {
    return <p className="text-gray-500 mt-5">No hotels found.</p>;
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-4xl font-bold mb-8">Hotels</h2>
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {hotels.map(({ id, name, address, image, rating, price }) => (
          <div
            key={id}
            className="rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {image && typeof image === 'string' && (
              <img
                src={image}
                alt={typeof name === 'string' ? name : 'Hotel Image'}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-5">
              <h3 className="text-xl font-semibold">
                {typeof name === 'string' ? name : JSON.stringify(name) || 'Unnamed Hotel'}
              </h3>
              {address && (
                <p className="mt-2 text-gray-600">
                  {typeof address === 'string' ? address : JSON.stringify(address)}
                </p>
              )}
              {rating !== undefined && (
                <p className="mt-2 text-yellow-500 font-semibold">
                  ⭐ {typeof rating === 'number' ? rating : JSON.stringify(rating)} / 5
                </p>
              )}
              {price !== undefined && (
                <p className="mt-2 text-green-600 font-semibold">
                  From ${typeof price === 'number' || typeof price === 'string' ? price : JSON.stringify(price)} / night
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hotels;
