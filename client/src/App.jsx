import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HotelReg from './components/HotelReg';

import Home from './pages/Home';
import AllRooms from './pages/AllRooms';
import RoomDetails from './pages/RoomDetails';
import MyBookings from './pages/MyBookings';
import About from './pages/About';
import Transportation from './pages/Transportation';
import AiPlanner from './pages/AiPlanner';
import CreateTrip from './components/CreateTrip';
import Viewtrip from './pages/ViewTrip';
import TestPlacesDetails from './components/TestPlacesDetails';
import EventsPage from './pages/EventsPage';
import FoodItems from './components/FoodItems';
import EventDetails from './components/EventDetails';

// Hotel owner pages
import Layout from './pages/HotelOwner/Layout';
import Dashboard from './pages/HotelOwner/Dashboard';
import AddRoom from './pages/HotelOwner/AddRoom';
import ListeRoom from './pages/HotelOwner/ListeRoom';

import { Toaster } from 'react-hot-toast';
import { useAppContext } from './context/AppContext';

const App = () => {
  const location = useLocation();
  const isOwnerPath = location.pathname.startsWith('/owner');
  const { showHotelReg } = useAppContext();

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Navbar for public routes */}
      {!isOwnerPath && <Navbar />}

      {/* Toast notification */}
      <Toaster />

      {/* Global modals (like Hotel registration) */}
      {showHotelReg && <HotelReg />}

      {/* Main routes */}
      <main className="flex-grow min-h-[70vh]">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/food" element={<FoodItems />} />
          <Route path="/about" element={<About />} />
          <Route path="/transportation" element={<Transportation />} />
          <Route path="/aiplanner" element={<AiPlanner />} />
          <Route path="/createtrip" element={<CreateTrip />} />
          <Route path="/test-place" element={<TestPlacesDetails />} />
          <Route path="/view-trip/:tripId" element={<Viewtrip />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:eventId" element={<EventDetails />} />

          {/* Hotel Owner Pages (nested routes) */}
          <Route path="/owner" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-room" element={<AddRoom />} />
            <Route path="list-room" element={<ListeRoom />} />
          </Route>
        </Routes>
      </main>

      {/* Footer for public routes */}
      {!isOwnerPath && <Footer />}
    </div>
  );
};

export default App;
