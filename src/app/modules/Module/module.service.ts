import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Course } from '../Course/course.model';
import { IModule } from './module.interface';
import { getNextModuleOrder } from './module.utlis';
import { Types } from 'mongoose';
import { Module } from './module.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { JwtPayload } from 'jsonwebtoken';
import { UserCourse } from '../UserCourse/userCourse.model';

const createModule = async (payload: Partial<IModule>) => {
  const { title, course: courseId } = payload;

  const course = await Course.findById(courseId);
  if (!course) {
    return new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Auto-increment order
  const nextOrder = await getNextModuleOrder(new Types.ObjectId(courseId));

  const module = new Module({
    title,
    course: courseId,
    order: nextOrder,
  });

  const result = await module.save();

  // Add module to course
  course.modules.push(module._id);
  await course.save();

  return result;
};

const getAllModules = async (query: Record<string, unknown>) => {
  const moduleQuery = new QueryBuilder(Module.find().populate('course'), query)
    .search(['title'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const [result, meta] = await Promise.all([
    moduleQuery.modelQuery,
    moduleQuery.countTotal(),
  ]);

  if (!result.length) {
    throw new AppError(httpStatus.NOT_FOUND, 'No Modules found');
  }
  return { result, meta };
};

const getModuleById = async (id: string) => {
  const module = await Module.findById(id).populate('course');
  if (!module) {
    throw new AppError(httpStatus.NOT_FOUND, 'Module not found');
  }
  return module;
};

const updateModule = async (id: string, payload: Partial<IModule>) => {
  const module = await Module.findById(id);
  if (!module) {
    throw new AppError(httpStatus.NOT_FOUND, 'Module not found');
  }
  const result = await Module.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteModule = async (id: string) => {
  const module = await Module.findById(id);
  if (!module) {
    throw new AppError(httpStatus.NOT_FOUND, 'Module not found');
  }
  const result = await Module.findByIdAndDelete(id);
  return result;
};

const getModulesByCourse = async (user: JwtPayload, courseId: string) => {
  if (user.role === 'user') {
    const isEnrolled = await UserCourse.findOne({
      user: user._id,
      course: courseId,
    });
    if (!isEnrolled) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not enrolled');
    }

    const modules = await Module.find({ course: courseId }).populate('course');
    return modules;
  }

  const modules = await Module.find({ course: courseId }).populate('course');
  return modules;
};

export const ModuleService = {
  createModule,
  getAllModules,
  getModuleById,
  updateModule,
  deleteModule,
  getModulesByCourse,
};
