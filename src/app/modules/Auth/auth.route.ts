import express from 'express';
import { AuthControllers } from './auth.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.route('/signup').post(AuthControllers.signupUser);

router.route('/signin').post(AuthControllers.signInUser);

router.post('/refresh-token', AuthControllers.refreshToken);

router
  .route('/me')
  .get(auth(USER_ROLE.user, USER_ROLE.admin), AuthControllers.getProfileData);

export const AuthRoutes = router;
