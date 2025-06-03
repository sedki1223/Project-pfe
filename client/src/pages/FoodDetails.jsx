import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';
import FoodData from '../data/FoodData';
import { useAuth } from '@clerk/clerk-react';  // assuming Clerk for auth

const DishDetails = () => {
  const { id } = useParams();
  const [dish, setDish] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth(); // Clerk hook to get auth token

  useEffect(() => {
    const foundDish = FoodData.find((item) => item.id.toString() === id);
    if (foundDish) {
      setDish({
        ...foundDish,
        images: foundDish.images && foundDish.images.length > 0 ? foundDish.images : [foundDish.img],
        chef: {
          name: 'Chef Amira',
          image: foundDish.chefImage || '',
        },
        restaurant: {
          name: 'Tozeur Gourmet Kitchen',
          address: '45 Palm Oasis Rd, Tozeur',
        },
        ingredients: ['Fresh Tomatoes', 'Organic Basil', 'Olive Oil'],
        reviews: Math.floor(foundDish.rating * 30),
      });
      setMainImage(foundDish.images && foundDish.images.length > 0 ? foundDish.images[0] : foundDish.img);
    }
  }, [id]);

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!dish) return;

    setLoading(true);

    try {
      // Get auth token for protected backend routes
      const token = await getToken({ template: 'your-template-name' }); // replace with your Clerk template if needed

      const response = await fetch('/api/food-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          foodId: dish.id,
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
      {/* ... rest of your component ... */}

      {/* Order Form */}
      <form onSubmit={handleOrder} className='flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl'>
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

      {/* ... rest of your component ... */}
    </div>
  );
};

export default DishDetails;
