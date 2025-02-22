import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { CourseRoutes } from '../modules/Course/course.route';
import { ModuleRoutes } from '../modules/Module/module.route';
import { ContentRoutes } from '../modules/Content/content.route';

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
  {
    path: '/contents',
    route: ContentRoutes,
  },
];

// lopping through the routes
moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
