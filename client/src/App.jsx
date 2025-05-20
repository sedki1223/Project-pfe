import React from 'react';
import Navbar from './components/Navbar';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Footer from './components/Footer';
import AllRooms from './pages/AllRooms';
import RoomDetails from './pages/RoomDetails';
import MyBookings from './pages/MyBookings';
import HotelReg from './components/HotelReg';
import Layout from './pages/HotelOwner/Layout';
import Dashboard from './pages/HotelOwner/Dashboard';
import AddRoom from './pages/HotelOwner/AddRoom';
import ListeRoom from './pages/HotelOwner/ListeRoom';
import FoodItems from './components/FoodItems';
import About from './pages/About';
import Transportation from './pages/Transportation';
import AiPlanner from './pages/AiPlanner';
import CreateTrip from './components/CreateTrip';
import Viewtrip from "./pages/ViewTrip";
import TestPlacesDetails from '@/components/TestPlacesDetails';


const App = () => {
  const isOwnerPath = useLocation().pathname.includes("owner");

  return (
    <div>
      {!isOwnerPath && <Navbar />}
      {false && <HotelReg />}
      <div className="min-h-[70vh]">
        <Routes>
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
          {/* Updated dynamic route for Viewtrip */}
          <Route path="/view-trip/:tripId" element={<Viewtrip />} />

          {/* Owner routes */}
          <Route path="/owner" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-room" element={<AddRoom />} />
            <Route path="list-room" element={<ListeRoom />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
