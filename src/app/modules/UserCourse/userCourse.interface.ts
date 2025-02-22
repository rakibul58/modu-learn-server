import { Types } from 'mongoose';

export interface IUserCourse {
  user: Types.ObjectId;
  course: Types.ObjectId;
  enrolledAt: Date;
  lastAccessedAt: Date;
  completedContent: Types.ObjectId[];
  completedModules: Types.ObjectId[];
  lastAccessedContent: Types.ObjectId;
  courseCompletionPercentage: number;
  moduleProgress: {
    moduleId: Types.ObjectId;
    completionPercentage: number;
    lastAccessedAt: Date;
  }[];
}
