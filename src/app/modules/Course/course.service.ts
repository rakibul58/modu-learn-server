import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { ICourse } from './course.interface';
import { Course } from './course.model';

const createCourse = async (payload: Partial<ICourse>) => {
  const { title, description, price, thumbnail } = payload;
  const course = new Course({ title, description, price, thumbnail });
  const result = await course.save();
  return result;
};

const getAllCourse = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(Course.find().populate('Module'), query)
    .search(['title', 'description'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const [result, meta] = await Promise.all([
    courseQuery.modelQuery,
    courseQuery.countTotal(),
  ]);

  if (!result.length) {
    throw new AppError(httpStatus.NOT_FOUND, 'No bookings found');
  }
  return { result, meta };
};

export const CourseService = {
  createCourse,
  getAllCourse,
};
