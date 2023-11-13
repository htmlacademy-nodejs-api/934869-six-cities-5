import {
  BaseController,
  HttpMethod,
  ParseTokenMiddleware,
  PrivateRouteMiddleware,
  ValidateDtoMiddleware
} from '../../libs/rest/index.js';
import { Response } from 'express';
import { inject, injectable } from 'inversify';

import { Config, RestSchema } from '../../libs/config/index.js';
import { Logger } from '../../libs/logger/index.js';
import { fillDTO } from '../../helpers/index.js';
import { Component } from '../../types/index.js';
import { OfferService } from '../offer/index.js';
import { CreateCommentRequest } from './type/create-comment-request.type.js';
import { CommentService } from './comment-service.interface.js';
import { CommentRdo } from './index.js';
import { CreateCommentDto } from './index.js';

@injectable()
export default class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController...');
    this.addRoute({
      path: '/',
      method: HttpMethod.POST,
      handler: this.create,
      middlewares: [
        new ParseTokenMiddleware(this.configService.get('JWT_SECRET')),
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateCommentDto)
      ],
    });
  }

  public async create(
    { body, tokenPayload }: CreateCommentRequest,
    res: Response
  ): Promise<void> {

    const comment = await this.commentService.create({...body, userId: tokenPayload.id });
    await this.offerService.incCommentCount(body.offerId);
    this.created(res, fillDTO(CommentRdo, comment));
  }
}
