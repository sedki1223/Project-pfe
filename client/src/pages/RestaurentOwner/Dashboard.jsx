import React, { useState, useEffect } from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const currency = '$' // or get from context if available
  const [dashboardData, setDashboardData] = useState({
    orders: [],
    totalOrders: 0,
    totalRevenue: 0,
  })

  // Mock fetching dashboard data (replace with backend call later)
  const fetchDashboardData = async () => {
    try {
      // Simulate fetch delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      // Mock data example
      const data = {
        success: true,
        dashboardData: {
          totalOrders: 5,
          totalRevenue: 450,
          orders: [
            {
              user: { username: 'JohnDoe' },
              dish: { dishName: 'Spicy Chicken' },
              totalPrice: 50,
              isPaid: true,
            },
            {
              user: { username: 'JaneSmith' },
              dish: { dishName: 'Veggie Salad' },
              totalPrice: 30,
              isPaid: false,
            },
            // add more mock orders if needed
          ],
        },
      }
      if (data.success) {
        setDashboardData(data.dashboardData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Error fetching dashboard data')
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return (
    <div>
      <Title align='left' font='outfit' title='Dashboard' subTitle='monitor your dishes and orders' />
      <div className='flex gap-4 my-8'>
        {/* Total Orders */}
        <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
          <img src={assets.totalBookingIcon} alt='' className='max-sm:hidden h-10' />
          <div className='flex flex-col sm:ml-4 font-medium'>
            <p className='text-blue-500 text-lg'>Total Orders</p>
            <p className='text-neutral-400 text-base'>{dashboardData.totalOrders}</p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
          <img src={assets.totalRevenueIcon} alt='' className='max-sm:hidden h-10' />
          <div className='flex flex-col sm:ml-4 font-medium'>
            <p className='text-blue-500 text-lg'>Total Revenue</p>
            <p className='text-neutral-400 text-base'>
              {currency} {dashboardData.totalRevenue}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <h2 className='text-xl text-blue-950/70 font-medium mb-5'>Recent Orders</h2>

      <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll'>
        <table className='w-full'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='py-3 px-4 text-gray-800 font-medium'>User Name</th>
              <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Dish Name</th>
              <th className='py-3 px-4 text-gray-800 font-medium text-center'>Total Amount</th>
              <th className='py-3 px-4 text-gray-800 font-medium text-center'>Payment Status</th>
            </tr>
          </thead>
          <tbody className='text-sm'>
            {dashboardData.orders.map((item, index) => (
              <tr key={index}>
                <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>{item.user.username}</td>
                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>{item.dish.dishName}</td>
                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>
                  {currency} {item.totalPrice}
                </td>
                <td className='py-3 px-4 border-t border-gray-300 flex'>
                  <button
                    className={`py-1 px-3 text-xs rounded-full mx-auto ${
                      item.isPaid ? 'bg-green-200 text-green-600' : 'bg-amber-200'
                    }`}
                  >
                    {item.isPaid ? 'completed' : 'pending'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard
