import express from 'express';
import multer from 'multer';

import ProfileController from '../controllers/ProfileController';
import AuthMiddleware from '../middleware/authMiddleware';

const routes = express.Router();

const profileController = new ProfileController();

routes.use(AuthMiddleware)
routes.get("/follower", profileController.followers);
routes.get("/follower/:id", profileController.showProfile);
routes.post("/follower/:follower", profileController.addFollower);
routes.delete("/follower/:follower", profileController.removeFollowers);

export default routes;