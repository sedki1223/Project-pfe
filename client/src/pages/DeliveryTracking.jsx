import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const statusColors = {
  pending: 'text-yellow-500',
  preparing: 'text-yellow-600',
  'out for delivery': 'text-blue-500',
  delivered: 'text-green-500',
};

const DeliveryTracking = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/food-orders/my-orders');
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        } else {
          console.error(data.message || 'Failed to fetch orders');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="px-8 py-12 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Your Food Orders</h1>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>You have no food orders yet.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="flex items-center justify-between p-5 border border-gray-300 rounded-lg shadow-sm"
            >
              <div
                className="flex items-center gap-4 cursor-pointer"
                onClick={() => {
                  navigate(`/foods/${order.foodItem._id}`);
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
              <div className="text-right">
                <p className={`font-semibold ${statusColors[order.status] || 'text-gray-700'}`}>
                  {order.status}
                </p>
                <p className="text-gray-500 text-sm">
                  Total: ${order.totalPrice?.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryTracking;
