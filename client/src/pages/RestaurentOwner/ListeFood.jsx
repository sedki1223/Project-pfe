import React, { useEffect, useState } from 'react'
import Title from '../../components/Title'

const ListeFood = () => {
  const [foods, setFoods] = useState([])

  // Mock data for demo
  const mockFoods = [
    {
      _id: '1',
      dishName: 'Couscous Royal',
      ingredients: ['Semolina', 'Lamb', 'Vegetables'],
      price: 20,
      isAvailable: true,
    },
    {
      _id: '2',
      dishName: 'Brik à l\'œuf',
      ingredients: ['Tuna', 'Egg', 'Parsley'],
      price: 7,
      isAvailable: false,
    },
    {
      _id: '3',
      dishName: 'Ojja Merguez',
      ingredients: ['Tomato', 'Merguez', 'Egg'],
      price: 15,
      isAvailable: true,
    },
  ]

  // Load mock data once
  useEffect(() => {
    setFoods(mockFoods)
  }, [])

  // Toggle availability in state
  const toggleAvailability = (foodId) => {
    setFoods((prevFoods) =>
      prevFoods.map((food) =>
        food._id === foodId ? { ...food, isAvailable: !food.isAvailable } : food
      )
    )
  }

  return (
    <div>
      <Title align='left' font='outfit' title='Food Listing' subTitle='View, edit, or manage all listed dishes' />
      <p className='text-gray-500 mt-8'>All Dishes</p>

      <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll mt-3'>
        <table className='w-full'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='py-3 px-4 text-gray-800 font-medium'>Name</th>
              <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Ingredients</th>
              <th className='py-3 px-4 text-gray-800 font-medium'>Price</th>
              <th className='py-3 px-4 text-gray-800 font-medium text-center'>Actions</th>
            </tr>
          </thead>
          <tbody className='text-sm'>
            {foods.map((item) => (
              <tr key={item._id}>
                <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>{item.dishName}</td>
                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
                  {item.ingredients.join(', ')}
                </td>
                <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>$ {item.price}</td>
                <td className='py-3 px-4 border-t border-gray-300 text-center'>
                  <label className='relative inline-flex items-center cursor-pointer gap-3'>
                    <input
                      onChange={() => toggleAvailability(item._id)}
                      type='checkbox'
                      className='sr-only peer'
                      checked={item.isAvailable}
                    />
                    <div className='w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200'></div>
                    <span className='dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5'></span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ListeFood
