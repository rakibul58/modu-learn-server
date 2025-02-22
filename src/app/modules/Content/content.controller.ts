import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ContentService } from './content.service';

const createContent = catchAsync(async (req, res) => {
  const result = await ContentService.createContent(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Content created successfully',
    data: result,
  });
});

const getAllContents = catchAsync(async (req, res) => {
  const result = await ContentService.getAllContents(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Contents fetched successfully',
    data: result,
  });
});

export const ContentController = {
  createContent,
  getAllContents,
};
