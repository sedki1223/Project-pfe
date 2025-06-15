const RoomData = [
  {
    id: "1",
    name: "Sahara Deluxe Room",
    description: "A cozy room with traditional decor and desert views.",
    price: 80,
    location: "Tozeur, Tunisia",
    images: [
      "https://source.unsplash.com/800x600/?hotel,room,desert",
      "https://source.unsplash.com/800x600/?desert,interior",
      "https://source.unsplash.com/800x600/?tozeur,room",
      "https://source.unsplash.com/800x600/?traditional,room"
    ],
    amenities: ["WiFi", "AC", "Private Bathroom"],
    hotel: {
      name: "Sahara Stay",
      city: "Tozeur",
      address: "123 Desert Rd, Tozeur"
    }
  },
  {
    id: "2",
    name: "Oasis Suite",
    description: "Spacious suite with a view of the oasis and palm trees.",
    price: 120,
    location: "Nefta, Tunisia",
    images: [
      "https://source.unsplash.com/800x600/?resort,room,view",
      "https://source.unsplash.com/800x600/?suite,interior",
      "https://source.unsplash.com/800x600/?nefta,oasis",
      "https://source.unsplash.com/800x600/?luxury,room"
    ],
    amenities: ["WiFi", "AC", "Pool Access", "Breakfast Included"],
    hotel: {
      name: "Palm Oasis Resort",
      city: "Nefta",
      address: "456 Oasis St, Nefta"
    }
  },
  {
    id: "3",
    name: "Starry Night Tent",
    description: "Experience glamping under the stars with modern comforts.",
    price: 95,
    location: "Chott el Jerid, Tunisia",
    images: [
      "https://source.unsplash.com/800x600/?tent,desert,glamping",
      "https://source.unsplash.com/800x600/?night,stars,glamping",
      "https://source.unsplash.com/800x600/?desert,sky",
      "https://source.unsplash.com/800x600/?luxury,tent"
    ],
    amenities: ["WiFi", "Shared Bathroom", "Bonfire Nights"],
    hotel: {
      name: "Desert Stars Camp",
      city: "Chott el Jerid",
      address: "Camp Rd, Chott el Jerid"
    }
  },
  {
    id: "4",
    name: "Kasbah Royal Room",
    description: "Royal-style room in a traditional Kasbah architecture.",
    price: 150,
    location: "Tozeur Medina, Tunisia",
    images: [
      "https://source.unsplash.com/800x600/?kasbah,hotel,room",
      "https://source.unsplash.com/800x600/?kasbah,interior",
      "https://source.unsplash.com/800x600/?royal,room",
      "https://source.unsplash.com/800x600/?tozeur,kasbah"
    ],
    amenities: ["WiFi", "AC", "Private Balcony", "Free Parking"],
    hotel: {
      name: "Royal Kasbah Hotel",
      city: "Tozeur",
      address: "789 Medina Blvd, Tozeur"
    }
  },
  {
    id: "5",
    name: "Berber Stone Room",
    description: "Rustic charm in a hand-built stone guesthouse.",
    price: 70,
    location: "Tamezret, Tunisia",
    images: [
      "https://source.unsplash.com/800x600/?stone,room,berber",
      "https://source.unsplash.com/800x600/?berber,guesthouse",
      "https://source.unsplash.com/800x600/?rustic,room",
      "https://source.unsplash.com/800x600/?tamezret,house"
    ],
    amenities: ["Fan", "Shared Kitchen", "Local Breakfast"],
    hotel: {
      name: "Stone Berber Lodge",
      city: "Tamezret",
      address: "Berber Way, Tamezret"
    }
  },
  {
    id: "6",
    name: "Tozeur Palm Retreat",
    description: "Hidden gem surrounded by palm groves and tranquility.",
    price: 110,
    location: "Tozeur Palmeraie, Tunisia",
    images: [
      "https://source.unsplash.com/800x600/?palm,trees,hotel",
      "https://source.unsplash.com/800x600/?palm,retreat",
      "https://source.unsplash.com/800x600/?tozeur,retreat",
      "https://source.unsplash.com/800x600/?spa,room"
    ],
    amenities: ["WiFi", "AC", "Spa", "Bicycle Rental"],
    hotel: {
      name: "Palm Retreat",
      city: "Tozeur",
      address: "Palm Rd, Tozeur"
    }
  },
  {
    id: "7",
    name: "Luxury Desert Villa",
    description: "Elegant private villa with a pool and panoramic views.",
    price: 220,
    location: "Douz, Tunisia",
    images: [
      "https://source.unsplash.com/800x600/?villa,luxury,desert",
      "https://source.unsplash.com/800x600/?desert,villa,pool",
      "https://source.unsplash.com/800x600/?luxury,interior",
      "https://source.unsplash.com/800x600/?douz,villa"
    ],
    amenities: ["WiFi", "Private Pool", "Full Kitchen", "Driver Available"],
    hotel: {
      name: "Desert Luxury Villa",
      city: "Douz",
      address: "Luxury Villa Rd, Douz"
    }
  },
  {
    id: "8",
    name: "Nomad Eco Lodge",
    description: "Sustainable living in a desert eco-lodge.",
    price: 85,
    location: "Ksar Ghilane, Tunisia",
    images: [
      "https://source.unsplash.com/800x600/?eco,lodge,desert",
      "https://source.unsplash.com/800x600/?nomad,lodge",
      "https://source.unsplash.com/800x600/?desert,eco",
      "https://source.unsplash.com/800x600/?ksarghilane,lodge"
    ],
    amenities: ["Solar Power", "Organic Meals", "Camel Tours"],
    hotel: {
      name: "Nomad Eco Lodge",
      city: "Ksar Ghilane",
      address: "Eco Rd, Ksar Ghilane"
    }
  },
  {
    id: "9",
    name: "Dunes Horizon Cabin",
    description: "Modern cabin nestled among golden dunes.",
    price: 90,
    location: "Sabria, Tunisia",
    images: [
      "https://source.unsplash.com/800x600/?cabin,dunes,sunset",
      "https://source.unsplash.com/800x600/?dunes,cabin",
      "https://source.unsplash.com/800x600/?horizon,sunset",
      "https://source.unsplash.com/800x600/?desert,cabin"
    ],
    amenities: ["WiFi", "Heater", "Sunset Deck"],
    hotel: {
      name: "Dunes Horizon Camp",
      city: "Sabria",
      address: "Dune Edge Rd, Sabria"
    }
  },
  {
    id: "10",
    name: "Traditional Mudbrick Stay",
    description: "Authentic experience in a mudbrick house with art.",
    price: 65,
    location: "Matmata, Tunisia",
    images: [
      "https://source.unsplash.com/800x600/?mud,house,tunisia",
      "https://source.unsplash.com/800x600/?matmata,house",
      "https://source.unsplash.com/800x600/?mudbrick,interior",
      "https://source.unsplash.com/800x600/?traditional,stay"
    ],
    amenities: ["Fan", "Cultural Workshop", "Tea Ceremony"],
    hotel: {
      name: "Matmata Heritage Lodge",
      city: "Matmata",
      address: "Mudbrick Ln, Matmata"
    }
  }
];

export default RoomData;
