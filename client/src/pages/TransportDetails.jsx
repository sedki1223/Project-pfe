// src/pages/TransportDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { toast } from 'react-hot-toast';
import { FaBus, FaTrain, FaTaxi, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaDollarSign, FaUsers } from 'react-icons/fa';
import Title from '@/components/Title';

const iconMap = {
  bus: <FaBus className="text-blue-600" size={40} />,
  train: <FaTrain className="text-green-600" size={40} />,
  taxi: <FaTaxi className="text-yellow-500" size={40} />,
};

const TransportDetails = () => {
  const { id } = useParams();
  const { axios, getToken, user } = useAppContext();
  const navigate = useNavigate();
  const [transport, setTransport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  const fetchTransport = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`/api/transport/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransport(data);
      setReviews(data.reviews || []);
    } catch {
      toast.error('Failed to load transport');
    } finally {
      setLoading(false);
    }
  };

const bookSeats = async () => {
  try {
    const token = await getToken();
    await axios.post(`/api/transport-bookings/book`, { transportId: id, seats: seatsToBook }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success('Booking successful');
    navigate('/transport-bookings');
    fetchTransport();
  } catch {
    toast.error('Booking failed');
  }
};


  const addReview = async () => {
    try {
      const token = await getToken();
      await axios.post(`/api/transport/${id}/reviews`, newReview, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Review added');
      setNewReview({ rating: 5, comment: '' });
      fetchTransport();
    } catch {
      toast.error('Failed to add review');
    }
  };

  const deleteTransport = async () => {
    if (!window.confirm('Delete this transport?')) return;
    try {
      const token = await getToken();
      await axios.delete(`/api/admin/delete-transport/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Transport deleted');
      navigate('/admin');
    } catch {
      toast.error('Failed to delete transport');
    }
  };

  useEffect(() => {
    fetchTransport();
  }, [id]);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (!transport) return <div className="text-center py-12 text-gray-500">Transport not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 mt-8">
      <Title title={`Transport to ${transport.destination}`} />

      {/* Hero Section */}
      <div className="flex items-center gap-4 p-4 bg-white rounded shadow mt-16">
        {iconMap[transport.type]}
        <div>
          <h2 className="text-xl font-bold mt-2">
            {transport?.type ? transport.type.toUpperCase() : '...'} to {transport.destination}
          </h2>
          <p className="text-gray-600 flex items-center gap-2">
            <FaCalendarAlt /> {new Date(transport.date).toLocaleDateString()} <FaClock /> {transport.time}
          </p>
          <p className="text-blue-600 font-semibold flex items-center gap-2">
            <FaDollarSign /> {transport.price} TND
          </p>
        </div>
      </div>


      {/* Booking Section */}
      <div className="bg-white p-4 rounded shadow space-y-2">
        <h3 className="text-lg font-bold">Book Your Seat</h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            min={1}
            max={transport.availableSeats}
            value={seatsToBook}
            onChange={e => setSeatsToBook(e.target.value)}
            className="border rounded p-2 w-24"
          />
          <button
            onClick={bookSeats}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Book Now ({seatsToBook * transport.price} TND)
          </button>
        </div>
        <div className="w-full bg-gray-200 rounded h-2">
          <div
            className="bg-blue-600 h-2 rounded"
            style={{ width: `${((transport.availableSeats - seatsToBook) / transport.availableSeats) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500">{transport.availableSeats} seats available</p>
      </div>

      {/* Map Section */}
      <div className="aspect-video rounded overflow-hidden shadow">
        <iframe
          src={`https://www.google.com/maps?q=${encodeURIComponent(transport.destination)}&output=embed`}
          width="100%"
          height="100%"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      {/* Details Card */}
      <div className="bg-white p-4 rounded shadow space-y-2">
        <h3 className="text-lg font-bold">Details</h3>
        <p><FaMapMarkerAlt className="inline mr-1" /> Destination: {transport.destination}</p>
        <p><FaCalendarAlt className="inline mr-1" /> Date: {new Date(transport.date).toLocaleDateString()}</p>
        <p><FaClock className="inline mr-1" /> Time: {transport.time}</p>
        <p><FaDollarSign className="inline mr-1" /> Price: {transport.price} TND</p>
        <p><FaUsers className="inline mr-1" /> Available Seats: {transport.availableSeats}</p>
      </div>

      {/* Admin Controls */}
      {user?.role === 'admin' && (
        <div className="bg-red-50 p-4 rounded shadow">
          <button
            onClick={deleteTransport}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete Transport
          </button>
        </div>
      )}

      {/* Reviews Section */}
      <div className="bg-white p-4 rounded shadow space-y-4">
        <h3 className="text-lg font-bold">Reviews</h3>
        {reviews.length > 0 ? (
          <div className="space-y-2">
            {reviews.map((review, idx) => (
              <div key={idx} className="border p-2 rounded">
                <p className="font-semibold">{review.user?.name || 'Anonymous'} - {review.rating} ⭐</p>
                <p className="text-sm text-gray-600">{new Date(review.createdAt).toLocaleDateString()}</p>
                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
        <div className="space-y-2">
          <input
            type="number"
            min={1}
            max={5}
            value={newReview.rating}
            onChange={e => setNewReview(prev => ({ ...prev, rating: e.target.value }))}
            className="border p-2 rounded w-24"
          />
          <textarea
            placeholder="Your review..."
            value={newReview.comment}
            onChange={e => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
            className="border p-2 rounded w-full"
          ></textarea>
          <button
            onClick={addReview}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransportDetails;