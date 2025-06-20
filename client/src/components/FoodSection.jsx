import React, { useEffect, useState } from 'react'
import Title from './Title'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const NO_IMAGE = 'https://via.placeholder.com/400x300?text=No+Image'

const FoodSection = () => {
  const navigate = useNavigate()
  const [dishes, setDishes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/dishes') // Adjust endpoint if needed
        setDishes(res.data.dishes || res.data) // safety fallback
      } catch (err) {
        console.error('Error fetching dishes:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDishes()
  }, [])

  const handleImageError = (e) => {
    e.target.src = NO_IMAGE
  }

  return (
    <div className="bg-white px-6 md:px-16 lg:px-24 xl:px-32 py-20 min-h-[600px] flex flex-col items-center">
      <Title
        title="🍲 Delicious Foods"
        subTitle="Discover local specialties and flavors."
      />

      {loading ? (
        <p className="text-center mt-12 text-gray-700">Loading food items...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 w-full max-w-7xl">
          {dishes.slice(0, 3).map((dish) => (
            <div
              key={dish._id}
              className="bg-white rounded-xl shadow-lg p-5 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300"
            >
              <img
                src={dish.images?.[0] || NO_IMAGE}
                alt={dish.name}
                onError={handleImageError}
                className="rounded-lg w-full h-48 object-cover mb-5"
              />
              <h3 className="font-playfair text-2xl font-semibold text-gray-900 mb-3">
                {dish.name}
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                {dish.description || dish.amenities?.join(', ')}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-20 w-full max-w-7xl">
        <button
          onClick={() => navigate('/food')}
          className="px-8 py-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold transition duration-300 shadow-lg"
        >
          Explore All Food
        </button>
      </div>
    </div>
  )
}

export default FoodSection
