import { injectable, inject } from 'inversify';
import { IConfig } from 'config';
import * as mongoose from 'mongoose';

import types from '../../constants/types';
import container from '../../container';
import { ILoggerService } from '../../commons/interfaces/services/ILoggerService';
import { IApplication } from '../../commons/interfaces/services/IApplication';
import { IMongooseService } from './application.interfaces';
import { IMongooseConfig } from '../../commons/interfaces/config/IMongooseConfig';


@injectable()
export class MongooseService implements IMongooseService {
  @inject(types.LoggerService) private readonly loggerService: ILoggerService;
  
  public connection: mongoose.Connection;

  private dbConfig: IMongooseConfig;
  private connectionOptions: mongoose.ConnectionOptions = {
    autoIndex: false,
    autoReconnect: true,
    reconnectTries: 30,
    reconnectInterval: 1 * 1000,  // each second
    promiseLibrary: Promise,
    poolSize: 10,
    connectTimeoutMS: 60 * 1000,
    socketTimeoutMS: 60 * 1000,
    keepAlive: true,
    keepAliveInitialDelay: 30 * 1000,
    useNewUrlParser: true,
  };

  constructor(@inject(types.Config) config: IConfig) {
    this.dbConfig = config.get('default.mongoose');
  }
  
  public async openConnection(): Promise<void> {
    this.subscribeEvents();

    // Configure replicaset & open connection
    if (this.dbConfig.REPLICA_SET) {
      this.connectionOptions.replicaSet = this.dbConfig.REPLICA_SET;
    }
    const instance = await mongoose.connect(
      this.dbConfig.DB_CONNECTION_STRING,
      this.connectionOptions,
    );
    this.connection = instance.connection;
  }

  public closeConnection(callback: (any: any) => void): void {
    this.connection.close(callback);
  }

  private subscribeEvents(): void {
    mongoose.connection.on('connected', () => {
      this.loggerService.info('Mongoose connection established');
    });

    mongoose.connection.on('disconnected', () => {
      this.loggerService.info('Mongoose connection lost');
    });

    mongoose.connection.on('reconnected', () => {
      this.loggerService.info('Mongoose connection reestablished');
    });

    mongoose.connection.on('error', (error) => {
      this.loggerService.error('Mongoose connection error', {
        error,
      });
    });

    mongoose.connection.on('reconnectFailed', (error) => {
      this.loggerService.error('Mongoose connection reestablishment failed', {
        error,
      });
      container.get<IApplication>(types.Application).gracefulShutdown(error);
    });
  }
}
