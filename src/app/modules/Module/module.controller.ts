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

export const ModuleController = {
  createModule,
  getAllModules,
};
