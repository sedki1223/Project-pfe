import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import { assets } from '../assets/assets';

const DishDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [dish, setDish] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDish = async () => {
      setFetching(true);
      try {
        const res = await fetch(`/api/dishes/${id}`);
        const data = await res.json();

        if (res.ok && data.success) {
          const dishData = data.dish;
          setDish({
            ...dishData,
            images: dishData.images && dishData.images.length > 0 ? dishData.images : [],
            amenities: dishData.amenities || [], // ingredients
            restaurant: dishData.restaurant || {},
            rating: dishData.rating || 4,
            reviews: Math.floor(Math.random() * 100), // mock reviews count
          });
          setMainImage(dishData.images?.[0] || '');
          setError(null);
        } else {
          setError(data.message || 'Dish not found');
          setDish(null);
        }
      } catch (err) {
        setError('Failed to load dish details');
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
    if (quantity < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }

    setLoading(true);

    try {
      const token = await getToken();
      if (!token) {
        toast.error('Please login to place an order');
        navigate('/login');
        return;
      }

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

  if (fetching) return <div className="pt-32 text-center text-xl">Loading dish details...</div>;
  if (error) return <div className="pt-32 text-center text-red-600">{error}</div>;
  if (!dish) return <div className="pt-32 text-center text-xl">Dish not found.</div>;

  return (
    <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32 max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
      {/* Main Image */}
      <img
        src={mainImage || assets.defaultFoodImage}
        alt={dish.name}
        className="w-full max-h-96 object-cover rounded-lg mb-6"
        onError={(e) => (e.currentTarget.src = assets.defaultFoodImage)}
      />

      {/* Thumbnails */}
      <div className="flex gap-4 mb-8 overflow-x-auto">
        {dish.images.slice(0, 4).map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`${dish.name} image ${idx + 1}`}
            onClick={() => setMainImage(img)}
            className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
              mainImage === img ? 'border-primary' : 'border-transparent'
            } hover:border-primary transition-all`}
            onError={(e) => (e.currentTarget.src = assets.defaultFoodImage)}
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

      <p className="text-lg font-semibold mb-4">Price: ${dish.price.toFixed(2)} per serving</p>

      {/* Ingredients */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Ingredients:</h3>
        <ul className="list-disc list-inside text-gray-600">
          {dish.amenities.map((ingredient, idx) => (
            <li key={idx}>{ingredient}</li>
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
      <form onSubmit={handleOrder} className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-6 rounded-xl shadow-md max-w-lg mx-auto mt-16">
        <div className="flex flex-col gap-4 w-full md:w-auto md:flex-row md:items-center text-gray-500">
          <div className="flex flex-col">
            <label htmlFor="quantity" className="font-medium mb-1">Quantity</label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="max-w-20 rounded border border-gray-300 px-3 py-2 outline-none"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md md:px-10 py-3 md:py-4 text-base cursor-pointer mt-6 md:mt-0 w-full md:w-auto ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Ordering...' : 'Order Now'}
        </button>
      </form>
    </div>
  );
};

export default DishDetails;
