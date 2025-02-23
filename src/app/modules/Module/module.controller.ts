import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { ModuleService } from './module.service';
import sendResponse from '../../utils/sendResponse';

const createModule = catchAsync(async (req, res) => {
  const result = await ModuleService.createModule(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Module created successfully',
    data: result,
  });
});

const getAllModules = catchAsync(async (req, res) => {
  const result = await ModuleService.getAllModules(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Modules fetched successfully',
    data: result,
  });
});

const getModuleById = catchAsync(async (req, res) => {
  const result = await ModuleService.getModuleById(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Module fetched successfully',
    data: result,
  });
});

const updateModule = catchAsync(async (req, res) => {
  const result = await ModuleService.updateModule(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Module updated successfully',
    data: result,
  });
});

const deleteModule = catchAsync(async (req, res) => {
  const result = await ModuleService.deleteModule(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Module deleted successfully',
    data: result,
  });
});

const getModulesByCourse = catchAsync(async (req, res) => {
  const result = await ModuleService.getModulesByCourse(
    req.user,
    req.params.courseId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Modules fetched successfully',
    data: result,
  });
});

export const ModuleController = {
  createModule,
  getAllModules,
  getModuleById,
  updateModule,
  deleteModule,
  getModulesByCourse
};
