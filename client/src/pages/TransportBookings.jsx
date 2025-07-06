import React, { useEffect, useState } from 'react'
import { useAppContext } from '@/context/AppContext'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import Title from '@/components/Title'

export default function TransportBookings() {
  const { axios, getToken } = useAppContext()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchBookings = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get('/api/transport-bookings/user', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setBookings(Array.isArray(data) ? data : [])
    } catch (error) {
      toast.error('Failed to load transport bookings')
    } finally {
      setLoading(false)
    }
  }

  // Cancel booking handler
  const cancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const token = await getToken()
      await axios.patch(`/api/transport-bookings/${bookingId}/cancel`, null, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Booking cancelled successfully')
      fetchBookings() // Refresh list after cancellation
    } catch (error) {
      toast.error('Failed to cancel booking')
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>
  if (bookings.length === 0) return <div className="text-center py-12 text-gray-500">No transport bookings found.</div>

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6 mt-15">
      <Title title="My Transport Bookings" />

      <table className="min-w-full border rounded">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 border">Transport Type</th>
            <th className="p-2 border">Destination</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Time</th>
            <th className="p-2 border">Seats Booked</th>
            <th className="p-2 border">Total Price</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr
              key={booking._id}
              className="hover:bg-gray-50 cursor-pointer"
              // Prevent row click when clicking buttons:
              onClick={(e) => {
                if (e.target.tagName !== 'BUTTON') {
                  navigate(`/transport/${booking.transport._id}`)
                }
              }}
            >
              <td className="p-2 border">{booking.transport.type}</td>
              <td className="p-2 border">{booking.transport.destination}</td>
              <td className="p-2 border">{new Date(booking.transport.date).toLocaleDateString()}</td>
              <td className="p-2 border">{booking.transport.time}</td>
              <td className="p-2 border">{booking.seats}</td>
              <td className="p-2 border">{booking.totalPrice} TND</td>
              <td className="p-2 border">{booking.status || 'Confirmed'}</td>
              <td className="p-2 border">
                {booking.status !== 'cancelled' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation() // Prevent row navigation
                      cancelBooking(booking._id)
                    }}
                    className="text-red-600 underline hover:text-red-800"
                  >
                    Cancel
                  </button>
                )}
                {booking.status === 'cancelled' && <span className="text-gray-500 italic">Cancelled</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
