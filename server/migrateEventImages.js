// migrateEventImages.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from './models/Events.js'; // Adjust the path to your Event model

dotenv.config();

async function migrateImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    const events = await Event.find();

    let updatedCount = 0;

    for (const event of events) {
  console.log('Event:', event._id);
  console.log('imageUrl:', event.imageUrl);
  console.log('images:', event.images);
  console.log('image:', event.image);
  
  if (!event.imageUrl || event.imageUrl.length === 0) {
    if (event.images && event.images.length > 0) {
      event.imageUrl = event.images;
      await event.save();
      updatedCount++;
    } else if (typeof event.image === 'string' && event.image.trim() !== '') {
      event.imageUrl = [event.image];
      await event.save();
      updatedCount++;
    } else {
      event.imageUrl = [];
      await event.save();
    }
  }
}
    

    console.log(`Migration completed. ${updatedCount} events updated.`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrateImages();

