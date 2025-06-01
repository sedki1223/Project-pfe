// src/context/AppContext.jsx
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const { user, isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();

  const [isOwner, setIsOwner] = useState(false);
  const [showHotelReg, setShowHotelReg] = useState(false);

  useEffect(() => {
    axios.defaults.baseURL = backendUrl;
  }, [backendUrl]);

  const fetchUser = async () => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("No auth token found");
      }

      const { data } = await axios.get("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setIsOwner(data.role === "hotelowner");
      } else {
        console.warn("Retrying user fetch in 5s...");
        setTimeout(fetchUser, 5000);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Could not fetch user data.");
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchUser();
    }
  }, [isLoaded, isSignedIn]);

  const value = {
    currency,
    navigate,
    user,
    getToken,
    isOwner,
    setIsOwner,
    axios,
    showHotelReg,
    setShowHotelReg,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
