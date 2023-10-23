import {
  BaseController,
  HttpMethod,
  ValidateDtoMiddleware,
  DocumentExistsMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { Logger } from '../../libs/logger/index.js';
import { fillDTO } from '../../helpers/common.js';
import { Component } from '../../types/index.js';
import { CommentRdo, CommentService } from '../comment/index.js';
import { DEFAULT_PREMIUM_OFFER_COUNT, DEFAULT_OFFER_COUNT } from './const/offer.constant.js';
import { ParamOfferId, ParamCity, UpdateOfferDto } from './index.js';
import { OfferRdo, FullOfferRdo } from './index.js';
import { CreateOfferDto } from './index.js';
import { OfferService } from './offer-service.interface.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController..');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateOfferDto)]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({ path: '/premium/:city', method: HttpMethod.Get, handler: this.getPremium });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find(DEFAULT_OFFER_COUNT);
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async create(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const result = await this.offerService.create(body);
    const offer = await this.offerService.findById(result.id);
    this.created(res, fillDTO(FullOfferRdo, offer));
  }

  public async show({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);
    this.ok(res, fillDTO(FullOfferRdo, offer));
  }

  public async delete({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const offer = await this.offerService.deleteById(params.offerId);
    this.noContent(res, offer);
  }

  public async update({ body, params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const updatedOffer = await this.offerService.updateById(params.offerId, body);
    this.ok(res, fillDTO(FullOfferRdo, updatedOffer));
  }

  public async getComments({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }

  public async getPremium({ params }: Request<ParamCity>, res: Response): Promise<void> {
    const premiumOffers = await this.offerService.findPremimByCity(params.city, DEFAULT_PREMIUM_OFFER_COUNT);
    this.ok(res, fillDTO(OfferRdo, premiumOffers));
  }
}
