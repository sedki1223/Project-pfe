import express from 'express';
import upload from '../middleware/uploadMiddleware.js'; // your multer middleware
import {
  createRoom,
  getOwnerRooms,
  getRooms,
  toggleRoomAvailability,
  getRoomById
} from '../controllers/roomController.js';
import protect from '../controllers/authMiddleware.js';
import { requireRole } from '../controllers/authMiddleware.js';

const roomRouter = express.Router();

// Add multer middleware here, expecting up to 4 images with field name "images"
roomRouter.post('/create', protect, upload.array('images', 4), createRoom);

roomRouter.get('/', getRooms);
roomRouter.get('/owner', protect, requireRole(["hotelOwner"]), getOwnerRooms);
roomRouter.post('/toggle-availability', protect, requireRole(["hotelOwner"]), toggleRoomAvailability);
roomRouter.get('/:id', getRoomById);

export default roomRouter;
