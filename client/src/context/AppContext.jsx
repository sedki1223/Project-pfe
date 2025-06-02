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

  // Owner role & modal states
  const [isOwner, setIsOwner] = useState(false);
  const [ownerType, setOwnerType] = useState(null); // "hotelowner", "foodowner", or null

  // Separate modal visibility states for hotel & food registration
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [showFoodReg, setShowFoodReg] = useState(false);

  const [rooms, setRooms] = useState([]);

  // Fetch rooms owned by the user (hotel owner)
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

  // Fetch user info to determine role
  const fetchUser = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        // Set owner flags based on role
        setIsOwner(data.role === "hotelowner" || data.role === "foodowner");
        setOwnerType(data.role);
      } else {
        // Retry after delay if data not successful
        setTimeout(() => {
          fetchUser();
        }, 5000);
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
      // Reset on logout or no user
      setIsOwner(false);
      setOwnerType(null);
      setRooms([]);
      setShowHotelReg(false);
      setShowFoodReg(false);
    }
  }, [user]);

  const value = {
    currency,
    navigate,
    user,
    getToken,
    isOwner,
    ownerType,
    setIsOwner,
    showHotelReg,
    setShowHotelReg,
    showFoodReg,
    setShowFoodReg,
    rooms,
    setRooms,
    axios,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
