import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Course } from '../Course/course.model';
import { IModule } from './module.interface';
import { getNextModuleOrder } from './module.utlis';
import { Types } from 'mongoose';
import { Module } from './module.model';
import QueryBuilder from '../../builder/QueryBuilder';

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
    .search(['title', 'description'])
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

export const ModuleService = {
  createModule,
  getAllModules,
};
