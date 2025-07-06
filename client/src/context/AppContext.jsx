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
  const [ownerType, setOwnerType] = useState(null);
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [showRestaurantReg, setShowRestaurantReg] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [dishes, setDishes] = useState([]);

  const isAdmin = ownerType === "admin";

  // Fetch rooms of the owner
const fetchRooms = async () => {
  try {
    const token = await getToken();
    const { data } = await axios.get("/api/rooms/owner", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (data.success) {
      setRooms(data.rooms);
    }
  } catch (error) {
    console.error("Error fetching rooms:", error);
    // Error hidden from user; logged for developer only
  }
};

// Fetch dishes of the owner (restaurant)
const fetchDishes = async () => {
  try {
    const token = await getToken();
    const { data } = await axios.get("/api/dishes/owner", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (data.success) {
      setDishes(data.dishes);
    }
  } catch (error) {
    console.error("Error fetching dishes:", error);
    // Error hidden from user; logged for developer only
  }
};

  // Fetch user role and owner status
  const fetchUser = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        const role = data.role.toLowerCase();
        const ownerStatus = role === "hotelowner" || role === "restaurantowner" || role === "admin";
        setIsOwner(ownerStatus);
        setOwnerType(role);
      }
    } catch (error) {
      toast.error(error.message || "Error fetching user data");
    }
  };

  useEffect(() => {
    if (user) {
      fetchUser();
      fetchRooms();
      fetchDishes();
    } else {
      setIsOwner(false);
      setOwnerType(null);
      setRooms([]);
      setDishes([]);
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
    dishes,
    setDishes,
    axios,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
