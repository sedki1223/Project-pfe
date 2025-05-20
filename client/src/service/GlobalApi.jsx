import axios from "axios";

const BASE_URL = `https://places.googleapis.com/v1/places:searchText?key=${import.meta.env.VITE_GOOGLE_PLACE_ID}`;

const config = {
  headers: {
    'Content-Type': 'application/json',
    'X-Goog-FieldMask': [
      'places.photos',
      'places.displayName',
      'places.id'
    ].join(',')  // join into string if needed
  }
};

export const GetPlaceDetails = (data) => axios.post(BASE_URL, data, config);

export const PHOTO_REF_URL = `https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key=${import.meta.env.VITE_GOOGLE_PLACE_ID}`;
