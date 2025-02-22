import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { CourseRoutes } from '../modules/Course/course.route';
import { ModuleRoutes } from '../modules/Module/module.route';

const router = Router();

// All the routes in the project
const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/courses',
    route: CourseRoutes,
  },
  {
    path: '/modules',
    route: ModuleRoutes,
  },
];

// lopping through the routes
moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
