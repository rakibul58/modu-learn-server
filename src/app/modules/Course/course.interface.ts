import { Types } from 'mongoose';

export interface ICourse {
  title: string;
  description: string;
  modules: Types.ObjectId[];
  thumbnail: string;
  price: number;
}
