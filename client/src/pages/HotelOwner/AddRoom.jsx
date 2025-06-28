import React, { useState } from 'react';
import Title from '../../components/Title';
import { assets } from '../../assets/assets';
import { useAppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';

const AddRoom = () => {
  const { axios, getToken } = useAppContext();

  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  });

  const [inputs, setInputs] = useState({
    name: '',
    capacity: '',
    roomType: '',
    pricePerNight: '',
    amenities: {
      'Free Wifi': false,
      'Free Breakfast': false,
      'Free Service': false,
      'Mountain view': false,
      'Pool Access': false,
    },
  });

  const [loading, setLoading] = useState(false);

const onSubmitHandler = async (e) => {
  e.preventDefault();

  if (
    !inputs.name.trim() ||
    !inputs.capacity ||
    !inputs.pricePerNight ||
    !Object.values(images).some((image) => image)
  ) {
    toast.error('Please fill all the fields and upload images');
    return;
  }

  const capacityNum = Number(inputs.capacity);
  const priceNum = Number(inputs.pricePerNight);

  if (isNaN(capacityNum) || isNaN(priceNum)) {
    toast.error('Capacity and Price must be valid numbers');
    return;
  }

  setLoading(true);
  try {
const capacityNum = Number(inputs.capacity);
const priceNum = Number(inputs.pricePerNight);

const formData = new FormData();
formData.append('name', inputs.name.trim());
formData.append('capacity', capacityNum);
formData.append('price', priceNum);
formData.append('roomType', inputs.roomType);
    const amenities = Object.keys(inputs.amenities).filter(
      (key) => inputs.amenities[key]
    );
    formData.append('amenities', JSON.stringify(amenities));

    Object.keys(images).forEach((key) => {
      if (images[key]) formData.append('images', images[key]);
    });

    const { data } = await axios.post('/api/rooms/create', formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
       maxRedirects: 0,
    });

    if (data.success) {
      toast.success(data.message);
      setInputs({
        name: '',
        capacity: '',
        roomType: '',
        pricePerNight: '',
        amenities: {
          'Free Wifi': false,
          'Free Breakfast': false,
          'Free Service': false,
          'Mountain view': false,
          'Pool Access': false,
        },
      });
      setImages({
        1: null,
        2: null,
        3: null,
        4: null,
      });
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error(error);
    toast.error('Failed to add room');
  } finally {
    setLoading(false);
  }
};


  return (
    <form onSubmit={onSubmitHandler}>
      <Title align="left" font="outfit" title="Add Room" subTitle="fill in the details" />

      {/* Upload Area For Images */}
      <p className="text-gray-800 mt-10">Images</p>
      <div className="grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap">
        {Object.keys(images).map((key) => (
          <label htmlFor={`roomImages${key}`} key={key}>
            <img
              className="max-h-13 cursor-pointer opacity-80"
              src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea}
              alt=""
            />
            <input
              type="file"
              accept="image/*"
              id={`roomImages${key}`}
              hidden
              onChange={(e) => setImages({ ...images, [key]: e.target.files[0] })}
            />
          </label>
        ))}
      </div>

      {/* Name input */}
      <p className="text-gray-800 mt-4">Room Name</p>
      <input
        type="text"
        placeholder="Room Name"
        value={inputs.name}
        onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
        className="border border-gray-300 mt-1 rounded p-2 w-full max-w-sm"
      />

      {/* Capacity input */}
      <p className="text-gray-800 mt-4">Capacity</p>
      <input
        type="number"
        placeholder="Capacity"
        value={inputs.capacity}
        onChange={(e) => setInputs({ ...inputs, capacity: e.target.value })}
        className="border border-gray-300 mt-1 rounded p-2 w-24"
      />

      <div className="w-full flex max-sm:flex-col sm:gap-4 mt-4">
        <div className="flex-1 max-w-48">
          <p className="text-gray-800 mt-4">Room Type</p>
          <select
            value={inputs.roomType}
            onChange={(e) => setInputs({ ...inputs, roomType: e.target.value })}
            className="border opacity-70 border-gray-300 mt-1 rounded p-2 w-full"
          >
            <option value="">Select Room Type</option>
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
            <option value="Luxury Room">Luxury Room</option>
            <option value="Family Suite">Family Suite</option>
          </select>
        </div>

        <div>
          <p className="mt-4 text-gray-800">
            Price <span className="text-xs">/night</span>
          </p>
          <input
            type="number"
            placeholder="0"
            className="border border-gray-300 mt-1 rounded p-2 w-24"
            value={inputs.pricePerNight}
            onChange={(e) => setInputs({ ...inputs, pricePerNight: e.target.value })}
          />
        </div>
      </div>

      <p className="text-gray-800 mt-4">Amenities</p>
      <div className="flex flex-col flex-wrap mt-1 text-gray-400 max-w-sm">
        {Object.keys(inputs.amenities).map((amenity, index) => (
          <div key={index}>
            <input
              type="checkbox"
              id={`amenities${index + 1}`}
              checked={inputs.amenities[amenity]}
              onChange={() =>
                setInputs({
                  ...inputs,
                  amenities: {
                    ...inputs.amenities,
                    [amenity]: !inputs.amenities[amenity],
                  },
                })
              }
            />
            <label htmlFor={`amenities${index + 1}`}> {amenity}</label>
          </div>
        ))}
      </div>

      <button
        className="bg-blue-600 text-white px-8 py-2 rounded mt-8 cursor-pointer hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Adding Room...' : 'Add Room'}
      </button>
    </form>
  );
};

export default AddRoom;
