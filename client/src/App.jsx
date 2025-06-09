import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HotelReg from './components/HotelReg';
import RestaurantReg from './components/RestaurantReg';  // updated import

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
import DishDetails from './pages/FoodDetails';
import EventDetails from './components/EventDetails';

// Hotel owner pages
import Layout from './pages/HotelOwner/Layout';
import Dashboard from './pages/HotelOwner/Dashboard';
import AddRoom from './pages/HotelOwner/AddRoom';
import ListeRoom from './pages/HotelOwner/ListeRoom';

// Food owner pages

import { Toaster } from 'react-hot-toast';
import { useAppContext } from './context/AppContext';
import AllFoods from './pages/AllFood';

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
          <Route path="/food" element={<AllFoods />} />
          <Route path="/about" element={<About />} />
          <Route path="/transportation" element={<Transportation />} />
          <Route path="/aiplanner" element={<AiPlanner />} />
          <Route path="/createtrip" element={<CreateTrip />} />
          <Route path="/test-place" element={<TestPlacesDetails />} />
          <Route path="/view-trip/:tripId" element={<Viewtrip />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:eventId" element={<EventDetails />} />
          <Route path="/foods/:id" element={<DishDetails />} />

          {/* Hotel Owner Pages (nested routes) */}
          <Route path="/ownerhotel" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-room" element={<AddRoom />} />
            <Route path="list-room" element={<ListeRoom />} />
          </Route>
          {/* Food Owner Pages (nested routes) */}
        </Routes>
      </main>

      {!isOwnerPath && <Footer />}
    </div>
  );
};

export default App;
