import { Types } from 'mongoose';
import { Content } from './content.model';

export const getNextContentOrder = async (
  moduleId: Types.ObjectId,
): Promise<number> => {
  const highestOrderContent = await Content.findOne({ module: moduleId })
    .sort({ order: -1 })
    .limit(1);

  return highestOrderContent ? highestOrderContent.order + 1 : 1;
};
