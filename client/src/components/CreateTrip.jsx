import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { app } from "@/service/firebaseConfig";
import { useNavigate } from 'react-router-dom';

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const SelectBudgetOptions = [
  { id: 1, title: 'Low Budget', desc: 'Affordable and efficient', icon: '💰' },
  { id: 2, title: 'Mid Budget', desc: 'Balanced comfort and cost', icon: '💵' },
  { id: 3, title: 'Luxury', desc: 'Premium experience', icon: '💎' },
];

const SelectTravelersList = [
  { id: 1, title: 'Just me', desc: 'A solo traveler in exploration', icon: '🧍' },
  { id: 2, title: 'Couple', desc: 'Two exploring together', icon: '👫' },
  { id: 3, title: 'Family', desc: 'Traveling with kids and all', icon: '👨‍👩‍👧‍👦' },
];

const CreateTrip = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    lookingFor: '',
    days: '',
    budget: null,
    travelers: null,
  });
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential) {
        setUser(result.user);
        toast.success("Login successful!");
        setOpenDialog(false);
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed!");
    }
  };

  const handleInputChange = (name, value) => {
    if (!user) {
      setOpenDialog(true);
      return;
    }

    if (name === 'days') {
      const num = parseInt(value);
      if (num > 0 && num <= 4) {
        setFormData({ ...formData, days: num });
        setError(null);
      } else {
        setError('Number of days must be between 1 and 4.');
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

const onGenerateTrip = async () => {
  setLoading(true);
  const loadingToastId = toast.loading("Generating your trip...");

  const { lookingFor, days, budget, travelers } = formData;

  const FINAL_PROMPT = `Plan a trip for someone interested in ${lookingFor}, staying ${days} days, with a ${budget?.title} budget, traveling as ${travelers?.title}.`;

  try {
    const response = await axios.post('http://localhost:5000/api/generate-trip', { prompt: FINAL_PROMPT });

    console.log("API response:", response.data); // for debugging

    if (
      response.data &&
      typeof response.data.reply === 'string' &&
      response.data.itinerary && typeof response.data.itinerary === 'object'
    ) {
      const aiText = response.data.reply; // Or you can save entire itinerary if you want
      toast.dismiss(loadingToastId);
      toast.success("Trip generated successfully!");
      await SaveAiTrip(aiText);
    } else {
      throw new Error("Invalid response data from API");
    }
  } catch (error) {
    toast.dismiss(loadingToastId);
    toast.error("Something went wrong while generating the trip!");
    if (axios.isAxiosError(error)) {
      console.error("Trip generation error status:", error.response?.status);
      console.error("Trip generation error data:", error.response?.data);
      console.error("Trip generation error message:", error.message);
    } else {
      console.error("Trip generation unexpected error:", error);
    }
  } finally {
    setLoading(false);
  }
};




  const SaveAiTrip = async (tripData) => {
    const docId = Date.now().toString();
    await setDoc(doc(db, "AiTrips", docId), {
      userSelection: formData,
      tripData,
      userEmail: user?.email,
      id: docId,
    });
    navigate('/view-trip/' + docId);
  };

  return (
    <div className="px-5 mt-24 max-w-5xl mx-auto">
      <h2 className="font-bold text-3xl">Tell us your travel preferences</h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will generate a customized itinerary.
      </p>

      <div className="mt-20 flex flex-col gap-10">
        {/* Interests */}
        <div>
          <h2 className="text-xl my-3 font-medium">What are you looking for in our city?</h2>
          <input
            type="text"
            placeholder="Ex. Food, Nature, Culture..."
            value={formData.lookingFor}
            onChange={(e) => handleInputChange('lookingFor', e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        {/* Days */}
        <div>
          <h2 className="text-xl my-3 font-medium">How many days are you staying? (Max: 4)</h2>
          <input
            type="number"
            min="1"
            max="4"
            placeholder="Ex. 3"
            value={formData.days}
            onChange={(e) => handleInputChange('days', e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        {/* Budget */}
        <div>
          <h2 className="text-xl my-3 font-medium">What is your budget?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5">
            {SelectBudgetOptions.map((item) => (
              <div
                key={item.id}
                onClick={() => handleInputChange('budget', item)}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg transition ${formData.budget?.id === item.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
              >
                <div className="text-4xl">{item.icon}</div>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
          {formData.budget && (
            <p className="mt-2 text-blue-600 font-semibold">
              Selected Budget: {formData.budget.title}
            </p>
          )}
        </div>

        {/* Travelers */}
        <div>
          <h2 className="text-xl my-3 font-medium">Who do you plan on traveling with?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5">
            {SelectTravelersList.map((item) => (
              <div
                key={item.id}
                onClick={() => handleInputChange('travelers', item)}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg transition ${formData.travelers?.id === item.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
              >
                <div className="text-4xl">{item.icon}</div>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
          {formData.travelers && (
            <p className="mt-2 text-blue-600 font-semibold">
              Selected Travelers: {formData.travelers.title}
            </p>
          )}
        </div>

        {/* Generate Button */}
        <button
          onClick={onGenerateTrip}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold mt-10 hover:bg-blue-700 transition flex justify-center items-center gap-2"
        >
          {loading ? <AiOutlineLoading3Quarters className="animate-spin" size={24} /> : 'Generate Trip'}
        </button>
      </div>

      {/* Login Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              Please log in with Google to generate your trip.
            </DialogDescription>
          </DialogHeader>
          <button
            onClick={loginWithGoogle}
            className="w-full border border-gray-300 rounded-md py-2 mt-4 flex items-center justify-center gap-3 hover:bg-gray-100 transition"
          >
            <FcGoogle size={22} /> Continue with Google
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateTrip;
