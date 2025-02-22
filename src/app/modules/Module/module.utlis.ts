import { Types } from 'mongoose';
import { Module } from './module.model';

export const getNextModuleOrder = async (
  courseId: Types.ObjectId,
): Promise<number> => {
  const highestOrderModule = await Module.findOne({ course: courseId })
    .sort({ order: -1 })
    .limit(1);

  return highestOrderModule ? highestOrderModule.order + 1 : 1;
};
