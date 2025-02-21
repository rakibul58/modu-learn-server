import { ICourse } from './course.interface';
import { Course } from './course.model';

const createCourse = async (payload: Partial<ICourse>) => {
  const { title, description, price, thumbnail } = payload;
  const course = new Course({ title, description, price, thumbnail });
  const result = await course.save();
  return result;
};

export const CourseService = {
  createCourse,
};
