import React, { useState } from 'react';
import { assets, cities } from '../assets/assets';
import { useAppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';

const HotelReg = () => {
  const { setShowHotelReg, axios, getToken, setIsOwner } = useAppContext();

  const [isHotel, setIsHotel] = useState(true);

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [cuisineType, setCuisineType] = useState('');

const onSubmitHandler = async (e) => {
  e.preventDefault();
  try {
    const { data } = await axios.post(
      '/api/restaurant/register',
      { name, contact, address, city },
      {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      }
    );

    console.log("🌐 Raw API response:", data);

    if (data.success) {
      toast.success(data.message);
      setIsOwner(true);
      setShowFoodReg(false);
    } else {
      console.warn("⚠️ Backend responded with failure:", data);
      toast.error(data.message || "Registration failed");
    }
  } catch (err) {
    console.error("❌ Registration Error:", err);
    console.log("❗ Error response:", err.response?.data);
    toast.error(err.response?.data?.message || err.message || "Registration failed");
  }
};
  return (
    <div
      onClick={() => setShowHotelReg(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-black/70"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex bg-white rounded-xl max-w-4xl max-md:mx-2"
      >
        <img
          src={assets.regImage}
          alt="reg-image"
          className="w-1/2 rounded-l-xl hidden md:block"
        />
        <div className="relative flex flex-col items-center md:w-1/2 p-8 md:p-10">
          <img
            src={assets.closeIcon}
            alt="close-icon"
            className="absolute top-4 right-4 h-4 w-4 cursor-pointer"
            onClick={() => setShowHotelReg(false)}
          />

          {/* Toggle Buttons */}
          <div className="flex space-x-4 mb-6">
            <button
              type="button"
              onClick={() => {
                setIsHotel(true);
                console.log('🏨 Switched to Hotel Registration');
              }}
              className={`px-4 py-2 rounded ${
                isHotel ? 'bg-indigo-600 text-white' : 'bg-gray-200'
              }`}
            >
              Promote Hotel
            </button>
            <button
              type="button"
              onClick={() => {
                setIsHotel(false);
                console.log('🍽️ Switched to Restaurant Registration');
              }}
              className={`px-4 py-2 rounded ${
                !isHotel ? 'bg-green-600 text-white' : 'bg-gray-200'
              }`}
            >
              Promote Restaurant
            </button>
          </div>

          <p className="text-2xl font-semibold mt-2 mb-6">
            {isHotel ? 'Register Your Hotel' : 'Register Your Restaurant'}
          </p>

          {/* Common Fields */}
          <div className="w-full mt-2">
            <label htmlFor="name" className="font-medium text-gray-500">
              {isHotel ? 'Hotel Name' : 'Restaurant Name'}
            </label>
            <input
              id="name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Type here"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
              required
            />
          </div>

          <div className="w-full mt-4">
            <label htmlFor="contact" className="font-medium text-gray-500">
              Phone
            </label>
            <input
              id="contact"
              onChange={(e) => setContact(e.target.value)}
              value={contact}
              type="text"
              placeholder="Type here"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
              required
            />
          </div>

          <div className="w-full mt-4">
            <label htmlFor="address" className="font-medium text-gray-500">
              Address
            </label>
            <input
              id="address"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              type="text"
              placeholder="Type here"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
              required
            />
          </div>

          <div className="w-full mt-4">
            <label htmlFor="city" className="font-medium text-gray-500">
              City
            </label>
            <select
              id="city"
              onChange={(e) => setCity(e.target.value)}
              value={city}
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light bg-white"
              required
            >
              <option value="" disabled>
                Select a city
              </option>
              {cities.map((c, idx) => (
                <option key={idx} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {!isHotel && (
            <div className="w-full mt-4">
              <label htmlFor="cuisineType" className="font-medium text-gray-500">
                Cuisine Type
              </label>
              <input
                id="cuisineType"
                onChange={(e) => setCuisineType(e.target.value)}
                value={cuisineType}
                type="text"
                placeholder="e.g. Italian, Chinese..."
                className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
                required={!isHotel}
              />
            </div>
          )}

          <button
            type="submit"
            className={`${
              isHotel ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-green-500 hover:bg-green-600'
            } transition-all text-white mr-auto px-6 py-2 rounded cursor-pointer mt-6`}
          >
            {isHotel ? 'Register' : 'Register'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelReg;
