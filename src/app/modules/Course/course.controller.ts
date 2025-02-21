import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from '../Auth/auth.service';
import catchAsync from '../../utils/catchAsync';

const createCourse = catchAsync(async (req, res) => {
  const result = await AuthServices.registerUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Course created successfully',
    data: result,
  });
});

export const CourseController = {
  createCourse,
};
