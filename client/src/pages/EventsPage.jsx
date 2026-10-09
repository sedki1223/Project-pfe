import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import {
  FaMapMarkerAlt,
  FaTags,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaSearch,
  FaThList,
  FaPlus,
} from 'react-icons/fa'

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '')

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

const NO_IMAGE = 'https://via.placeholder.com/400x300?text=No+Image' // fallback image URL

const EVENTS_PER_PAGE = 6

const EventsPage = () => {
  const navigate = useNavigate()

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [priceFilter, setPriceFilter] = useState('all')

  const [currentPage, setCurrentPage] = useState(1)

  // Debounce search term input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setCurrentPage(1) // reset page on search change
    }, 500) // 500ms debounce

    return () => clearTimeout(handler)
  }, [searchTerm])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/events`)
        // Map MongoDB _id to id
        const eventsWithId = res.data.map((e) => ({ ...e, id: e._id || e.id }))
        setEvents(eventsWithId)
        setLoading(false)
      } catch (err) {
        setError('Failed to load events.')
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const categories = useMemo(() => {
    const setCategories = new Set(events.map((e) => e.type))
    return Array.from(setCategories)
  }, [events])

  const filteredByCategory = useMemo(() => {
    if (activeTab === 'all') return events
    return events.filter((e) => e.type === activeTab)
  }, [activeTab, events])

  const filteredBySearchAndPrice = filteredByCategory.filter((e) => {
    const search = debouncedSearchTerm.toLowerCase()
    const name = String(e.title ?? '').toLowerCase()
    const location = String(e.location ?? '').toLowerCase()
    const price = String(e.price ?? '').toLowerCase()

    const matchesSearch = name.includes(search) || location.includes(search)

    const matchesPrice =
      priceFilter === 'all' ||
      (priceFilter === 'free' && price === 'free') ||
      (priceFilter === 'paid' && price !== 'free')

    return matchesSearch && matchesPrice
  })

  // Pagination
  const totalPages = Math.ceil(filteredBySearchAndPrice.length / EVENTS_PER_PAGE)

  const paginatedEvents = filteredBySearchAndPrice.slice(
    (currentPage - 1) * EVENTS_PER_PAGE,
    currentPage * EVENTS_PER_PAGE
  )

  const handleImageError = (e) => {
    e.target.src = NO_IMAGE
  }

  if (loading) return <p className="text-center mt-10">Loading events...</p>
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>

  return (
    <div className="pt-20 px-4 md:px-6 lg:px-10 container mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-center flex-1">Explore Events in Tozeur</h1>
      </div>

      {/* Category Tabs */}
      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded ${
            activeTab === 'all' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          title="All Events"
          aria-pressed={activeTab === 'all'}
        >
          <FaThList /> All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              activeTab === category ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            title={`Filter by ${category}`}
            aria-pressed={activeTab === category}
          >
            <FaTags /> {category}
          </button>
        ))}
      </div>

      {/* Search and Price Filters */}
      <div className="flex flex-col md:flex-row md:justify-between items-center mb-8 gap-4 max-w-3xl mx-auto">
        <div className="flex items-center w-full md:w-2/3 border rounded px-3 py-2 shadow-sm">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search by name or location..."
            className="w-full outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search events"
          />
        </div>

        <select
          className="w-full md:w-1/3 border rounded px-3 py-2 shadow-sm"
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          aria-label="Filter by price"
        >
          <option value="all">All Prices</option>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {/* Events Grid */}
      {paginatedEvents.length === 0 ? (
        <p className="text-center text-gray-600">No events match your filters.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedEvents.map((event) => {
            let imgSrc = NO_IMAGE

            if (Array.isArray(event.imageUrl) && event.imageUrl.length > 0) {
              imgSrc = event.imageUrl[0]
            } else if (Array.isArray(event.images) && event.images.length > 0) {
              imgSrc = event.images[0]
            } else if (typeof event.image === 'string' && event.image.trim() !== '') {
              imgSrc = event.image
            }

            return (
              <Link
                to={`/events/${event.id}`}
                key={event.id}
                className="block rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white"
                title={event.title}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={imgSrc}
                    alt={event.title}
                    onError={handleImageError}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    <p className="text-xs">{formatDate(event.date)}</p>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaTags /> <span>{event.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaMapMarkerAlt /> <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaMoneyBillWave /> <span>{event.price}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-4 py-2 bg-teal-600 text-white rounded disabled:opacity-50"
            aria-label="Previous page"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="px-4 py-2 bg-teal-600 text-white rounded disabled:opacity-50"
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default EventsPage
