import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { CourseService } from './course.service';

const createCourse = catchAsync(async (req, res) => {
  const result = await CourseService.createCourse(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Course created successfully',
    data: result,
  });
});

const getAllCourse = catchAsync(async (req, res) => {
  const result = await CourseService.getAllCourse(req.query);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Courses Fetched successfully',
    data: result,
  });
});

const getCourseById = catchAsync(async (req, res) => {
  const result = await CourseService.getCourseById(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Course Fetched successfully',
    data: result,
  });
});

const updateCourse = catchAsync(async (req, res) => {
  const result = await CourseService.updateCourse(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Course updated successfully',
    data: result,
  });
});

const deleteCourse = catchAsync(async (req, res) => {
  const result = await CourseService.deleteCourse(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Course deleted successfully',
    data: result,
  });
});

const getUserCourses = catchAsync(async (req, res) => {
  const result = await CourseService.getUserCourses(req.user);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Courses Fetched successfully',
    data: result,
  });
});

const enrollCourse = catchAsync(async (req, res) => {
  const result = await CourseService.enrollCourse(req.params.courseId, req.user);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Course enrolled successfully',
    data: result,
  });
});

export const CourseController = {
  createCourse,
  getAllCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
  getUserCourses,
  enrollCourse
};
