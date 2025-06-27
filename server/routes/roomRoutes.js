import express from 'express';
import { createRoom, getOwnerRooms, getRooms, toggleRoomAvailability, getRoomById  } from '../controllers/roomController.js';
import { requireRole } from '../controllers/authMiddleware.js';

const roomRouter = express.Router();

roomRouter.post('/create', createRoom);
roomRouter.get('/', getRooms)
roomRouter.get('/owner', requireRole(["hotelOwner"]), getOwnerRooms)
roomRouter.post('/toggle-availability',  toggleRoomAvailability)
roomRouter.get('/:id', getRoomById);
export default roomRouter;

