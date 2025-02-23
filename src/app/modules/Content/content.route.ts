import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { ContentController } from './content.controller';

const router = express.Router();

router
  .route('/')
  .get(auth(USER_ROLE.admin), ContentController.getAllContents)
  .post(auth(USER_ROLE.admin), ContentController.createContent);

router
  .route('/:id')
  .get(auth(USER_ROLE.admin, USER_ROLE.user), ContentController.getContentById)
  .put(auth(USER_ROLE.admin), ContentController.updateContent)
  .delete(auth(USER_ROLE.admin), ContentController.deleteContent);

router
  .route('/module/:moduleId')
  .get(
    auth(USER_ROLE.admin, USER_ROLE.user),
    ContentController.getContentByModule,
  );

export const ContentRoutes = router;
