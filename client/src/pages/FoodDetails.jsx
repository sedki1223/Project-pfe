import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';  // Clerk auth hook
import { assets, dishesDummyData } from '../assets/assets'; // import your dummy data here

const DishDetails = () => {
  const { id } = useParams();
  const [dish, setDish] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();

  useEffect(() => {
    // Find dish by _id matching id from URL params
    const foundDish = dishesDummyData.find((item) => item._id === id);

    if (foundDish) {
      setDish({
        ...foundDish,
        images: foundDish.images && foundDish.images.length > 0 ? foundDish.images : [],
        chef: {
          name: 'Chef Amira',
          image: '',
        },
        reviews: Math.floor(Math.random() * 100),
      });

      setMainImage(foundDish.images && foundDish.images.length > 0 ? foundDish.images[0] : '');
    }
  }, [id]);

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!dish) return;

    setLoading(true);

    try {
      const token = await getToken({ template: 'your-template-name' }); // replace if needed

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

  if (!dish) return <div className='pt-32 text-center text-xl'>Dish not found.</div>;

  return (
    <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        {/* Main Image */}
        <img
          src={mainImage}
          alt={dish.name}
          className="w-full max-h-96 object-cover rounded-lg mb-6"
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
            />
          ))}
        </div>

        {/* Dish Info */}
        <h1 className="text-3xl font-bold mb-2">{dish.name}</h1>
        <p className="text-gray-700 mb-4">{dish.description}</p>

        <div className="flex items-center mb-4">
          <StarRating rating={4} /> {/* Hardcoded for demo */}
          <span className="ml-2 text-sm text-gray-500">{dish.reviews} reviews</span>
        </div>

        <p className="text-lg font-semibold mb-4">
          Price: ${dish.pricePerServing} per serving
        </p>

        {/* Ingredients */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Ingredients:</h3>
          <ul className="list-disc list-inside text-gray-600">
            {dish.ingredients.map((ing, idx) => (
              <li key={idx}>{ing}</li>
            ))}
          </ul>
        </div>

        {/* Restaurant Info */}
        <div className="mb-6">
          <h3 className="font-semibold">Restaurant:</h3>
          <p>{dish.restaurant?.name || 'Unknown Restaurant'}</p>
          <p>{dish.restaurant?.address || 'Address not available'}</p>
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
