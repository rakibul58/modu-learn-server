import { model, Schema } from 'mongoose';
import { IContent } from './content.interface';

const contentSchema = new Schema<IContent>(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ['video', 'richText'], required: true },
    module: { type: Schema.Types.ObjectId, ref: 'Module', required: true },
    order: { type: Number, required: true },
    data: {
      videoUrl: { type: String },
      richText: { type: String },
      duration: { type: Number },
    },
  },
  { timestamps: true },
);

export const Content = model<IContent>('Content', contentSchema);
