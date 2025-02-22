import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { ModuleController } from './module.controller';

const router = express.Router();

router
  .route('/')
  .get(auth(USER_ROLE.admin), ModuleController.getAllModules)
  .post(auth(USER_ROLE.admin), ModuleController.createModule);

export const ModuleRoutes = router;
