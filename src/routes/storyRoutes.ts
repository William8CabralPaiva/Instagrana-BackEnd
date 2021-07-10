import express from 'express';
import multer from 'multer';
import multerConfig from '../config/multer';

import StoryController from '../controllers/StoryController';
import AuthMiddleware from '../middleware/authMiddleware';

const routes = express.Router();
const upload = multer(multerConfig);

const storyController = new StoryController();

routes.use(AuthMiddleware)
routes.post("/story", upload.single("image"), storyController.addStory);
routes.get("/story/my", storyController.showMyStory);
routes.get("/story", storyController.showStory);//validar;
routes.get("/story/teste", storyController.teste);//validar;


export default routes;
