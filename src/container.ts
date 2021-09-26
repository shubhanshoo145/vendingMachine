import { Container } from 'inversify';
import { Model } from 'mongoose';
import * as config from 'config';

const container = new Container({ defaultScope: 'Singleton' });

import types from './constants/types';

import { Application } from './components/application/application';
import { MongooseService } from './components/application/mongoose.service';
import { IApplication } from './commons/interfaces/services/IApplication';
import { IMongooseService, IHttpService, IHttpRouter } from './components/application/application.interfaces';
import { ILoggerService } from './commons/interfaces/services/ILoggerService';
import { LoggerService } from './components/logging/services/logger.service';
import { HttpService } from './components/application/http.service';
import { HttpRouter } from './components/application/http.router';
import { IMiddlewareProvider } from './commons/interfaces/middleware/IMiddlewareProvider';
import { ErrorMiddleware } from './components/application/middleware/error.middleware';
import { BasicMiddleware } from './components/application/middleware/basic.middleware';
import { IProductDocument, IProductRepository, IProductService } from './components/products/product.interface';
import { ProductService } from './components/products/product.service';
import { ProductRepository } from './components/products/product.repository';
import productModel from './components/products/product.model';

// Config
container.bind<config.IConfig>(types.Config).toConstantValue(config);

// Application
container.bind<IApplication>(types.Application).to(Application);
container.bind<IMongooseService>(types.MongooseService).to(MongooseService);
container.bind<IHttpService>(types.HttpService).to(HttpService);
container.bind<IHttpRouter>(types.HttpRouter).to(HttpRouter);

// Middleware
container.bind<IMiddlewareProvider>(types.BasicMiddleware).to(BasicMiddleware);
container.bind<IMiddlewareProvider>(types.ErrorMiddleware).to(ErrorMiddleware);

// Logging
container.bind<ILoggerService>(types.LoggerService).to(LoggerService);

container.bind<IProductService>(types.ProductService).to(ProductService);
container.bind<IProductRepository>(types.ProductRepository).to(ProductRepository);
container.bind<Model<IProductDocument>>(types.ProductModel).toConstantValue(productModel);

export default container;