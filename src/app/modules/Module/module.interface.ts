import { Types } from 'mongoose';

export interface IModule {
  title: string;
  course: Types.ObjectId;
  content: Types.ObjectId[];
  order: number;
}
