import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HotelReg from './components/HotelReg';
import RestaurantReg from './components/RestaurantReg';  

import Home from './pages/Home';
import AllRooms from './pages/AllRooms';
import RoomDetails from './pages/RoomDetails';
import MyBookings from './pages/MyBookings';
import DeliveryTracking from './pages/DeliveryTracking';  
import About from './pages/About';
import Transportation from './pages/Transportation';
import AiPlanner from './pages/AiPlanner';
import CreateTrip from './components/CreateTrip';
import Viewtrip from './pages/ViewTrip';
import TestPlacesDetails from './components/TestPlacesDetails';
import EventsPage from './pages/EventsPage';
import DishDetails from './pages/DishDetails';
import EventDetails from './components/EventDetails';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './components/AdminDashboard';
import TransportResults from "./components/TransportResults";
import TransportDetails from "./pages/TransportDetails";
import TransportBookings from './pages/TransportBookings';
import AllDishes from './pages/AllDishes';
// Hotel owner pages
import LayoutHotel from './pages/HotelOwner/LayoutHotel';
import DashboardHotel from './pages/HotelOwner/DashboardHotel';
import AddRoom from './pages/HotelOwner/AddRoom';
import ListeRoom from './pages/HotelOwner/ListeRoom';
// Restaurant owner pages
import LayoutDish from './pages/RestaurentOwner/LayoutDish';
import DashboardDish from './pages/RestaurentOwner/DashboardDish';
import AddDish from './pages/RestaurentOwner/AddDish';
import ListeDishes from './pages/RestaurentOwner/ListeDishes';

import { Toaster } from 'react-hot-toast';
import { useAppContext } from './context/AppContext';


const App = () => {
  const location = useLocation();
  const isOwnerPath = location.pathname.startsWith('/owner');
  const { showHotelReg, showRestaurantReg, setShowRestaurantReg } = useAppContext();

  return (
    <div className="flex flex-col min-h-screen relative">
      {!isOwnerPath && <Navbar />}

      <Toaster />

      {/* Render modals separately */}
      {showHotelReg && <HotelReg />}
      {showRestaurantReg && <RestaurantReg setShowRestaurantReg={setShowRestaurantReg} />}

      <main className="flex-grow min-h-[70vh]">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/my-orders" element={<DeliveryTracking />} />
          <Route path="/transport-bookings" element={<TransportBookings />} />
          <Route path="/dishes" element={<AllDishes/>} />
          <Route path="/about" element={<About />} />
          <Route path="/transportation" element={<Transportation />} />
          <Route path="/aiplanner" element={<AiPlanner />} />
          <Route path="/createtrip" element={<CreateTrip />} />
          <Route path="/test-place" element={<TestPlacesDetails />} />
          <Route path="/view-trip/:tripId" element={<Viewtrip />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:eventId" element={<EventDetails />} />
          <Route path="/dishes/:id" element={<DishDetails />} />
          <Route path="/transport/results" element={<TransportResults />} />
          <Route path="/transport/:id" element={<TransportDetails />} />
          {/* Hotel Owner Pages (nested routes) */}
          <Route path="/hotelowner" element={<LayoutHotel />}>
            <Route index element={<DashboardHotel />} />
            <Route path="add-room" element={<AddRoom />} />
            <Route path="list-room" element={<ListeRoom />} />
          </Route>
          {/* Restaurant Owner Pages (nested routes) */}
          <Route path="/restaurantowner" element={<LayoutDish />}>
            <Route index element={<DashboardDish />} />
            <Route path="add-dish" element={<AddDish />} />
            <Route path="list-dish" element={<ListeDishes />} />
          </Route>
          
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
        }
/>
          {/* Food Owner Pages (nested routes) */}
        </Routes>
      </main>

      {!isOwnerPath && <Footer />}
    </div>
  );
};

export default App;
