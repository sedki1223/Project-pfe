import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';  // Clerk auth hook
import { assets } from '../assets/assets';

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '')

const DishDetails = () => {
  const { id } = useParams();
  const [dish, setDish] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const { getToken } = useAuth();

  useEffect(() => {
    const fetchDish = async () => {
      try {
        setFetching(true);
        const res = await fetch(`${API_BASE_URL}/api/dishes/${id}`);
        const data = await res.json();

        if (res.ok && data.success) {
          const dishData = data.dish;

          setDish({
            ...dishData,
            images: dishData.images && dishData.images.length > 0 ? dishData.images : [],
            amenities: dishData.amenities || [], // amenities = ingredients
            restaurant: dishData.restaurant || {},
            rating: dishData.rating || 4, // fallback rating if any
            reviews: Math.floor(Math.random() * 100), // mock reviews count
          });

          setMainImage(dishData.images && dishData.images.length > 0 ? dishData.images[0] : '');
        } else {
          setDish(null);
        }
      } catch (error) {
        console.error('Fetch dish error:', error);
        setDish(null);
      } finally {
        setFetching(false);
      }
    };

    fetchDish();
  }, [id]);

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!dish) return;

    setLoading(true);

    try {
      const token = await getToken({ template: 'your-template-name' }); // adjust your template if needed

      const response = await fetch('/api/food-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          foodId: dish._id,
          quantity: Number(quantity),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Order placed successfully!');
      } else {
        toast.error(data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className='pt-32 text-center text-xl'>Loading dish details...</div>;
  if (!dish) return <div className='pt-32 text-center text-xl'>Dish not found.</div>;

  return (
    <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        {/* Main Image */}
        <img
          src={mainImage || assets.defaultFoodImage}
          alt={dish.name}
          className="w-full max-h-96 object-cover rounded-lg mb-6"
          onError={(e) => {
            e.currentTarget.src = assets.defaultFoodImage;
          }}
        />

        {/* Thumbnails */}
        <div className="flex gap-4 mb-8">
          {dish.images.slice(0, 4).map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${dish.name} image ${index + 1}`}
              onClick={() => setMainImage(img)}
              className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                mainImage === img ? 'border-primary' : 'border-transparent'
              } hover:border-primary transition-all`}
              onError={(e) => {
                e.currentTarget.src = assets.defaultFoodImage;
              }}
            />
          ))}
        </div>

        {/* Dish Info */}
        <h1 className="text-3xl font-bold mb-2">{dish.name}</h1>
        <p className="text-gray-700 mb-4">{dish.description}</p>

        <div className="flex items-center mb-4">
          <StarRating rating={dish.rating} />
          <span className="ml-2 text-sm text-gray-500">{dish.reviews} reviews</span>
        </div>

        <p className="text-lg font-semibold mb-4">
          Price: ${dish.price.toFixed(2)} per serving
        </p>

        {/* Ingredients */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Ingredients:</h3>
          <ul className="list-disc list-inside text-gray-600">
            {dish.amenities.map((ing, idx) => (
              <li key={idx}>{ing}</li>
            ))}
          </ul>
        </div>

        {/* Restaurant Info */}
        <div className="mb-6">
          <h3 className="font-semibold">Restaurant:</h3>
          <p>{dish.restaurant.name || 'Unknown Restaurant'}</p>
          <p>{dish.restaurant.address || 'Address not available'}</p>
        </div>

        {/* Order Form */}
        <form
          onSubmit={handleOrder}
          className='flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl'
        >
          <div className='flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500'>
            <div className='flex flex-col'>
              <label htmlFor="quantity" className='font-medium'>Quantity</label>
              <input
                onChange={(e) => setQuantity(e.target.value)}
                value={quantity}
                type="number"
                id='quantity'
                placeholder='1'
                min='1'
                className='max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none'
                required
              />
            </div>
          </div>
          <button
            type='submit'
            disabled={loading}
            className={`bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-25 py-3 md:py-4 text-base cursor-pointer ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Ordering...' : 'Order Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DishDetails;
