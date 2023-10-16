import { inject, injectable } from 'inversify';
import { Logger } from '../shared/libs/logger/index.js';
import { Config, RestSchema } from '../shared/libs/config/index.js';
import { Component } from '../shared/types/components.enum.js';
import { DatabaseClient } from '../shared/libs/database-client/database-client.interface.js';
import { getMongoURI } from '../shared/helpers/database.js';
import { OfferService } from '../shared/modules/offer/index.js';
// import { UserService } from '../shared/modules/user/index.js';
// import { CommentService } from '../shared/modules/comment/index.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    // @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    // @inject(Component.CommentService) private readonly commentService: CommentService
  ) {}

  private async _initDb() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME')
    );

    return this.databaseClient.connect(mongoUri);
  }

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    this.logger.info('Init database...');
    await this._initDb();
    this.logger.info('Init database complited');

    await this.getExpertiments();
  }

  public async getExpertiments() {
    // Эксперименты
    // const offerById = await this.offerService.findById('652466b0b9e6a61f32d09686');
    // await this.commentService.create({
    //   text: 'Текст комментария 3',
    //   rating: 5,
    //   createdDate: new Date(),
    //   offerId: '652466b0b9e6a61f32d09686',
    //   userId: '652bdaaa0fc216f2bca308ac'
    // });
    const offers = await this.offerService.find(1);
    // const user = await this.userService.findByEmail('president@dka.local');
    // console.log('offer by id', offerById);
    console.log('offers', offers);
    // console.log('user by email', user);
    // console.log('comment', comment);
  }
}
