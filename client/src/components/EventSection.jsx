import React, { useEffect, useState } from 'react'
import Title from './Title'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'https://project-pfe-backend.vercel.app').replace(/\/$/, '')

const NO_IMAGE = 'https://via.placeholder.com/400x300?text=No+Image'

const EventSection = () => {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/events`)
        setEvents(res.data || []) // fallback to empty array
      } catch (err) {
        console.error('Error fetching events:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const handleImageError = (e) => {
    e.target.src = NO_IMAGE
  }

  return (
    <div className="bg-white px-6 md:px-16 lg:px-24 xl:px-32 py-20 min-h-[600px] flex flex-col items-center">
      <Title
        title="🎭 Events in Tozeur"
        subTitle="Immerse yourself in Tozeur’s vibrant cultural scene."
      />

      {loading ? (
        <p className="text-center mt-12 text-gray-700">Loading events...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 w-full max-w-7xl">
          {events.slice(0, 3).map((event) => {
            // Get first image from array or fallback
            const mainImage =
              Array.isArray(event.imageUrl) && event.imageUrl.length > 0
                ? event.imageUrl[0]
                : NO_IMAGE

            return (
              <div
                key={event._id}
                className="bg-white rounded-xl shadow-lg p-5 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300"
              >
                <img
                  src={mainImage}
                  alt={event.title}
                  onError={handleImageError}
                  className="rounded-lg w-full h-48 object-cover mb-5"
                />
                <h3 className="font-playfair text-2xl font-semibold text-gray-900 mb-3">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-700 mb-3">{event.description}</p>
                <p className="text-xs text-gray-500 mb-2">
                  {new Date(event.date).toLocaleDateString()} at {event.time}
                </p>
                <p className="text-lg font-semibold text-amber-700">
                  Price: ${event.price}
                </p>
              </div>
            )
          })}
        </div>
      )}

      <div className="flex justify-center mt-20 w-full max-w-7xl">
        <button
          onClick={() => navigate('/events')}
          className="px-8 py-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold transition duration-300 shadow-lg"
        >
          View All Events
        </button>
      </div>
    </div>
  )
}

export default EventSection
