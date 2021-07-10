import express from 'express';
import multer from 'multer';
import multerConfig from '../config/multer';

import FeedController from '../controllers/FeedController';
import AuthMiddleware from '../middleware/authMiddleware';

const routes = express.Router();
const upload = multer(multerConfig);

const feedController = new FeedController();

routes.use(AuthMiddleware)
routes.get("/feed", feedController.feedPessoal);
routes.get("/feed/geral", feedController.feedSeguidores);
routes.post("/feed", upload.array("image"), feedController.addFeed);//validar;

//salvar nome do arquivo no banco só o nome
//url pode mudar
//tentar salvar varias
//colocar imagem name
//validar campos

export default routes;
