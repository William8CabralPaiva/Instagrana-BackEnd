import express from 'express';
import multer from 'multer';
import multerConfig from '../config/multer';

import AuthController from '../controllers/AuthController';
import AuthMiddleware from '../middleware/authMiddleware';
import { cadastroValidator } from '../validators/myselfValidator';

const authController = new AuthController();

const routes = express.Router();
const upload = multer(multerConfig);

routes.post('/login', authController.login);
routes.get('/random', authController.random);
//! primeiro colocar o multer dps o validator
routes.post('/cadastrar', upload.single("image"), cadastroValidator, authController.cadastrar);

export default routes;
