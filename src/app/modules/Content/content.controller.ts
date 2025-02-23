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

const getContentById = catchAsync(async (req, res) => {
  const result = await ContentService.getContentById(req.user, req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Content fetched successfully',
    data: result,
  });
});

const updateContent = catchAsync(async (req, res) => {
  const result = await ContentService.updateContent(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Content updated successfully',
    data: result,
  });
});

const deleteContent = catchAsync(async (req, res) => {
  const result = await ContentService.deleteContent(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Content deleted successfully',
    data: result,
  });
});

const getContentByModule = catchAsync(async (req, res) => {
  const result = await ContentService.getContentByModule(
    req.user,
    req.params.moduleId,
  );

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
  getContentById,
  updateContent,
  deleteContent,
  getContentByModule,
};
