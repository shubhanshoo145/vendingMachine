import { injectable, inject, postConstruct } from 'inversify';

import types from '../../constants/types';
import { IMongooseService, IHttpService } from './application.interfaces';
import { IApplication } from '../../commons/interfaces/services/IApplication';
import { ILoggerService } from '../../commons/interfaces/services/ILoggerService';

@injectable()
export class Application implements IApplication {
  @inject(types.LoggerService) private readonly loggerService: ILoggerService;
  @inject(types.MongooseService) private readonly mongooseService: IMongooseService;
  @inject(types.HttpService) private readonly httpService: IHttpService;

  public async initialize(): Promise<void> {
    try {
      await this.mongooseService.openConnection();
      await this.httpService.initializeServer();

    } catch (error) {
      this.loggerService.error('An error has been encountered while starting-up', { error });
    }
  }

  public gracefulShutdown(error: any): void {
    // Log shutdown
    if (error) {
      this.loggerService.info('A critical unhandled exception was caught', {
        error,
      });
    } else {
      this.loggerService.info('Process received a kill signal');
    }
    this.loggerService.info('Attempting to shutdown gracefully');

    if (!this.httpService.httpServer) {
      this.loggerService.error('HTTP Server start-up failure. Killing process');
      process.exit(1);
    }

    // Close the server for any incoming connection
    this.httpService.httpServer.close((serverError) => {
      // Check if the server has already been closed
      if (serverError) {
        this.loggerService.error('An unexpected error was encounterd during graceful shutdown', {
          serverError,
        });
        process.exit(1);
      } else {
        this.mongooseService.closeConnection(() => {
          this.loggerService.info('Mongoose default connection disconnected due to shutdown');
          this.loggerService.info('Gracefull shutdown success');
          process.exit(0);
        });
      }
    });
  }

  @postConstruct()
  private subscribeToErrors(): void {
    // listen for INT signal e.g. Ctrl-C
    process.on('SIGINT', this.gracefulShutdown.bind(this));
    process.on('uncaughtException', (error) => {
      // tslint:disable-next-line:no-console
      console.log('Uncaught critical exception', {
        message: error.message || '',
        stack: error.stack || '',
      });

      this.loggerService.error('An uncaught exception was caught', {
        message: error.message || '',
        stack: error.stack || '',
      });

      this.gracefulShutdown(error);
    });

    process.on('unhandledRejection', (reason, promise) => {
      // tslint:disable-next-line:no-console
      console.log('Uncaught critical exception', {
        reason: reason || '',
        promise: promise || '',
      });

      this.loggerService.error('An unhandled promise rejection was caught', {
        reason,
        promise,
      });
    });
  }
}