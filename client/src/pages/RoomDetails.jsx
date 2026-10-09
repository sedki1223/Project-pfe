import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { assets, facilityIcons, roomCommonData } from '../assets/assets'
import StarRating from '../components/StarRating'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '')

const RoomDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getToken } = useAuth()

  const [room, setRoom] = useState(null)
  const [mainImage, setMainImage] = useState(null)
  const [loading, setLoading] = useState(true)

  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')
  const [guests, setGuests] = useState(1)
  const [isAvailable, setIsAvailable] = useState(false)

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const token = await getToken()
        const res = await axios.get(`${API_BASE_URL}/api/rooms/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setRoom(res.data.room)
        setMainImage(res.data.room.images[0])
      } catch (err) {
        if (err.response?.status === 401) {
          toast.error('Unauthorized. Please login again.')
          navigate('/login')
        } else {
          toast.error('Room not found or error occurred.')
          navigate('/')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchRoom()
  }, [id, navigate, getToken])
  const checkRoomAvailability = (e) => {
    e.preventDefault()
    if (!checkInDate || !checkOutDate) {
      toast.error('Please select check-in and check-out dates.')
      return
    }
    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      toast.error('Check-out date must be after check-in date.')
      return
    }
    setIsAvailable(true)
    toast.success('Room is available!')
  }

  const onSubmitHandler = (e) => {
    e.preventDefault()
    if (!isAvailable) {
      return checkRoomAvailability(e)
    }
    toast.success('Room booked successfully!')
    navigate('/my-bookings')
  }

  if (loading) return <div className="min-h-screen flex justify-center items-center">Loading...</div>
  if (!room) return null

  return (
    <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
        <h1 className="text-3xl md:text-4xl font-playfair">
          {room.hotel?.name} <span className="font-inter text-sm">{room.roomType}</span>
        </h1>
        <p className="text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full">20% OFF</p>
      </div>

      <div className="flex items-center gap-1 mt-2">
        <StarRating />
        <p className="ml-2">200+ reviews</p>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <img src={assets.locationIcon} alt="location-icon" />
        <span>{room.hotel?.address}</span>
      </div>

      <div className="flex flex-col lg:flex-row mt-6 gap-6">
        <div className="lg:w-1/2 w-full">
          <img
            src={mainImage || assets.placeholderImage}
            alt="Room"
            className="w-full rounded-xl shadow-lg object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
          {room.images.slice(1).map((img, i) => (
            <img
              key={i}
              src={img}
              alt="Room"
              className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${
                mainImage === img ? 'outline outline-2 outline-orange-500' : ''
              }`}
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between mt-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-playfair">Experience Luxury Like Never Before</h1>
          <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
            {room.amenities.map((amenity, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100"
              >
                <img src={facilityIcons[amenity] || assets.placeholderIcon} alt={amenity} className="w-5 h-5" />
                <p className="text-xs">{amenity}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-2xl font-medium">${room.price}/night</p>
      </div>

      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col md:flex-row flex-wrap items-start md:items-center justify-between bg-white shadow-lg p-6 rounded-xl max-w-6xl mx-auto mt-16"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500">
          <div className="flex flex-col">
            <label htmlFor="checkInDate" className="font-medium">Check-In</label>
            <input
              type="date"
              id="checkInDate"
              min={new Date().toISOString().split('T')[0]}
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
              required
            />
          </div>

          <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>

          <div className="flex flex-col">
            <label htmlFor="checkOutDate" className="font-medium">Check-Out</label>
            <input
              type="date"
              id="checkOutDate"
              min={checkInDate}
              value={checkOutDate}
              disabled={!checkInDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
              required
            />
          </div>

          <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>

          <div className="flex flex-col">
            <label htmlFor="guests" className="font-medium">Guests</label>
            <input
              type="number"
              id="guests"
              min="1"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-25 py-3 md:py-4 text-base cursor-pointer"
        >
          {isAvailable ? 'Book Now' : 'Check Availability'}
        </button>
      </form>

      <div className="mt-25 space-y-4">
        {roomCommonData.map((spec, i) => (
          <div key={i} className="flex items-start gap-2">
            <img src={spec.icon} alt={`${spec.title}-icon`} className="w-6.5" />
            <div>
              <p className="text-base">{spec.title}</p>
              <p className="text-gray-500">{spec.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500">
        <p>description for the room</p>
      </div>

      <div className="flex flex-col items-start gap-4">
        <div className="flex gap-4">
          <img
            src={room.hotel?.owner?.image || assets.userPlaceholder}
            alt="Host"
            className="h-14 w-14 md:h-18 md:w-18 rounded-full object-cover"
          />
          <div>
            <p className="text-lg md:text-xl">Hosted By {room.hotel?.name}</p>
            <div className="flex items-center mt-1">
              <StarRating />
              <p className="ml-2">+200 reviews</p>
            </div>
          </div>
        </div>
        <button className="px-6 py-2.5 mt-4 rounded text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer">
          Contact Now
        </button>
      </div>
    </div>
  )
}

export default RoomDetails
