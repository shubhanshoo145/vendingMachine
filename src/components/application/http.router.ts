import { injectable, postConstruct, inject } from 'inversify';
import { Express, Router } from 'express';

import healtcheckController from './../../web/endpoints/healtcheck.controller';
import types from '../../constants/types';
import { IMiddlewareProvider } from '../../commons/interfaces/middleware/IMiddlewareProvider';
import { IHttpRouter } from "./application.interfaces";
import productController from '../../web/endpoints/product.controller';
import vendingController from '../../web/endpoints/vending.controller';

@injectable()
export class HttpRouter implements IHttpRouter {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  public register(webServer: Express): void {
    webServer.use('/api/v1', this.router);
  }

  @postConstruct()
  private initializeRoutes(): void {
    healtcheckController(this.router);
    productController(this.router);
    vendingController(this.router);
  }
}