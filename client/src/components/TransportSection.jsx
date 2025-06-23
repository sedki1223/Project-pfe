import React from 'react'
import Title from './Title'
import { transportData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const TransportSection = () => {
  const navigate = useNavigate()

  return (
    <div className="bg-white px-6 md:px-16 lg:px-24 xl:px-32 py-20 min-h-[600px] flex flex-col items-center">
      <Title
        title="Getting Around"
        subTitle="Explore transport options across Tunisia."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 w-full max-w-7xl">
        {transportData.slice(0, 3).map((mode) => (
          <div
            key={mode.id}
            onClick={() => navigate(`/transportation/${mode.id}`)}
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer overflow-hidden"
          >
            <img
              src={mode.image}
              alt={mode.type}
              className="w-full h-48 object-cover"
            />
            <div className="p-5 flex flex-col justify-between">
              <h3 className="font-playfair text-2xl font-semibold text-gray-900 mb-3">
                {mode.type}
              </h3>
              <p className="text-sm text-gray-700">
                {mode.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-20 w-full max-w-7xl">
        <button
          onClick={() => navigate('/transportation')}
          className="px-8 py-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold transition duration-300 shadow-lg"
        >
          See Transport Options
        </button>
      </div>
    </div>
  )
}

export default TransportSection