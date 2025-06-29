import axios from "axios";
import { useState, useContext, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();

  const [isOwner, setIsOwner] = useState(false);
  const [ownerType, setOwnerType] = useState(null); // hotelowner, foodowner, admin, null
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [showRestaurantReg, setShowRestaurantReg] = useState(false);
  const [rooms, setRooms] = useState([]);

  const isAdmin = ownerType === "admin";

  const fetchRooms = async () => {
    const start = Date.now();
    console.log(`[${new Date().toISOString()}] 🚀 fetchRooms start`);

    try {
      const tokenStart = Date.now();
      const token = await getToken();
      console.log(`[${new Date().toISOString()}] 🔑 getToken done in ${Date.now() - tokenStart}ms`, token);

      const axiosStart = Date.now();
      const { data } = await axios.get("/api/rooms/owner", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(`[${new Date().toISOString()}] 📡 axios.get /api/rooms/owner done in ${Date.now() - axiosStart}ms`, data);

      if (data.success) {
        setRooms(data.rooms);
        console.log(`[${new Date().toISOString()}] 🏨 setRooms updated`, data.rooms);
      } else {
        console.warn(`[${new Date().toISOString()}] ⚠️ fetchRooms response success:false`, data.message);
        toast.error(data.message || "Failed to fetch rooms");
      }
    } catch (error) {
      console.error(`[${new Date().toISOString()}] ❌ fetchRooms error:`, error);
      toast.error("Error fetching rooms: " + (error.message || error));
    }

    console.log(`[${new Date().toISOString()}] 🕒 fetchRooms total duration: ${Date.now() - start}ms`);
  };

  const fetchUser = async () => {
    const start = Date.now();
    console.log(`[${new Date().toISOString()}] 🚀 fetchUser start`);

    try {
      const tokenStart = Date.now();
      const token = await getToken();
      console.log(`[${new Date().toISOString()}] 🔑 getToken done in ${Date.now() - tokenStart}ms`, token);

      const axiosStart = Date.now();
      const { data } = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(`[${new Date().toISOString()}] 📡 axios.get /api/user done in ${Date.now() - axiosStart}ms`, data);

      if (data.success) {
        const role = data.role.toLowerCase();
        console.log(`[${new Date().toISOString()}] 👤 User role:`, role);

        setIsOwner(role === "hotelowner" || role === "foodowner");
        setOwnerType(role);

        console.log(`[${new Date().toISOString()}] ⚙️ isOwner set to:`, role === "hotelowner" || role === "foodowner");
        console.log(`[${new Date().toISOString()}] ⚙️ ownerType set to:`, role);
      } else {
        console.warn(`[${new Date().toISOString()}] ⚠️ User fetch failed, retrying in 5s`);
        setTimeout(fetchUser, 5000);
      }
    } catch (error) {
      console.error(`[${new Date().toISOString()}] ❌ fetchUser error:`, error);
      toast.error(error.message || "Error fetching user data");
    }

    console.log(`[${new Date().toISOString()}] 🕒 fetchUser total duration: ${Date.now() - start}ms`);
  };

  useEffect(() => {
    console.log(`[${new Date().toISOString()}] 🔄 useEffect triggered, user:`, user);

    if (user) {
      fetchUser();
      fetchRooms();
    } else {
      console.log(`[${new Date().toISOString()}] 🚪 User logged out, resetting context state`);
      setIsOwner(false);
      setOwnerType(null);
      setRooms([]);
      setShowHotelReg(false);
      setShowRestaurantReg(false);
    }
  }, [user]);

  const value = {
    currency,
    navigate,
    user,
    getToken,
    isOwner,
    ownerType,
    isAdmin,
    setIsOwner,
    showHotelReg,
    setShowHotelReg,
    showRestaurantReg,
    setShowRestaurantReg,
    rooms,
    setRooms,
    axios,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
