import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppContext } from '@/context/AppContext';

const statusColors = {
  pending: 'text-yellow-500',
  preparing: 'text-yellow-600',
  'out for delivery': 'text-blue-500',
  delivered: 'text-green-500',
  cancelled: 'text-gray-400',
};

const DeliveryTracking = () => {
  const navigate = useNavigate();
  const { axios, getToken } = useAppContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user orders
  const fetchOrders = async () => {
    try {
      const token = await getToken();
      if (!token) {
        navigate('/login');
        return;
      }
      const { data } = await axios.get('/api/food-orders/my-orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setOrders(data.orders);
      } else {
        console.error('Failed to fetch orders:', data.message);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cancel order handler
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      const token = await getToken();
      const { data } = await axios.patch(
        `/api/food-orders/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        toast.success('Order cancelled successfully');
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: 'cancelled' } : order
          )
        );
      } else {
        toast.error(data.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error(error.response?.data?.error || 'Error cancelling order');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Your UI rendering below remains unchanged
  // ...

  return (
    <div className="px-8 py-12 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Your Food Orders</h1>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>You have no food orders yet.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => {
            const isCancelled = order.status === 'cancelled';
            return (
              <div
                key={order._id}
                className={`flex items-center justify-between p-5 border border-gray-300 rounded-lg shadow-sm transition-opacity duration-300 ${
                  isCancelled ? 'opacity-50' : 'opacity-100'
                }`}
              >
                <div
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={() => {
                    navigate(`/dishes/${order.foodItem._id}`);
                    window.scrollTo(0, 0);
                  }}
                >
                  <img
                    src={order.foodItem.images?.[0]}
                    alt={order.foodItem.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div>
                    <p className="text-lg font-semibold">{order.foodItem.name}</p>
                    <p className="text-gray-600">Order ID: {order._id}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <p className={`font-semibold ${statusColors[order.status] || 'text-gray-700'}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Total: ${order.totalPrice?.toFixed(2)}
                  </p>
                  {!isCancelled && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="px-4 py-1.5 text-xs border border-red-400 text-red-500 rounded-full hover:bg-red-50 transition-all cursor-pointer w-max"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DeliveryTracking;
