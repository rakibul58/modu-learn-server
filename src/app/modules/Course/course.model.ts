import { model, Schema } from 'mongoose';
import { ICourse } from './course.interface';

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    modules: [{ type: Schema.Types.ObjectId, ref: 'Module' }],
    price: {
      type: Number,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Course = model<ICourse>('Course', courseSchema);
