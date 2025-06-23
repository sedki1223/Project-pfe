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

  // 🔍 Derived admin flag (computed from role)
  const isAdmin = ownerType === "admin";

  const fetchRooms = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/rooms/owner", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setRooms(data.rooms);
      } else {
        toast.error(data.message || "Failed to fetch rooms");
      }
    } catch (error) {
      toast.error("Error fetching rooms: " + (error.message || error));
    }
  };

  const fetchUser = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        const role = data.role.toLowerCase();
        setIsOwner(role === "hotelowner" || role === "foodowner");
        setOwnerType(role); // admin will be handled via isAdmin
      } else {
        setTimeout(fetchUser, 5000); // Retry after delay
      }
    } catch (error) {
      toast.error(error.message || "Error fetching user data");
    }
  };

  useEffect(() => {
    if (user) {
      fetchUser();
      fetchRooms();
    } else {
      // Reset when logged out
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
