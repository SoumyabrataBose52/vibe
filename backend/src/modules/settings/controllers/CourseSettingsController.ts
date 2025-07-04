import {injectable, inject} from 'inversify';
import {
  JsonController,
  Authorized,
  Post,
  HttpCode,
  Body,
  Get,
  Params,
  Put,
} from 'routing-controllers';
import {CourseSettingsService} from '#settings/services/CourseSettingsService.js';
import {
  CourseSettings,
  CreateCourseSettingsBody,
  ReadCourseSettingsParams,
  AddCourseProctoringParams,
  AddCourseProctoringBody,
  RemoveCourseProctoringParams,
  RemoveCourseProctoringBody,
} from '#settings/classes/index.js';
import {BadRequestErrorResponse} from '#shared/middleware/errorHandler.js';
import {SETTINGS_TYPES} from '#settings/types.js';
import { OpenAPI } from 'routing-controllers-openapi';

/**
 * This controller handles course settings operations.
 * It allows creating, reading and updating course settings for proctoring in a course version.
 *
 */

@OpenAPI({
  tags: ['Course Settings'],
})
@injectable()
@JsonController('/settings/courses')
export class CourseSettingsController {
  constructor(
    @inject(SETTINGS_TYPES.CourseSettingsService)
    private readonly courseSettingsService: CourseSettingsService,
  ) {}

  @Authorized()
  @Post('/')
  @HttpCode(201)
  async create(
    @Body() body: CreateCourseSettingsBody,
  ): Promise<CourseSettings> {
    // This method creates course settings for a course.
    // It expects the body to contain the courseId and versionId.
    const courseSettings = new CourseSettings(body);
    const createdSettings =
      await this.courseSettingsService.createCourseSettings(courseSettings);

    // Error handling yet to be implemented
    return createdSettings;
  }

  @Authorized()
  @Get('/:courseId/:versionId')
  @HttpCode(200)
  async get(
    @Params() params: ReadCourseSettingsParams,
  ): Promise<CourseSettings | null> {
    // This method retrives course settings for a specific course and version.
    const {courseId, versionId} = params;

    const courseSettings = await this.courseSettingsService.readCourseSettings(
      courseId,
      versionId,
    );

    // Error handling yet to be implemented

    return courseSettings;
  }

  @Authorized()
  @Put('/:courseId/:versionId/proctoring')
  @HttpCode(200)
  async updateCourseSettings(
    @Params() params: AddCourseProctoringParams,
    @Body() body: AddCourseProctoringBody,
  ): Promise<{success: boolean}> {
    // This method updates proctoring settings for a course version.
    const {courseId, versionId} = params;
    const {detectors} = body;

    const result = await this.courseSettingsService.updateCourseSettings(
      courseId,
      versionId,
      detectors,
    );

    return {success: result};
  }

  // This method removes proctoring settings for a course version.
  // This endpoint is not currently used in the implementation, but it is kept for future use.
  /*
  @Authorized()
  @Delete('/:courseId/:versionId/proctoring')
  @HttpCode(200)
  async removeCourseProctoring(
    @Params() params: RemoveCourseProctoringParams,
    @Body() body: RemoveCourseProctoringBody,
  ): Promise<{success: boolean}> {
    const {courseId, versionId} = params;
    const {detectorName} = body;

    const result = await this.courseSettingsService.removeCourseProctoring(
      courseId,
      versionId,
      detectorName,
    );

    return {success: result};
  }
    */
}
