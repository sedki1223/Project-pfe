// 🚩 Final working roomRouter.js

import express from 'express';
import {
  createRoom,
  getOwnerRooms,
  getRooms,
  toggleRoomAvailability,
  getRoomById
} from '../controllers/roomController.js';
import protect, { requireRole } from '../controllers/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const roomRouter = express.Router();

// Create room (POST /api/rooms/)
roomRouter.post(
  '/create',
  protect,
  requireRole(['hotelOwner']),
  upload.array('images', 4),
  createRoom
);

// Get all available rooms
roomRouter.get('/', getRooms);

// Get all rooms for the owner
roomRouter.get('/owner', protect, requireRole(['hotelOwner']), getOwnerRooms);

// Toggle room availability
roomRouter.post('/toggle-availability', protect, requireRole(['hotelOwner']), toggleRoomAvailability);

// Get a room by ID
roomRouter.get('/:id', getRoomById);

export default roomRouter;