import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FoodData from '../data/FoodData';

const sampleOrders = [
  {
    id: 'ORD12345',
    dishId: '1',
    status: 'Preparing',
    estimatedDelivery: '2025-06-02T18:30:00',
  },
  {
    id: 'ORD12346',
    dishId: '3',
    status: 'Out for delivery',
    estimatedDelivery: '2025-06-02T19:00:00',
  },
  {
    id: 'ORD12347',
    dishId: '2',
    status: 'Delivered',
    estimatedDelivery: '2025-06-01T20:00:00',
  },
];

const statusColors = {
  Preparing: 'text-yellow-500',
  'Out for delivery': 'text-blue-500',
  Delivered: 'text-green-500',
};

const DeliveryTracking = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(sampleOrders);

  const getDishById = (id) => FoodData.find((dish) => dish.id === id);

  return (
    <div className="px-8 py-12 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Your Food Orders</h1>
      {orders.length === 0 ? (
        <p>You have no food orders yet.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => {
            const dish = getDishById(order.dishId);
            return (
              <div
                key={order.id}
                className="flex items-center justify-between p-5 border border-gray-300 rounded-lg shadow-sm"
              >
                <div
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={() => {
                    navigate(`/foods/${dish.id}`);
                    window.scrollTo(0, 0);
                  }}
                >
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div>
                    <p className="text-lg font-semibold">{dish.name}</p>
                    <p className="text-gray-600">Order ID: {order.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${statusColors[order.status] || 'text-gray-700'}`}>
                    {order.status}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Est. Delivery: {new Date(order.estimatedDelivery).toLocaleString()}
                  </p>
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
