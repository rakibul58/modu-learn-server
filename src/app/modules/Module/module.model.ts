import { model, Schema } from 'mongoose';
import { IModule } from './module.interface';

const moduleSchema = new Schema<IModule>(
  {
    title: { type: String, required: true },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    content: [{ type: Schema.Types.ObjectId, ref: 'Content' }],
    order: { type: Number, required: true },
  },
  { timestamps: true },
);

export const Module = model<IModule>('Module', moduleSchema);
