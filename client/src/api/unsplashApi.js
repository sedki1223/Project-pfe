// src/api/unsplashApi.js

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY; // your env key

export const searchPhotos = async (query) => {
  if (!query) return [];

  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch photos from Unsplash');

    const data = await res.json();
    return data.results.map(photo => ({
      id: photo.id,
      urlSmall: photo.urls.small,
      urlRegular: photo.urls.regular,
      altDescription: photo.alt_description,
      userName: photo.user.name,
      userLink: photo.user.links.html,
    }));
  } catch (error) {
    console.error('Unsplash API error:', error);
    return [];
  }
};
