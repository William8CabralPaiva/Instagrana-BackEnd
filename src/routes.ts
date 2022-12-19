import express from 'express';
import multer from 'multer';
//import { storeValidator } from './validators/PointsValidator';

import follower from './routes/profileRoutes'
import authRoutes from './routes/authRoutes'
import feedRoutes from './routes/feedRoutes'
import storyRoutes from './routes/storyRoutes'

const routes = express.Router();

routes.use(authRoutes)
routes.use(follower)
routes.use(feedRoutes)
routes.use(storyRoutes)

export default routes;
