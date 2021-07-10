import express from 'express';
import multer from 'multer';

import ProfileController from '../controllers/ProfileController';
import AuthMiddleware from '../middleware/authMiddleware';

const routes = express.Router();

const profileController = new ProfileController();

routes.use(AuthMiddleware)
routes.get("/seguidor", profileController.seguidores);
routes.get("/seguidor/:id", profileController.mostraPerfil);
routes.post("/seguidor/:seguidor", profileController.addSeguidor);
routes.delete("/seguidor/:seguidor", profileController.removeSeguidor);

export default routes;