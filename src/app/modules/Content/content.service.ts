import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Module } from '../Module/module.model';
import { IContent } from './content.interface';
import { getNextContentOrder } from './content.utils';
import { Types } from 'mongoose';
import { Content } from './content.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { JwtPayload } from 'jsonwebtoken';
import { UserCourse } from '../UserCourse/userCourse.model';

const createContent = async (payload: Partial<IContent>) => {
  const { title, type, data, module: moduleId } = payload;

  const module = await Module.findById(moduleId);
  if (!module) {
    return new AppError(httpStatus.NOT_FOUND, 'Module not found');
  }

  // Auto-increment order
  const nextOrder = await getNextContentOrder(new Types.ObjectId(moduleId));

  const content = new Content({
    title,
    type,
    module: moduleId,
    order: nextOrder,
    data,
  });

  const result = await content.save();

  // Add content to module
  module.content.push(content._id);
  await module.save();

  return result;
};

const getAllContents = async (query: Record<string, unknown>) => {
  const contentQuery = new QueryBuilder(
    Content.find().populate('module'),
    query,
  )
    .search(['title'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const [result, meta] = await Promise.all([
    contentQuery.modelQuery,
    contentQuery.countTotal(),
  ]);

  if (!result.length) {
    throw new AppError(httpStatus.NOT_FOUND, 'No Contents found');
  }
  return { result, meta };
};

const getContentById = async (user: JwtPayload, id: string) => {
  const content = await Content.findById(id);
  if (!content) {
    throw new AppError(httpStatus.NOT_FOUND, 'Content not found');
  }
  if (user.role === 'user') {
    const module = await Module.findById(content.module);
    if (!module) {
      throw new AppError(httpStatus.NOT_FOUND, 'Module not found');
    }
    const isEnrolled = await UserCourse.findOne({
      user: user._id,
      course: module.course,
    });
    if (!isEnrolled) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are not enrolled in this course',
      );
    }

    return await Content.findById(id).populate('module');
  }

  return await Content.findById(id).populate('module');
};

const updateContent = async (id: string, payload: Partial<IContent>) => {
  const content = await Content.findById(id);
  if (!content) {
    throw new AppError(httpStatus.NOT_FOUND, 'Content not found');
  }
  const result = await Content.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteContent = async (id: string) => {
  const content = await Content.findById(id);
  if (!content) {
    throw new AppError(httpStatus.NOT_FOUND, 'Content not found');
  }
  const result = await Content.findByIdAndDelete(id);
  return result;
};

const getContentByModule = async (user: JwtPayload, moduleId: string) => {
  const module = await Module.findById(moduleId);
  if (!module) {
    throw new AppError(httpStatus.NOT_FOUND, 'Module not found');
  }

  if (user.role === 'user') {
    const isEnrolled = await UserCourse.findOne({
      user: user._id,
      course: module.course,
    });
    if (!isEnrolled) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are not enrolled in this course',
      );
    }

    return await Content.find({ module: moduleId }).populate('module');
  }

  return await Content.find({ module: moduleId }).populate('module');
};

export const ContentService = {
  createContent,
  getAllContents,
  getContentById,
  updateContent,
  deleteContent,
  getContentByModule,
};
