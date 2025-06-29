import React, { useState, useEffect } from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'
import toast from 'react-hot-toast'
import { useAppContext } from '@/context/AppContext'

const DashboardDish = () => {
   const { currency, user, axios, getToken } = useAppContext();


  const [dashboardData, setDashboardData] = useState({
    orders: [],
    totalOrders: 0,
    totalRevenue: 0,
  })

  const fetchDashboardData = async () => {
    try {
      const token = await getToken() 
      const res = await fetch('/api/food-orders/vendor-orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()

      if (data.success) {
        setDashboardData(data.dashboardData)
      } else {
        toast.error(data.message || 'Failed to load dashboard data')
      }
    } catch (error) {
      toast.error('Error fetching dashboard data')
      console.error(error)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return (
    <div>
      <Title align="left" font="outfit" title="Dashboard" subTitle="Monitor your dishes and orders" />

      <div className="flex gap-4 my-8">
        {/* Total Orders */}
        <div className="bg-primary/3 border border-primary/10 rounded flex p-4 pr-8 items-center">
          <img src={assets.totalBookingIcon} alt="Total Orders" className="max-sm:hidden h-10" />
          <div className="flex flex-col sm:ml-4 font-medium">
            <p className="text-blue-500 text-lg">Total Orders</p>
            <p className="text-neutral-400 text-base">{dashboardData.totalOrders}</p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-primary/3 border border-primary/10 rounded flex p-4 pr-8 items-center">
          <img src={assets.totalRevenueIcon} alt="Total Revenue" className="max-sm:hidden h-10" />
          <div className="flex flex-col sm:ml-4 font-medium">
            <p className="text-blue-500 text-lg">Total Revenue</p>
            <p className="text-neutral-400 text-base">
              {currency} {dashboardData.totalRevenue}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <h2 className="text-xl text-blue-950/70 font-medium mb-5">Recent Orders</h2>

      <div className="w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-gray-800 font-medium">User Name</th>
              <th className="py-3 px-4 text-gray-800 font-medium max-sm:hidden">Dish Name</th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">Total Amount</th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">Payment Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {dashboardData.orders.map((item, index) => (
              <tr key={index}>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300">{item.user?.username || 'Unknown'}</td>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden">{item.food?.name || 'Unknown'}</td>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 text-center">
                  {currency} {item.totalPrice}
                </td>
                <td className="py-3 px-4 border-t border-gray-300 text-center">
                  <button
                    className={`py-1 px-3 text-xs rounded-full mx-auto ${
                      item.isPaid ? 'bg-green-200 text-green-600' : 'bg-amber-200 text-amber-700'
                    }`}
                  >
                    {item.isPaid ? 'Completed' : 'Pending'}
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

export default DashboardDish
