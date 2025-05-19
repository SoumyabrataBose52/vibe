import 'reflect-metadata';
import {
  JsonController,
  Authorized,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Params,
  HttpCode,
  OnUndefined,
  BadRequestError,
} from 'routing-controllers';
import {Service, Inject} from 'typedi';
import {CreateQuestionBody} from '../classes/validators/QuestionValidator';
import {BadRequestErrorResponse} from 'shared/middleware/errorHandler';
import {OpenAPI, ResponseSchema} from 'routing-controllers-openapi';
import {QuestionFactory} from '../classes/transformers/Question';
import {QuestionValidationService} from '../services/QuestionValidationService';

@JsonController('/questions')
@Service()
export class QuestionController {
  constructor() {}

  @Authorized(['admin', 'instructor'])
  @Post('/', {transformResponse: true})
  @HttpCode(201)
  @OnUndefined(201)
  async create(@Body() body: CreateQuestionBody) {
    const question = QuestionFactory.createQuestion(body);
    const businessRulesValidator = QuestionValidationService.resolve(question);
    try {
      businessRulesValidator.validateRules(question);
    } catch (error) {
      throw new BadRequestError((error as Error).message);
    }
  }
}
