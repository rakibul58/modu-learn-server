import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { ContentController } from './content.controller';

const router = express.Router();

router
  .route('/')
  .get(auth(USER_ROLE.admin), ContentController.getAllContents)
  .post(auth(USER_ROLE.admin), ContentController.createContent);

export const ContentRoutes = router;
