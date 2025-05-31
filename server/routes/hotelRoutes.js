import express from 'express';
import Hotel from '../models/Hotel';

const hotelRouter = express.Router();

hotelRouter.get('/', protect, registerHotel);

export default hotelRouter;

