import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { ICourse } from './course.interface';
import { Course } from './course.model';
import { JwtPayload } from 'jsonwebtoken';
import { UserCourse } from '../UserCourse/userCourse.model';
import { Module } from '../Module/module.model';

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

const getUserCourses = async (user: JwtPayload) => {
  const courses = await UserCourse.find({ user: user._id })
    .populate('course')
    .sort({ lastAccessedAt: -1 });
  return courses;
};

const enrollCourse = async (courseId: string, user: JwtPayload) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }
  const existingEnrollment = await UserCourse.findOne({
    user: user._id,
    course: courseId,
  });

  if (existingEnrollment) {
    return new AppError(httpStatus.BAD_REQUEST, 'Course already enrolled');
  }

  const modules = await Module.find({ course: courseId });
  const moduleProgress = modules.map(module => ({
    moduleId: module._id,
    completionPercentage: 0,
    lastAccessedAt: new Date(),
  }));

  const userCourse = new UserCourse({
    user: user._id,
    course: courseId,
    completedContent: [],
    completedModules: [],
    moduleProgress,
    courseCompletionPercentage: 0,
  });

  const result = await userCourse.save();

  return result;
};

export const CourseService = {
  createCourse,
  getAllCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
  getUserCourses,
  enrollCourse,
};
