import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { useAppContext } from '@/context/AppContext'
import toast from 'react-hot-toast'

const MyBookings = () => {
  const { getToken, navigate, axios } = useAppContext()
  const [bookings, setBookings] = useState([])

  const fetchUserBookings = async () => {
    try {
      const token = await getToken()
      if (!token) {
        navigate('/login')
        return
      }
      const { data } = await axios.get('/api/bookings/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (data.success) {
        setBookings(data.bookings)
      } else {
        console.error('Failed to fetch bookings:', data.message)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return

    try {
      const token = await getToken()
      const { data } = await axios.patch(
        `/api/bookings/${bookingId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success('Booking cancelled successfully')
        setBookings(prev =>
          prev.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b)
        )
      } else {
        toast.error(data.message || 'Failed to cancel booking')
      }
    } catch (error) {
      console.error('Error cancelling booking:', error)
      toast.error(error.response?.data?.error || 'Error cancelling booking')
    }
  }

  useEffect(() => {
    fetchUserBookings()
  }, [])

  return (
    <div className="py-28 md:pb-35 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-35">
      <Title
        title="My Bookings"
        subTitle="Easily manage your past, current, and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks"
        align="left"
      />

      <div className="max-w-6xl mt-8 w-full text-gray-800">
        <div className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3">
          <div>Hotels</div>
          <div>Date & Timing</div>
          <div>Payment</div>
        </div>

        {bookings.length === 0 ? (
          <p className="text-center py-10 text-gray-600">You have no bookings yet.</p>
        ) : (
          bookings.map((booking) => {
            const isWithin24Hours =
              new Date(booking.checkIn) - new Date() <= 24 * 60 * 60 * 1000

            return (
              <div
                key={booking._id}
                className={`border-b py-6 transition-opacity duration-300 ${
                  booking.status === 'cancelled' ? 'opacity-50' : 'opacity-100'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-stretch gap-6">
                  {/* Hotel Details */}
                  <div className="flex flex-col md:flex-row md:w-1/3">
                    <img
                      src={booking.room?.images?.[0] || assets.placeholderImage}
                      alt="hotel-img"
                      className="w-full md:w-40 h-28 object-cover rounded shadow"
                    />
                    <div className="flex flex-col gap-1.5 mt-3 md:mt-0 md:ml-4">
                      <p className="font-playfair text-xl">
                        {booking.hotel?.name || 'Hotel name'}
                        <span className="font-inter text-sm">
                          {' '}
                          ({booking.room?.roomType || booking.room?.name || 'Room type'})
                        </span>
                      </p>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <img src={assets.locationIcon} alt="location-icon" />
                        <span>{booking.hotel?.address || 'Hotel address'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <img src={assets.guestsIcon} alt="guests-icon" />
                        <span>{booking.guests}</span>
                      </div>
                      <p className="text-base">Total: ${booking.totalPrice}</p>
                    </div>
                  </div>

                  {/* Check-In / Check-Out */}
                  <div className="flex flex-col gap-2 md:w-1/3 justify-center md:justify-center md:self-center h-full">
                    <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-gray-600">
                      <p className="font-medium text-gray-800">Check-In:</p>
                      <p>{new Date(booking.checkIn).toDateString()}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-gray-600">
                      <p className="font-medium text-gray-800">Check-Out:</p>
                      <p>{new Date(booking.checkOut).toDateString()}</p>
                    </div>
                  </div>

                  {/* Payment and Actions */}
                  <div className="flex flex-col gap-2 md:w-1/3 justify-center md:justify-center md:self-center h-full">
                    <div className="flex items-center gap-2 mt-2 md:mt-0">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          booking.status === 'cancelled'
                            ? 'bg-gray-400'
                            : booking.isPaid
                            ? 'bg-green-500'
                            : 'bg-red-500'
                        }`}
                      ></div>
                      <p
                        className={`text-sm ${
                          booking.status === 'cancelled'
                            ? 'text-gray-400'
                            : booking.isPaid
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}
                      >
                        {booking.status === 'cancelled'
                          ? 'Cancelled'
                          : booking.isPaid
                          ? 'Paid'
                          : 'Unpaid'}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-wrap mt-2">
                      {!booking.isPaid && booking.status !== 'cancelled' && (
                        <button
                          className="px-4 py-1.5 text-xs border border-gray-400 rounded-full 
                      hover:bg-gray-50 transition-all cursor-pointer w-max"
                          onClick={() => alert('Implement payment flow')}
                        >
                          Pay Now
                        </button>
                      )}
                      {booking.status !== 'cancelled' && !isWithin24Hours && (
                        <button
                          className="px-4 py-1.5 text-xs border border-red-400 text-red-500 rounded-full 
                        hover:bg-red-50 transition-all cursor-pointer w-max"
                          onClick={() => handleCancelBooking(booking._id)}
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default MyBookings
