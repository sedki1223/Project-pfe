import React from 'react';

const PlacesToVisit = ({ places = [], events = [] }) => {
  const combinedItems = [...places, ...events];

  if (!Array.isArray(combinedItems) || combinedItems.length === 0) {
    return <p className="text-gray-500 mt-5">No places or events available.</p>;
  }

  // Helper to safely get string values
  const safeString = (val, fallback = '') =>
    typeof val === 'string'
      ? val
      : val !== undefined && val !== null
      ? JSON.stringify(val)
      : fallback;

  return (
    <div className="max-w-5xl mx-auto mt-10 px-5">
      <h2 className="text-3xl font-bold mb-6">Places & Events to Discover</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {combinedItems.map((item, index) => {
          const {
            id,
            name,
            title,
            description,
            image,
            date,
            location,
            price,
          } = item || {};

          const isEvent = !!title || !!date;

          return (
            <div
              key={id || index}
              className="border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {image && typeof image === 'string' && (
                <img
                  src={image}
                  alt={safeString(name || title, 'Image')}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold">
                  {safeString(name || title, isEvent ? 'Untitled Event' : 'Unnamed Place')}
                </h3>

                {isEvent && (
                  <>
                    <p className="text-sm text-gray-500 mt-1">
                      <strong>Date:</strong> {safeString(date, 'TBD')}
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Location:</strong> {safeString(location, 'Unknown')}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      <strong>Price:</strong> {safeString(price, 'Free')}
                    </p>
                  </>
                )}

                <p className="text-gray-600">
                  {safeString(description, 'No description available.')}
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
