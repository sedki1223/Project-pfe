import React, { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { FaBus, FaTrain, FaTaxi } from 'react-icons/fa'

const TransportResults = () => {
  const location = useLocation()
  const [transports, setTransports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Helper: parse query params from URL
  const getQueryParams = () => {
    return new URLSearchParams(location.search)
  }

useEffect(() => {
  const fetchTransports = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams(location.search);
      const response = await fetch(`/api/transport?${params.toString()}`);
      if (!response.ok) throw new Error(`Failed to fetch transport options: ${response.statusText}`);

      const data = await response.json();
      setTransports(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  fetchTransports();
}, [location.search]);

  // Icon map
  const iconMap = {
    bus: <FaBus className="text-blue-600" />,
    train: <FaTrain className="text-green-600" />,
    taxi: <FaTaxi className="text-yellow-600" />,
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold mb-8 text-center">Available Transport Options</h2>

      {loading && <p className="text-center text-lg">Loading...</p>}
      {error && <p className="text-center text-red-600 font-semibold">{error}</p>}

      {!loading && !error && transports.length === 0 && (
        <p className="text-center text-gray-600">No transport options found.</p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {transports.map((t) => (
          <Link
            to={`/transport/${t._id}`}
            key={t._id}
            className="border rounded-lg p-6 shadow hover:shadow-lg transition block"
            aria-label={`View details for ${t.type} to ${t.destination} on ${new Date(t.date).toLocaleDateString()}`}
          >
            <div className="flex items-center gap-4 mb-3 text-xl font-semibold">
              {iconMap[t.type] || null}
              <span className="capitalize">{t.type}</span>
            </div>
            <p>
              <strong>Destination:</strong> {t.destination}
            </p>
            <p>
              <strong>Date:</strong> {new Date(t.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Time:</strong> {t.time}
            </p>
            <p>
              <strong>Price:</strong> ${t.price.toFixed(2)}
            </p>
            <p>
              <strong>Available Seats:</strong> {t.availableSeats}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default TransportResults
