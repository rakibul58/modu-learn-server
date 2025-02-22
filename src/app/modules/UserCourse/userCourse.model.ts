import { model, Schema } from 'mongoose';
import { IUserCourse } from './userCourse.interface';

const UserCourseSchema = new Schema<IUserCourse>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    enrolledAt: { type: Date, default: Date.now },
    lastAccessedAt: { type: Date, default: Date.now },
    completedContent: [{ type: Schema.Types.ObjectId, ref: 'Content' }],
    completedModules: [{ type: Schema.Types.ObjectId, ref: 'Module' }],
    lastAccessedContent: {
      type: Schema.Types.ObjectId,
      ref: 'Content',
    },
    courseCompletionPercentage: { type: Number, default: 0 },
    moduleProgress: [
      {
        moduleId: { type: Schema.Types.ObjectId, ref: 'Module' },
        completionPercentage: { type: Number, default: 0 },
        lastAccessedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

UserCourseSchema.index({ user: 1, course: 1 }, { unique: true });

export const UserCourse = model<IUserCourse>('UserCourse', UserCourseSchema);
