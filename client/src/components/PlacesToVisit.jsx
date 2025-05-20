import React from 'react';

const PlacesToVisit = ({ places }) => {
  if (!places || !Array.isArray(places) || places.length === 0) {
    return <p className="text-gray-500 mt-5">No places to visit available.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 px-5">
      <h2 className="text-3xl font-bold mb-6">Places to Visit</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {places.map((place, index) => {
          // Destructure fields safely
          const { id, name, description, image } = place || {};

          return (
            <div key={id || index} className="border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              {image && typeof image === 'string' && (
                <img src={image} alt={typeof name === 'string' ? name : 'Place Image'} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold">
                  {typeof name === 'string' ? name : JSON.stringify(name) || 'Unnamed Place'}
                </h3>
                <p className="mt-2 text-gray-600">
                  {typeof description === 'string' ? description : JSON.stringify(description) || 'No description available.'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlacesToVisit;
