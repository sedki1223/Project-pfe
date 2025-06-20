import React from 'react'
import Title from './Title'
import { testimonials } from '../assets/assets'
import StarRating from './StarRating'

const Testimonial = () => {
  return (
    <div className="bg-white py-20 px-6 md:px-16 lg:px-24 xl:px-32 min-h-[600px] flex flex-col items-center">
      {/* Title */}
      <Title
        title="✨ What Our Guests Say"
        subTitle="Discover why discerning travelers consistently choose VisitTozeur for their exclusive and luxurious accommodations around our stunning oasis city."
      />

      {/* Testimonials */}
      <div className="flex flex-wrap justify-center gap-8 mt-16 max-w-7xl w-full">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full sm:w-[320px] hover:shadow-2xl transition-shadow duration-300"
          >
            {/* User Info */}
            <div className="flex items-center gap-4">
              <img
                className="w-12 h-12 rounded-full object-cover"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <p className="font-playfair text-lg font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.location}</p>
              </div>
            </div>

            {/* Star Rating */}
            <div className="flex items-center gap-1 mt-4">
              <StarRating rating={testimonial.rating} />
            </div>

            {/* Review */}
            <p className="text-gray-700 text-sm mt-4 leading-relaxed">
              "{testimonial.review}"
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Testimonial
