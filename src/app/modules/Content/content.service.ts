import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Module } from '../Module/module.model';
import { IContent } from './content.interface';
import { getNextContentOrder, updateProgress } from './content.utils';
import { Types } from 'mongoose';
import { Content } from './content.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { JwtPayload } from 'jsonwebtoken';
import { UserCourse } from '../UserCourse/userCourse.model';
import { USER_ROLE } from '../User/user.constant';
import { Course } from '../Course/course.model';

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

const checkContentAccess = async (user: JwtPayload, contentId: string) => {
  const userId = user._id;
  if (user.role === USER_ROLE.admin) {
    return { canAccess: true };
  }

  const content = await Content.findById(contentId);
  if (!content) {
    return { canAccess: false };
  }

  const module = await Module.findById(content.module);
  if (!module) {
    return { canAccess: false };
  }

  const userCourse = await UserCourse.findOne({
    user: userId,
    course: module.course,
  });

  if (!userCourse) {
    return {
      canAccess: false,
    };
  }

  const moduleContent = await Content.find({ module: module._id }).sort({
    order: 1,
  });

  if (moduleContent[0]._id.equals(contentId)) {
    return { canAccess: true };
  }

  const contentIndex = moduleContent.findIndex(c => c._id.equals(contentId));
  if (contentIndex <= 0) {
    return { canAccess: true };
  }

  const previousContent = moduleContent[contentIndex - 1];

  const hasCompletedPrevious = userCourse.completedContent.some(id =>
    id.equals(previousContent._id),
  );

  return { canAccess: hasCompletedPrevious };
};

const updateUserProgress = async (user: JwtPayload, contentId: string) => {
  const content = await Content.findById(contentId);
  if (!content) {
    throw new AppError(httpStatus.NOT_FOUND, 'Content not found');
  }

  const progress = await updateProgress(
    user._id,
    new Types.ObjectId(contentId),
  );

  if (!progress) {
    throw new AppError(httpStatus.NOT_FOUND, 'Progress not found');
  }

  return progress;
};

const getUserProgress = async (user: JwtPayload, courseId: string) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }

  const progress = await UserCourse.findOne({
    user: user._id,
    course: courseId,
  });

  if (!progress) {
    throw new AppError(httpStatus.NOT_FOUND, 'Progress not found');
  }

  return progress;
};

export const ContentService = {
  createContent,
  getAllContents,
  getContentById,
  updateContent,
  deleteContent,
  getContentByModule,
  checkContentAccess,
  updateUserProgress,
  getUserProgress,
};
