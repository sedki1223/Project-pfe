import logo from './logo.svg'
import searchIcon from './searchIcon.svg'
import userIcon from './userIcon.svg'
import calenderIcon from './calenderIcon.svg'
import locationIcon from './locationIcon.svg'
import starIconFilled from './starIconFilled.svg'
import arrowIcon from './arrowIcon.svg'
import starIconOutlined from './starIconOutlined.svg'
import instagramIcon from './instagramIcon.svg'
import facebookIcon from './facebookIcon.svg'
import twitterIcon from './twitterIcon.svg'
import linkendinIcon from './linkendinIcon.svg'
import freeWifiIcon from './freeWifiIcon.svg'
import freeBreakfastIcon from './freeBreakfastIcon.svg'
import roomServiceIcon from './roomServiceIcon.svg'
import mountainIcon from './mountainIcon.svg'
import poolIcon from './poolIcon.svg'
import homeIcon from './homeIcon.svg'
import closeIcon from './closeIcon.svg'
import locationFilledIcon from './locationFilledIcon.svg'
import heartIcon from './heartIcon.svg'
import badgeIcon from './badgeIcon.svg'
import menuIcon from './menuIcon.svg'
import closeMenu from './closeMenu.svg'
import guestsIcon from './guestsIcon.svg'
import roomImg1 from './roomImg1.png'
import roomImg2 from './roomImg2.png'
import roomImg3 from './roomImg3.png'
import roomImg4 from './roomImg4.png'
import regImage from './regImage.png'
import exclusiveOfferCardImg1 from "./exclusiveOfferCardImg1.png";
import exclusiveOfferCardImg2 from "./exclusiveOfferCardImg2.png";
import exclusiveOfferCardImg3 from "./exclusiveOfferCardImg3.png";
import addIcon from "./addIcon.svg";
import dashboardIcon from "./dashboardIcon.svg";
import listIcon from "./listIcon.svg";
import uploadArea from "./uploadArea.svg";
import totalBookingIcon from "./totalBookingIcon.svg";
import totalRevenueIcon from "./totalRevenueIcon.svg";

// Food images placeholders — replace with your actual images
import foodImg1 from './foodImg1.png' 
import foodImg2 from './foodImg2.png'
import foodImg3 from './foodImg3.png'
import foodImg4 from './foodImg4.png'
import foodImg5 from './foodImg5.png'
import foodImg6 from './foodImg6.png'
import foodImg7 from './foodImg7.png'
import foodImg8 from './foodImg8.png'
import foodImg9 from './foodImg9.png'
import foodImg10 from './foodImg10.png'

export const assets = {
    logo,
    searchIcon,
    userIcon,
    calenderIcon,
    locationIcon,
    starIconFilled,
    arrowIcon,
    starIconOutlined,
    instagramIcon,
    facebookIcon,
    twitterIcon,
    linkendinIcon,
    freeWifiIcon,
    freeBreakfastIcon,
    roomServiceIcon,
    mountainIcon,
    poolIcon,
    closeIcon,
    homeIcon,
    locationFilledIcon,
    heartIcon,
    badgeIcon,
    menuIcon,
    closeMenu,
    guestsIcon,
    regImage,
    addIcon,
    dashboardIcon,
    listIcon,
    uploadArea,
    totalBookingIcon,
    totalRevenueIcon,
}


export const cities = [
    "Tozeur",
    "Douz",
    "Nefta",
];

export const exclusiveOffers = [
    { _id: 1, title: "Summer Escape Package", description: "Enjoy a complimentary night and daily breakfast", priceOff: 25, expiryDate: "Aug 31", image: exclusiveOfferCardImg1 },
    { _id: 2, title: "Romantic Getaway", description: "Special couples package including spa treatment", priceOff: 20, expiryDate: "Sep 20", image: exclusiveOfferCardImg2 },
    { _id: 3, title: "Luxury Retreat", description: "Book 60 days in advance and save on your stay at any of our luxury properties worldwide.", priceOff: 30, expiryDate: "Sep 25", image: exclusiveOfferCardImg3 },
]

