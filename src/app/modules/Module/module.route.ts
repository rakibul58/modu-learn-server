import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { ModuleController } from './module.controller';

const router = express.Router();

router
  .route('/')
  .get(auth(USER_ROLE.admin), ModuleController.getAllModules)
  .post(auth(USER_ROLE.admin), ModuleController.createModule);

router
  .route('/:id')
  .get(auth(USER_ROLE.admin), ModuleController.getModuleById)
  .put(auth(USER_ROLE.admin), ModuleController.updateModule)
  .delete(auth(USER_ROLE.admin), ModuleController.deleteModule);

router
  .route('/course/:courseId')
  .get(auth(USER_ROLE.admin, USER_ROLE.user), ModuleController.getModulesByCourse);

export const ModuleRoutes = router;
