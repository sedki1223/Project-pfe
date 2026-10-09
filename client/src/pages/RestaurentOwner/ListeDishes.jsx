import React, { useEffect, useState } from 'react';
import Title from '../../components/Title';
import toast from 'react-hot-toast';
import { useAppContext } from '@/context/AppContext';

const ListeDishes = () => {
  const { axios, getToken, currency } = useAppContext();
  const [dishes, setDishes] = useState([]);

  // Fetch dishes of the vendor
  const fetchDishes = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/dishes/owner', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setDishes(data.dishes);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching dishes:', error);
      toast.error(error?.response?.data?.message || error.message || 'Error fetching dishes');
    }
  };

  // Toggle dish availability
  const toggleDishAvailability = async (dishId) => {
    try {
      const token = await getToken();
      const { data } = await axios.put(
        `/api/dishes/${dishId}/availability`,
        { dishId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        fetchDishes();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error toggling dish availability:', error);
      toast.error(error?.response?.data?.message || error.message || 'Error toggling availability');
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  return (
    <div>
      <Title align="left" font="outfit" title="Dish Listing" subTitle="View, edit, or manage all listed dishes" />
      <p className="text-gray-500 mt-8">All Dishes</p>

      <div className="w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll mt-3">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-gray-800 font-medium">Name</th>
              <th className="py-3 px-4 text-gray-800 font-medium max-sm:hidden">Features</th>
              <th className="py-3 px-4 text-gray-800 font-medium">Price</th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {dishes.map((item) => (
              <tr key={item._id}>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300">{item.dishName}</td>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden">
                  {item.features?.join(', ')}
                </td>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                  {currency || '$'} {item.price}
                </td>
                <td className="py-3 px-4 border-t border-gray-300 text-center">
                  <label className="relative inline-flex items-center cursor-pointer gap-3">
                    <input
                      onChange={() => toggleDishAvailability(item._id)}
                      type="checkbox"
                      className="sr-only peer"
                      checked={item.isAvailable}
                      readOnly
                    />
                    <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                    <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListeDishes;
