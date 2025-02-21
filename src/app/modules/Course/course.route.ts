import express from 'express';
import { CourseController } from './course.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router
  .route('/')
  .get(CourseController.getAllCourse)
  .post(auth(USER_ROLE.admin), CourseController.createCourse);

export const CourseRoutes = router;
