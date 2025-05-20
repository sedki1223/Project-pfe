import React, { useState } from 'react'
import Title from '../components/Title'
import { assets, userBookingsDummyData } from '../assets/assets'

const MyBookings = () => {
  const [bookings, setBookings] = useState(userBookingsDummyData)

  return (
    <div className='py-28 md:pb-35 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-35'>
      <Title
        title='My Bookings'
        subTitle='Easily manage your past, current, and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks'
        align='left'
      />

      <div className='max-w-6xl mt-8 w-full text-gray-800'>
        <div className='hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3'>
          <div className='w-1/3'>Hotels</div>
          <div className='w-1/3'>Date & Timing</div>
          <div className='w-1/3'>Payment</div>
        </div>

        {bookings.map((booking) => (
          <div key={booking._id} className='border-b py-6'>
            {/* Booking Row */}
            <div className='flex flex-col md:flex-row md:items-stretch gap-6'>

              {/* Hotel Details */}
              <div className='flex flex-col md:flex-row md:w-1/3'>
                <img
                  src={booking.room.images[0]}
                  alt='hotel-img'
                  className='w-full md:w-40 h-28 object-cover rounded shadow'
                />
                <div className='flex flex-col gap-1.5 mt-3 md:mt-0 md:ml-4'>
                  <p className='font-playfair text-xl'>
                    {booking.hotel.name}
                    <span className='font-inter text-sm'> ({booking.room.roomType})</span>
                  </p>
                  <div className='flex items-center gap-1 text-sm text-gray-500'>
                    <img src={assets.locationIcon} alt='location-icon' />
                    <span>{booking.hotel.address}</span>
                  </div>
                  <div className='flex items-center gap-1 text-sm text-gray-500'>
                    <img src={assets.guestsIcon} alt='guests-icon' />
                    <span>{booking.guests}</span>
                  </div>
                  <p className='text-base'>Total: ${booking.totalPrice}</p>
                </div>
              </div>

              {/* Check-In / Check-Out */}
              <div className='flex flex-col gap-2 md:w-1/3 justify-center md:justify-center md:self-center h-full'>
                <div className='flex flex-col sm:flex-row sm:gap-4 text-sm text-gray-600'>
                  <p className='font-medium text-gray-800'>Check-In:</p>
                  <p>{new Date(booking.checkInDate).toDateString()}</p>
                </div>
                <div className='flex flex-col sm:flex-row sm:gap-4 text-sm text-gray-600'>
                  <p className='font-medium text-gray-800'>Check-Out:</p>
                  <p>{new Date(booking.checkOutDate).toDateString()}</p>
                </div>
              </div>

              {/* Payment Status */}
              <div className='flex flex-col gap-2 md:w-1/3 justify-center md:justify-center md:self-center h-full'>
                <div className='flex items-center gap-2 mt-2 md:mt-0'>
                  <div
                    className={`h-3 w-3 rounded-full ${
                      booking.isPaid ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  ></div>
                  <p
                    className={`text-sm ${
                      booking.isPaid ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {booking.isPaid ? 'Paid' : 'Unpaid'}
                  </p>
                </div>
                {!booking.isPaid && (
                  <button
                    className='px-4 py-1.5 mt-2 text-xs border border-gray-400 rounded-full 
                    hover:bg-gray-50 transition-all cursor-pointer w-max'
                  >
                    Pay Now
                  </button>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyBookings
