import React, { useEffect, useState } from 'react'
import Title from './Title'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '')

const NO_IMAGE = 'https://via.placeholder.com/400x300?text=No+Image'

const FeaturedDestination = () => {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/rooms`) // adjust endpoint if needed
        setRooms(res.data.rooms || res.data) // safety fallback
      } catch (err) {
        console.error('Error fetching rooms:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [])

  if (loading) {
    return (
      <div className="bg-white px-6 md:px-16 lg:px-24 py-20 min-h-[400px]">
        <Title
          title="🏨 Featured Hotels in Tozeur"
          subTitle="Handpicked stays that capture the spirit of the oasis. From kasbah-style resorts to cozy desert retreats."
        />
        <p className="text-center mt-12 text-gray-700">Loading hotels...</p>
      </div>
    )
  }

  if (rooms.length === 0) return null

  const handleImageError = (e) => {
    e.target.src = NO_IMAGE
  }

  return (
    <div className="bg-white flex flex-col items-center px-6 md:px-16 lg:px-24 py-20 min-h-[600px]">
      {/* Section Title */}
      <Title
        title="🏨 Featured Hotels in Tozeur"
        subTitle="Handpicked stays that capture the spirit of the oasis. From kasbah-style resorts to cozy desert retreats."
      />

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 w-full max-w-7xl">
        {rooms.slice(0, 3).map((room) => (
          <div
            key={room._id}
            className="bg-white rounded-xl shadow-lg p-5 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300"
          >
            {/* Image */}
            <img
              src={room.images?.[0] || NO_IMAGE}
              alt={room.name}
              onError={handleImageError}
              className="rounded-lg w-full h-48 object-cover mb-5"
            />

            {/* Room Name */}
            <h3 className="font-playfair text-2xl font-semibold text-gray-900 mb-3">
              {room.name}
            </h3>

            {/* Optional Description (if you have one, otherwise remove or add amenities or empty) */}
            {room.description && (
              <p className="text-sm text-gray-700 mb-3">{room.description}</p>
            )}

            {/* Price */}
            <p className="text-xs text-gray-500 mb-2">
              Price: <span className="font-semibold text-amber-700">${room.price.toFixed(2)}</span>
            </p>

            {/* Book Now Button */}
            <button
              onClick={() => {
                navigate(`/rooms/${room._id}`)
                window.scrollTo(0, 0)
              }}
              className="mt-3 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="flex justify-center mt-20 w-full max-w-7xl">
        <button
          onClick={() => {
            navigate('/rooms')
            window.scrollTo(0, 0)
          }}
          className="px-8 py-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold transition duration-300 shadow-lg"
        >
          View All Hotels
        </button>
      </div>
    </div>
  )
}

export default FeaturedDestination
