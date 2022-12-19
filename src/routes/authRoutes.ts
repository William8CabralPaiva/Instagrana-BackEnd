import express from 'express';
import multer from 'multer';
import multerConfig from '../config/multer';

import AuthController from '../controllers/AuthController';
import { cadastroValidator } from '../validators/myselfValidator';

const authController = new AuthController();

const routes = express.Router();
const upload = multer(multerConfig);

routes.post('/login', authController.login);
routes.get('/random', authController.random);
//! primeiro colocar o multer dps o validator
routes.post('/register', upload.single("image"), cadastroValidator, authController.register);

export default routes;
