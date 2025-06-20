import React, { useMemo, useState, useEffect } from 'react'
import { assets, facilityIcons } from '../assets/assets'
import { useSearchParams, useNavigate } from 'react-router-dom'
import StarRating from '../components/StarRating'
import axios from 'axios'

const CheckBox = ({ label, selected = false, onChange = () => {} }) => (
  <label className='flex gap-3 items-center cursor-pointer mt-2 text-sm'>
    <input
      type="checkbox"
      checked={selected}
      onChange={(e) => onChange(e.target.checked, label)}
    />
    <span className='font-light select-none'>{label}</span>
  </label>
)

const RadioButton = ({ label, selected = false, onChange = () => {} }) => (
  <label className='flex gap-3 items-center cursor-pointer mt-2 text-sm'>
    <input
      type="radio"
      name="sortOption"
      checked={selected}
      onChange={() => onChange(label)}
    />
    <span className='font-light select-none'>{label}</span>
  </label>
)

const AllRooms = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [openFilters, setOpenFilters] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState({
    roomType: [],
    priceRange: [],
  })
  const [selectedSortOption, setSelectedSortOption] = useState('')
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const navigate = useNavigate()
  const currency = '$'

  // Update these to match your real data or backend roomType values
  const roomTypes = ["Single Bed", "Double Bed", "Luxury Room", "Family suite"]
  const priceRanges = ["0 to 500", "500 to 1000", "1000 to 2000", "2000 to 3000"]
  const sortOptions = ["Price Low to High", "Price High to Low", "Newest First"]

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/rooms')
        setRooms(res.data.rooms || res.data)
      } catch (err) {
        console.error('Error fetching rooms:', err)
        setError('Failed to load rooms.')
      } finally {
        setLoading(false)
      }
    }
    fetchRooms()
  }, [])

  const handleFilterChange = (checked, value, type) => {
    setSelectedFilters((prev) => {
      const updated = { ...prev }
      if (checked) {
        if (!updated[type].includes(value)) updated[type].push(value)
      } else {
        updated[type] = updated[type].filter((item) => item !== value)
      }
      return updated
    })
  }

  const handleRoomTypeChange = (checked, value) => {
    handleFilterChange(checked, value, 'roomType')
  }

  const handlePriceRangeChange = (checked, value) => {
    handleFilterChange(checked, value, 'priceRange')
  }

  // Check if roomType filter matches; note your backend room may not have 'roomType' property
  const matchesRoomType = (room) => {
    // fallback if no roomType in room object, skip filtering by type
    if (!room.roomType) return true
    return selectedFilters.roomType.length === 0 || selectedFilters.roomType.includes(room.roomType)
  }

  const matchesPriceRange = (room) => {
    return selectedFilters.priceRange.length === 0 || selectedFilters.priceRange.some(range => {
      const [min, max] = range.split(' to ').map(Number)
      return room.price >= min && room.price <= max
    })
  }

  const sortRooms = (a, b) => {
    if (selectedSortOption === 'Price Low to High') return a.price - b.price
    if (selectedSortOption === 'Price High to Low') return b.price - a.price
    if (selectedSortOption === 'Newest First') return new Date(b.createdAt) - new Date(a.createdAt)
    return 0
  }

  const destination = searchParams.get('destination') || ''

  const filteredRooms = useMemo(() => {
    return rooms
      .filter(room =>
        matchesRoomType(room) &&
        matchesPriceRange(room) &&
        room.hotel?.address?.toLowerCase().includes(destination.toLowerCase())
      )
      .sort(sortRooms)
  }, [rooms, selectedFilters, selectedSortOption, destination])

  const clearFilters = () => {
    setSelectedFilters({ roomType: [], priceRange: [] })
    setSelectedSortOption('')
    setSearchParams({})
  }

  if (loading) return <p className="text-center mt-20">Loading rooms...</p>
  if (error) return <p className="text-center mt-20 text-red-600">{error}</p>

  return (
    <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32'>
      <div>
        <div className='flex flex-col items-start text-left'>
          <h1 className='font-playfair text-4xl md:text-[40px]'>Hotel Rooms</h1>
          <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-[700px]'>
            Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.
          </p>
        </div>

        {filteredRooms.length === 0 ? (
          <p className="mt-10 text-center text-gray-500">No rooms found matching your criteria.</p>
        ) : (
          filteredRooms.map((room) => (
            <div key={room._id} className='flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-32 last:border-0'>
              <img
                onClick={() => { navigate(`/rooms/${room._id}`); scrollTo(0, 0) }}
                src={room.images?.[0] || assets.placeholderImage}
                alt="hotel-img"
                title='View Room Details'
                className='max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer'
              />
              <div className='md:w-1/2 flex flex-col gap-2'>
                <p className='text-gray-500'>{room.hotel?.address || 'Unknown address'}</p>
                <p
                  onClick={() => { navigate(`/rooms/${room._id}`); scrollTo(0, 0) }}
                  className='text-gray-800 text-3xl font-playfair cursor-pointer'
                >
                  {room.hotel?.name || 'Unknown hotel'}
                </p>
                <div className='flex items-center'>
                  <StarRating />
                  <p className='ml-2'>200+ reviews</p>
                </div>
                <div className='flex items-center gap-1 text-gray-500 mt-2 text-sm'>
                  <img src={assets.locationIcon} alt="location-icon" />
                  <span>{room.hotel?.address || 'No address'}</span>
                </div>
                <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                  {Array.isArray(room.amenities) && room.amenities.map((item, index) => (
                    <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70'>
                      <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                      <p className='text-xs'>{item}</p>
                    </div>
                  ))}
                </div>
                <p className='text-xl font-medium text-gray-700'>{currency}{room.price} /night</p>
              </div>
            </div>
          ))
        )}
      </div>

      <aside className='bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 lg:mt-16'>
        <div className='flex items-center justify-between px-5 py-2.5 border-b border-gray-300'>
          <p className='text-base font-medium text-gray-800'>FILTERS</p>
          <div className='text-xs cursor-pointer'>
            <span onClick={() => setOpenFilters(!openFilters)} className='lg:hidden'>
              {openFilters ? 'HIDE' : 'SHOW'}
            </span>
            <span onClick={clearFilters} className='hidden lg:block'>CLEAR</span>
          </div>
        </div>

        <div className={`${openFilters ? 'h-auto' : 'h-0 lg:h-auto'} overflow-hidden transition-all duration-700`}>
          <div className='px-5 pt-5'>
            <p className='font-medium text-gray-800 pb-2'>Popular Filters</p>
            {roomTypes.map((roomType, index) => (
              <CheckBox
                key={index}
                label={roomType}
                selected={selectedFilters.roomType.includes(roomType)}
                onChange={(checked) => handleRoomTypeChange(checked, roomType)}
              />
            ))}
          </div>

          <div className='px-5 pt-5'>
            <p className='font-medium text-gray-800 pb-2'>Price Range</p>
            {priceRanges.map((range, index) => (
              <CheckBox
                key={index}
                label={range}
                selected={selectedFilters.priceRange.includes(range)}
                onChange={(checked) => handlePriceRangeChange(checked, range)}
              />
            ))}
          </div>

          <div className='px-5 pt-5 pb-7'>
            <p className='font-medium text-gray-800 pb-2'>Sort By</p>
            {sortOptions.map((option, index) => (
              <RadioButton
                key={index}
                label={option}
                selected={selectedSortOption === option}
                onChange={setSelectedSortOption}
              />
            ))}
          </div>
        </div>
      </aside>
    </div>
  )
}

export default AllRooms
