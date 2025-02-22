import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Module } from '../Module/module.model';
import { IContent } from './content.interface';
import { getNextContentOrder } from './content.utils';
import { Types } from 'mongoose';
import { Content } from './content.model';
import QueryBuilder from '../../builder/QueryBuilder';

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

export const ContentService = {
  createContent,
  getAllContents,
};
