import { Types } from 'mongoose';
import { Content } from './content.model';
import { Module } from '../Module/module.model';
import { Course } from '../Course/course.model';
import { UserCourse } from '../UserCourse/userCourse.model';

export const getNextContentOrder = async (
  moduleId: Types.ObjectId,
): Promise<number> => {
  const highestOrderContent = await Content.findOne({ module: moduleId })
    .sort({ order: -1 })
    .limit(1);

  return highestOrderContent ? highestOrderContent.order + 1 : 1;
};

export const  updateProgress = async (userId: Types.ObjectId, contentId: Types.ObjectId) => {
  const content = await Content.findById(contentId);
  if (!content) return null;
  
  const module = await Module.findById(content.module);
  if (!module) return null;
  
  const course = await Course.findById(module.course);
  if (!course) return null;

  const userCourse = await UserCourse.findOne({
    user: userId,
    course: course._id
  });

  if (!userCourse) {
    return null;
  }

  if (!userCourse.completedContent.includes(contentId)) {
    userCourse.completedContent.push(contentId);
  }
  userCourse.lastAccessedContent = contentId;
  userCourse.lastAccessedAt = new Date();

  const moduleContent = await Content.find({ module: module._id });
  const completedModuleContent = userCourse.completedContent.filter(id => 
    moduleContent.some(content => content._id.equals(id))
  ).length;
  
  const moduleCompletionPercentage = Math.round((completedModuleContent / moduleContent.length) * 100);

  const moduleProgressIndex = userCourse.moduleProgress.findIndex(
    mp => mp.moduleId.equals(module._id)
  );

  if (moduleProgressIndex >= 0) {
    userCourse.moduleProgress[moduleProgressIndex].completionPercentage = moduleCompletionPercentage;
    userCourse.moduleProgress[moduleProgressIndex].lastAccessedAt = new Date();
  }

  if (moduleCompletionPercentage === 100 && !userCourse.completedModules.includes(module._id)) {
    userCourse.completedModules.push(module._id);
  }

  const totalModules = course.modules.length;
  const completedModules = userCourse.completedModules.length;
  userCourse.courseCompletionPercentage = Math.round((completedModules / totalModules) * 100);

  await userCourse.save();
  return userCourse;
};