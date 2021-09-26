import { IConfig } from 'config';
import * as express from 'express';
import { Server } from 'http';
import { injectable, inject } from 'inversify';

import types from '../../constants/types';
import { ILoggerService } from '../../commons/interfaces/services/ILoggerService';
import { IHttpService, IHttpRouter } from './application.interfaces';
import { IMiddlewareProvider } from '../../commons/interfaces/middleware/IMiddlewareProvider';
import { IHttpServerConfig } from '../../commons/interfaces/config/IHttpServerConfig';

@injectable()
export class HttpService implements IHttpService {
  @inject(types.LoggerService) private readonly loggerService: ILoggerService;
  @inject(types.HttpRouter) private readonly httpRouter: IHttpRouter;
  @inject(types.ErrorMiddleware) private readonly errorMiddleware: IMiddlewareProvider;
  @inject(types.BasicMiddleware) private readonly basicMiddleware: IMiddlewareProvider;

  public webServer: express.Express;
  public httpServer: Server;

  private httpServerConfig: IHttpServerConfig;

  constructor(@inject(types.Config) config: IConfig) {
    this.httpServerConfig = config.get('default.httpServer');
  }

  public async initializeServer(): Promise<void> {
    this.webServer = express();
    this.webServer.disable('x-powered-by');

    // Register routes & middlewares
    this.basicMiddleware.register(this.webServer);
    this.httpRouter.register(this.webServer);
    this.errorMiddleware.register(this.webServer);

    this.httpServer = new Server(this.webServer);
    this.httpServer.setTimeout(this.httpServerConfig.REQUEST_TIMEOUT);
    this.httpServer.keepAliveTimeout = this.httpServerConfig.KEEPALIVE_TIMEOUT;

    try {
      this.httpServer.listen(this.httpServerConfig.PORT, () => {
        this.loggerService.info('HTTP server up and running', {
          port: this.httpServerConfig.PORT,
          env: process.env.NODE_ENV,
        });
  
        // Report server ready
        // This code will only run properly in PM2 or on children processes.
        // Requires --wait-ready flag to work
        if (process.send) {
          process.send('ready');
        }
      });
    } catch (err) {
      this.loggerService.error('Error while starting HTTP server', {
        port: this.httpServerConfig.PORT,
        env: process.env.NODE_ENV,
        error: err,
      });
    }
  }
}
