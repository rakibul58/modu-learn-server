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
  const courseQuery = new QueryBuilder(Course.find(), query)
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
    throw new AppError(httpStatus.NOT_FOUND, 'No Course found');
  }
  return { result, meta };
};

const getCourseById = async (id: string) => {
  const course = await Course.findById(id).populate('modules');
  if (!course) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }
  return course;
};

const updateCourse = async (id: string, payload: Partial<ICourse>) => {
  const course = await Course.findById(id);
  if (!course) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }
  const result = await Course.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteCourse = async (id: string) => {
  const course = await Course.findById(id);
  if (!course) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }
  const result = await Course.findByIdAndDelete(id);
  return result;
};

export const CourseService = {
  createCourse,
  getAllCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
};
