import express from 'express';
import multer from 'multer';
import multerConfig from '../config/multer';

import FeedController from '../controllers/FeedController';
import AuthMiddleware from '../middleware/authMiddleware';

const routes = express.Router();
const upload = multer(multerConfig);

const feedController = new FeedController();

routes.use(AuthMiddleware)
routes.get("/feed", feedController.myFeed);
routes.get("/feed/general", feedController.feedFollowers);
routes.post("/feed", upload.array("image"), feedController.addFeed);//validar;

//salvar name do arquivo no banco só o name
//url pode mudar
//tentar salvar varias
//colocar imagem name
//validar campos

export default routes;