export const testimonials = [
    { id: 1, name: "Emma Rodriguez", address: "Barcelona, Spain", image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200", rating: 5, review: "I've used many booking platforms before, but none compare to the personalized experience and attention to detail that QuickStay provides." },
    { id: 2, name: "Liam Johnson", address: "New York, USA", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200", rating: 4, review: "QuickStay exceeded my expectations. The booking process was seamless, and the hotels were absolutely top-notch. Highly recommended!" },
    { id: 3, name: "Sophia Lee", address: "Seoul, South Korea", image: "https://images.unsplash.com/photo-1701615004837-40d8573b6652?q=80&w=200", rating: 5, review: "Amazing service! I always find the best luxury accommodations through QuickStay. Their recommendations never disappoint!" }
];

export const facilityIcons = {
    "Free WiFi": assets.freeWifiIcon,
    "Free Breakfast": assets.freeBreakfastIcon,
    "Room Service": assets.roomServiceIcon,
    "Mountain View": assets.mountainIcon,
    "Pool Access": assets.poolIcon,
};

export const roomCommonData = [
    { icon: assets.homeIcon, title: "Clean & Safe Stay", description: "A well-maintained and hygienic space just for you." },
    { icon: assets.badgeIcon, title: "Enhanced Cleaning", description: "This host follows Staybnb's strict cleaning standards." },
    { icon: assets.locationFilledIcon, title: "Excellent Location", description: "90% of guests rated the location 5 stars." },
    { icon: assets.heartIcon, title: "Smooth Check-In", description: "100% of guests gave check-in a 5-star rating." },
];

export const userDummyData = {
    "_id": "user_2unqyL4diJFP1E3pIBnasc7w8hP",
    "username": "Great Stack",
    "email": "user.greatstack@gmail.com",
    "image": "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJ2N2c5YVpSSEFVYVUxbmVYZ2JkSVVuWnFzWSJ9",
    "role": "hotelOwner",
    "createdAt": "2025-03-25T09:29:16.367Z",
    "updatedAt": "2025-04-10T06:34:48.719Z",
    "__v": 1,
    "recentSearchedCities": [
        "New York"
    ]
}

export const hotelDummyData = {
    "_id": "67f76393197ac559e4089b72",
    "name": "Urbanza Suites",
    "address": "Main Road  123 Street , 23 Colony",
    "contact": "+0123456789",
    "owner": userDummyData,
    "city": "New York",
    "createdAt": "2025-04-10T06:22:11.663Z",
    "updatedAt": "2025-04-10T06:22:11.663Z",
    "__v": 0
}

export const restaurantDummyData = {
  "_id": "67f76393197ac559e4089b73",  // unique ID (changed last digit)
  "name": "Le Délice Tozeur",
  "address": "Avenue Habib Bourguiba, 12, Tozeur",
  "contact": "+216 72 123 456",
  "owner": userDummyData,  // link to user dummy data
  "city": "Tozeur",
  "country": "Tunisie",
  "createdAt": "2025-05-01T10:00:00.000Z",
  "updatedAt": "2025-05-01T10:00:00.000Z",
  "__v": 0
};


export const roomsDummyData = [
    {
        "_id": "67f7647c197ac559e4089b96",
        "hotel": hotelDummyData,
        "roomType": "Double Bed",
        "pricePerNight": 399,
        "amenities": ["Room Service", "Mountain View", "Pool Access"],
        "images": [roomImg1, roomImg2, roomImg3, roomImg4],
        "isAvailable": true,
        "createdAt": "2025-04-10T06:26:04.013Z",
        "updatedAt": "2025-04-10T06:26:04.013Z",
        "__v": 0
    },
    {
        "_id": "67f76452197ac559e4089b8e",
        "hotel": hotelDummyData,
        "roomType": "Double Bed",
        "pricePerNight": 299,
        "amenities": ["Room Service", "Mountain View", "Pool Access"],
        "images": [roomImg2, roomImg3, roomImg4, roomImg1],
        "isAvailable": true,
        "createdAt": "2025-04-10T06:25:22.593Z",
        "updatedAt": "2025-04-10T06:25:22.593Z",
        "__v": 0
    },
    {
        "_id": "67f76406197ac559e4089b82",
        "hotel": hotelDummyData,
        "roomType": "Double Bed",
        "pricePerNight": 249,
        "amenities": ["Free WiFi", "Free Breakfast", "Room Service"],
        "images": [roomImg3, roomImg4, roomImg1, roomImg2],
        "isAvailable": true,
        "createdAt": "2025-04-10T06:24:06.285Z",
        "updatedAt": "2025-04-10T06:24:06.285Z",
        "__v": 0
    },
    {
        "_id": "67f763d8197ac559e4089b7a",
        "hotel": hotelDummyData,
        "roomType": "Single Bed",
        "pricePerNight": 199,
        "amenities": ["Free WiFi", "Room Service", "Pool Access"],
        "images": [roomImg4, roomImg1, roomImg2, roomImg3],
        "isAvailable": true,
        "createdAt": "2025-04-10T06:23:36.537Z",
        "updatedAt": "2025-04-10T06:23:36.537Z",
        "__v": 0
    },
]

export const dishesDummyData = [
  {
    _id: "dish1",
    restaurant: restaurantDummyData,
    dishType: "Appetizer",
    name: "Brik à l'œuf",
    description: "A crispy pastry filled with egg, tuna, and capers, deep-fried to perfection.",
    pricePerServing: 6,
    ingredients: ["Egg", "Tuna", "Capers", "Pastry"],
    images: [foodImg1, foodImg2, foodImg3, foodImg4],
    isAvailable: true,
    createdAt: "2025-04-10T06:26:04.013Z",
    updatedAt: "2025-04-10T06:26:04.013Z",
    __v: 0,
  },
  {
    _id: "dish2",
    restaurant: restaurantDummyData,
    dishType: "Main Course",
    name: "Couscous au mouton",
    description: "Steamed semolina with tender lamb, vegetables, and flavorful broth.",
    pricePerServing: 12,
    ingredients: ["Semolina", "Lamb", "Vegetables", "Broth"],
    images: [foodImg3, foodImg2, foodImg3, foodImg4],
    isAvailable: true,
    createdAt: "2025-04-10T06:27:04.013Z",
    updatedAt: "2025-04-10T06:27:04.013Z",
    __v: 0,
  },
  {
    _id: "dish3",
    restaurant: restaurantDummyData,
    dishType: "Main Course",
    name: "Tagine Malsouka",
    description: "Thin pastry layered with meat and vegetables, baked slowly for a rich taste.",
    pricePerServing: 10,
    ingredients: ["Pastry", "Meat", "Vegetables"],
    images: [foodImg3, foodImg2, foodImg3, foodImg4],
    isAvailable: true,
    createdAt: "2025-04-10T06:28:04.013Z",
    updatedAt: "2025-04-10T06:28:04.013Z",
    __v: 0,
  },
  {
    _id: "dish4",
    restaurant: restaurantDummyData,
    dishType: "Main Course",
    name: "Ojja Tunisienne",
    description: "Spicy tomato and pepper stew with eggs and merguez sausage.",
    pricePerServing: 8,
    ingredients: ["Tomato", "Pepper", "Eggs", "Merguez"],
    images: [foodImg4, foodImg2, foodImg3, foodImg4],
    isAvailable: true,
    createdAt: "2025-04-10T06:29:04.013Z",
    updatedAt: "2025-04-10T06:29:04.013Z",
    __v: 0,
  },
  {
    _id: "dish5",
    restaurant: restaurantDummyData,
    dishType: "Dessert",
    name: "Makroudh",
    description: "Semolina pastries filled with date paste and drizzled with honey.",
    pricePerServing: 4,
    ingredients: ["Semolina", "Date Paste", "Honey"],
    images: [foodImg5, foodImg2, foodImg3, foodImg4],
    isAvailable: true,
    createdAt: "2025-04-10T06:30:04.013Z",
    updatedAt: "2025-04-10T06:30:04.013Z",
    __v: 0,
  },
  {
    _id: "dish6",
    restaurant: restaurantDummyData,
    dishType: "Breakfast",
    name: "Shakshuka",
    description: "Poached eggs in a spicy tomato and bell pepper sauce.",
    pricePerServing: 7,
    ingredients: ["Eggs", "Tomato", "Bell Pepper", "Spices"],
    images: [foodImg6, foodImg2, foodImg3, foodImg4],
    isAvailable: true,
    createdAt: "2025-04-10T06:31:04.013Z",
    updatedAt: "2025-04-10T06:31:04.013Z",
    __v: 0,
  },
  {
    _id: "dish7",
    restaurant: restaurantDummyData,
    dishType: "Main Course",
    name: "Harissa Chicken",
    description: "Grilled chicken marinated in spicy harissa sauce served with couscous.",
    pricePerServing: 14,
    ingredients: ["Chicken", "Harissa", "Couscous"],
    images: [foodImg7, foodImg2, foodImg3, foodImg4],
    isAvailable: true,
    createdAt: "2025-04-10T06:32:04.013Z",
    updatedAt: "2025-04-10T06:32:04.013Z",
    __v: 0,
  },
  {
    _id: "dish8",
    restaurant: restaurantDummyData,
    dishType: "Soup",
    name: "Lablabi",
    description: "Chickpea soup served with cumin, garlic, and olive oil, topped with crusty bread.",
    pricePerServing: 5,
    ingredients: ["Chickpeas", "Cumin", "Garlic", "Olive Oil", "Bread"],
    images: [foodImg8, foodImg2, foodImg3, foodImg4],
    isAvailable: true,
    createdAt: "2025-04-10T06:33:04.013Z",
    updatedAt: "2025-04-10T06:33:04.013Z",
    __v: 0,
  },
  {
    _id: "dish9",
    restaurant: restaurantDummyData,
    dishType: "Salad",
    name: "Salade Mechouia",
    description: "Grilled vegetable salad with tomatoes, peppers, and onions, dressed with olive oil.",
    pricePerServing: 6,
    ingredients: ["Tomatoes", "Peppers", "Onions", "Olive Oil"],
    images: [foodImg9, foodImg2, foodImg3, foodImg4],
    isAvailable: true,
    createdAt: "2025-04-10T06:34:04.013Z",
    updatedAt: "2025-04-10T06:34:04.013Z",
    __v: 0,
  },
  {
    _id: "dish10",
    restaurant: restaurantDummyData,
    dishType: "Dessert",
    name: "Baklava",
    description: "Sweet pastry layers filled with nuts and soaked in honey syrup.",
    pricePerServing: 4,
    ingredients: ["Nuts", "Honey", "Pastry"],
    images: [foodImg10, foodImg2, foodImg3, foodImg4],
    isAvailable: true,
    createdAt: "2025-04-10T06:35:04.013Z",
    updatedAt: "2025-04-10T06:35:04.013Z",
    __v: 0,
  },
];
export const eventsData = [
  {
    id: 'evt001',
    title: 'Festival of Date Palm',
    description: 'Celebrate the heritage of Tozeur with music, dance, and local crafts.',
    location: 'Oasis Square, Tozeur',
    date: '2025-07-10T18:00:00.000Z',
    time: '18:00',
    price: 20,
    image: '/images/event-date-palm.jpg',
    attendees: [],
  },
  {
    id: 'evt002',
    title: 'Desert Music Night',
    description: 'Enjoy traditional desert music under the stars.',
    location: 'Al Kabir Park, Tozeur',
    date: '2025-08-05T20:00:00.000Z',
    time: '20:00',
    price: 15,
    image: '/images/event-music-night.jpg',
    attendees: [],
  },
  {
    id: 'evt003',
    title: 'Oasis Art Expo',
    description: 'Showcasing local artists and craftsmen of Tozeur.',
    location: 'Art Gallery Center, Tozeur',
    date: '2025-09-01T10:00:00.000Z',
    time: '10:00',
    price: 10,
    image: '/images/event-art-expo.jpg',
    attendees: [],
  },
];
export const transportData = [
  {
    id: 'bus',
    type: 'Bus',
    image: 'https://res.cloudinary.com/dk9y2o5tl/image/upload/v1750622396/SNTRI_cadaan.jpg', // Use actual image paths
    description: 'Affordable way to travel between cities and towns.'
  },
  {
    id: 'train',
    type: 'Train',
    image: 'https://res.cloudinary.com/dk9y2o5tl/image/upload/v1750622444/1200px-Train_electrique__SNCFT__Sousse_2012_gutlld.jpg',
    description: 'Connects major cities with scenic routes.'
  },
  {
    id: 'taxi',
    type: 'Taxi',
    image: 'https://res.cloudinary.com/dk9y2o5tl/image/upload/v1750622067/IMGBN115416taxi_inyvok.jpg',
    description: 'Flexible and fast local transport option.'
  },
  // ... more if needed
]
 