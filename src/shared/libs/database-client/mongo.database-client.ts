import { inject, injectable } from 'inversify';
import * as Mongoose from 'mongoose';
import { setTimeout } from 'node:timers/promises';

import { Component } from '../../types/component.enum.js';
import { Logger } from '../logger/index.js';
import { RETRY } from './const.js';
import { DatabaseClient } from './database-client.interface.js';

@injectable()
export class MongoDatabaseClient implements DatabaseClient {
  private mongoose: typeof Mongoose;
  private isConnected: boolean = false;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {}

  public isConnectedToDatabase() {
    return this.isConnected;
  }

  public async connect(uri: string): Promise<void> {
    if (this.isConnectedToDatabase()) {
      throw new Error('MongoDb client already connected');
    }

    this.logger.info('Trying to connect to MongoDB');

    let attempt = 0;
    while (attempt < RETRY.COUNT) {
      try {
        this.mongoose = await Mongoose.connect(uri);
        this.isConnected = true;
        this.logger.info('Database connection established.');
        return;
      } catch (error) {
        attempt++;
        this.logger.error(`Failed to connect to database. Attempt ${attempt}`, error as Error);
        await setTimeout(RETRY.TIMEOUT);
      }
    }

    this.logger.info('Database connect established.');
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnectedToDatabase) {
      throw new Error('Not connected to the database');
    }

    await this.mongoose.disconnect?.();
    this.isConnected = false;
    this.logger.info('Database connection closed.');
  }
}
