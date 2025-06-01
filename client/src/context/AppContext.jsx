import axios from "axios";
import { useState, useContext , useEffect} from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY||"$";
    const navigate = useNavigate();
    const { user } = useUser();
    const { getToken } = useAuth();
    const [isOwner, setIsOwner] = useState(false);
    const [showHotelReg, setShowHotelReg] = useState(false);
    const fetchUser = async () => {
        try{
            const {data} = await axios.get("/api/user", {
                headers: {
                    Authorization: `Bearer ${await getToken()}`
                }})
                if (data.success) {
                    setIsOwner(data.role === "hotelowner");
                }else {
                    //Retry fetching user data
                    setTimeout(() => {
                        fetchUser();
                    }, 5000);
                }
            
        } catch (error) {
            toast.error(error.message);
        }
    }
    useEffect(() => {
        if (user) {
            fetchUser();
        }
    }, [user]);
    
    const value = {
        currency,
        navigate,
        user,
        getToken,
        isOwner,
        setIsOwner,
        axios,
        showHotelReg,
        setShowHotelReg
    };
    return(
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext);
