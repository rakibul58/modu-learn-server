import { Types } from "mongoose";

export interface IContent {
  title: string;
  type: 'video' | 'richText';
  module:Types.ObjectId;
  order: number;
  data: {
    videoUrl?: string;
    richText?: string;
    duration?: number;
  };
}
