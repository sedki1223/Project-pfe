import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import StarRating from '../components/StarRating';
import Title from '../components/Title';
import toast from 'react-hot-toast';
import { assets } from '../assets/assets';

const RoomDetails = () => {
  const { id } = useParams();
  const { axios, getToken, navigate, currency = '$' } = useAppContext();

  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [error, setError] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);

  // Booking form state
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/rooms/${id}`);
        if (res.data.success) {
          setRoom(res.data.room);
          setMainImage(res.data.room.images?.[0] || assets.placeholderImage);
          setError(null);
        } else {
          setError(res.data.message || 'Room not found');
        }
      } catch (err) {
        setError('Failed to load room details');
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id, axios]);

const handleCheckAvailability = async (e) => {
  e.preventDefault();
  
  if (!checkIn || !checkOut || guests < 1) {
    toast.error('Please fill all booking details correctly');
    return;
  }

  setCheckingAvailability(true);
  
  try {
    const token = await getToken();
    if (!token) {
      toast.error('You must be logged in to check availability');
      navigate('/login');
      return;
    }

    const res = await axios.post(
      '/api/bookings/check-availability',
      {
        roomId: room._id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guests,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.data.success && res.data.isAvailable) {
      toast.success('Room is available, you can proceed to book now.');
      setIsAvailable(true);
    } else if (res.data.success && !res.data.isAvailable) {
      toast.error('Room is not available for these dates.');
      setIsAvailable(false);
    } else {
      toast.error(res.data.message || 'Error checking availability.');
      setIsAvailable(false);
    }
  } catch (error) {
    console.error('Availability check error:', error);
    toast.error('An error occurred while checking availability.');
    setIsAvailable(false);
  } finally {
    setCheckingAvailability(false);
  }
};


 const handleBookingSubmit = async (e) => {
  e.preventDefault();
  if (!checkIn || !checkOut || guests < 1) {
    toast.error('Please fill all booking details correctly');
    return;
  }

  setBookingLoading(true);
  try {
    const token = await getToken();
    if (!token) {
      toast.error('You must be logged in to book');
      navigate('/login');
      return;
    }

    const bookingData = {
      room: room._id,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests,
    };

    const res = await axios.post(
      '/api/bookings/book',
      bookingData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.data.success) {
      
      toast.success('Booking successful!');
      navigate('/my-bookings');
    } else {
      toast.error(res.data.message || 'Booking failed');
    }
  } catch (error) {
    console.error('Booking error:', error);
    toast.error('An error occurred while booking');
  } finally {
    setBookingLoading(false);
  }
};
  if (loading) return <p className="pt-32 text-center">Loading room details...</p>;
  if (error) return <p className="pt-32 text-center text-red-600">{error}</p>;
  if (!room) return <p className="pt-32 text-center">Room not found.</p>;

  return (
    <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32 max-w-6xl mx-auto">
      <Title title={room.hotel?.name || 'Hotel'} subTitle={`Room: ${room.roomType || room.name}`} />

      {/* Main image */}
      <img
        src={mainImage}
        alt={`${room.roomType || 'Room'} image`}
        className="w-full max-h-96 object-cover rounded-lg shadow mb-6"
        onError={(e) => (e.currentTarget.src = assets.placeholderImage)}
      />

      {/* Thumbnails */}
      <div className="flex gap-4 mb-8 overflow-x-auto">
        {room.images?.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Thumbnail ${i + 1}`}
            onClick={() => setMainImage(img)}
            className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
              mainImage === img ? 'border-primary' : 'border-transparent'
            } hover:border-primary transition-all`}
            onError={(e) => (e.currentTarget.src = assets.placeholderImage)}
          />
        ))}
      </div>

      {/* Room Details */}
      <div className="mb-8">
        <p className="text-gray-700 mb-2">{room.hotel?.address || 'Address not available'}</p>
        <div className="flex items-center gap-2 mb-4">
          <StarRating rating={room.rating || 4} />
          <span className="text-gray-500">200+ reviews</span>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-3 mb-6">
          {room.amenities?.map((amenity, i) => (
            <span
              key={i}
              className="px-3 py-1.5 bg-[#F5F5FF]/70 rounded-lg text-xs text-gray-700"
            >
              {amenity}
            </span>
          ))}
        </div>

        <p className="text-xl font-semibold">
          Price: {currency} {room.price} / night
        </p>
      </div>

      {/* Booking Form */}
      <form
        onSubmit={isAvailable ? handleBookingSubmit : handleCheckAvailability}
        className="bg-white p-6 rounded-xl shadow-md max-w-lg mx-auto"
      >
        <h2 className="text-2xl mb-4 font-semibold text-gray-800">
          {isAvailable ? 'Complete Your Booking' : 'Check Availability'}
        </h2>

        <label className="block mb-4">
          <span className="block text-gray-700 font-medium mb-1">Check-In Date</span>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 outline-none"
            required
          />
        </label>

        <label className="block mb-4">
          <span className="block text-gray-700 font-medium mb-1">Check-Out Date</span>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 outline-none"
            required
          />
        </label>

        <label className="block mb-6">
          <span className="block text-gray-700 font-medium mb-1">Guests</span>
          <input
            type="number"
            min="1"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full border border-gray-300 rounded px-3 py-2 outline-none"
            required
          />
        </label>

        <button
          type="submit"
          disabled={bookingLoading || checkingAvailability}
          className={`w-full py-3 rounded bg-primary text-white font-semibold hover:bg-primary-dull transition ${
            (bookingLoading || checkingAvailability) ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {isAvailable
            ? bookingLoading
              ? 'Booking...'
              : 'Book Now'
            : checkingAvailability
            ? 'Checking...'
            : 'Check Availability'}
        </button>
      </form>
    </div>
  );
};

export default RoomDetails;
