import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';
import FoodData from '../data/FoodData';

const DishDetails = () => {
  const { id } = useParams();
  const [dish, setDish] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const foundDish = FoodData.find((item) => item.id.toString() === id);
    if (foundDish) {
      setDish({
        ...foundDish,
        images: foundDish.images && foundDish.images.length > 0 ? foundDish.images : [foundDish.img],
        chef: {
          name: 'Chef Amira',
          image: foundDish.chefImage || '', // if you added chefImage to FoodData, else keep empty or fallback
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

  const handleOrder = (e) => {
    e.preventDefault();
    toast.success('Order placed successfully!');
  };

  if (!dish) return <div className='pt-32 text-center text-xl'>Dish not found.</div>;

  return (
    <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>
      {/* Dish Title */}
      <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
        <h1 className='text-3xl md:text-4xl font-playfair'>{dish.name}</h1>
        <p className='text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full'>Bestseller</p>
      </div>

      {/* Dish Rating */}
      <div className='flex items-center gap-1 mt-2'>
        <StarRating rating={dish.rating} />
        <p className='ml-2'>{dish.reviews}+ reviews</p>
      </div>

      {/* Dish Location */}
      <div className='flex items-center gap-2 mt-2'>
        {/* replace with your location icon or text */}
        <span>{dish.restaurant.address}</span>
      </div>

      {/* Dish Images */}
      <div className='flex flex-col lg:flex-row mt-6 gap-6'>
        <div className='lg:w-1/2 w-full'>
          <img src={mainImage} alt="Dish Image" className='w-full rounded-xl shadow-lg object-cover' />
        </div>
        <div className='grid grid-cols-2 gap-4 lg:w-1/2 w-full'>
          {dish.images.map((image, index) => (
            <img
              onClick={() => setMainImage(image)}
              key={index}
              src={image}
              alt="Dish Thumbnail"
              className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${mainImage === image ? 'outline outline-2 outline-orange-500' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* Dish Highlights */}
      <div className='flex flex-col md:flex-row md:justify-between mt-10'>
        <div className='flex flex-col'>
          <h1 className='text-3xl md:text-4xl font-playfair'>Delicious & Fresh Ingredients</h1>
          <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
            {dish.ingredients.map((item, index) => (
              <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100'>
                {/* Use an icon or emoji if you don't have a local asset */}
                <span role="img" aria-label={item}>🍅</span>
                <p className='text-xs'>{item}</p>
              </div>
            ))}
          </div>
        </div>
        <p className='text-2xl font-medium'>{dish.price} TND / serving</p>
      </div>

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
        <button type='submit' className='bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-25 py-3 md:py-4 text-base cursor-pointer'>
          Order Now
        </button>
      </form>

      {/* Dish Description */}
      <div className='max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500'>
        <p>{dish.desc}</p>
      </div>

      {/* Chef Info */}
      <div className='flex flex-col items-start gap-4'>
        <div className='flex gap-4'>
          <img src={dish.chef.image} alt="Chef" className='h-14 w-14 md:h-18 md:w-18 rounded-full' />
          <div>
            <p className='text-lg md:text-xl'>Prepared By {dish.chef.name}</p>
            <div className='flex items-center mt-1'>
              <StarRating rating={dish.rating} />
              <p className='ml-2'>{dish.reviews}+ reviews</p>
            </div>
          </div>
        </div>
        <button className='px-6 py-2.5 mt-4 rounded text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer'>Contact Chef</button>
      </div>
    </div>
  );
};

export default DishDetails;
