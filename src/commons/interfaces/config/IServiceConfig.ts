import { IHttpServerConfig } from './IHttpServerConfig';
import { IMongooseConfig } from './IMongooseConfig';

export interface IServiceConfig {
  mongoose: IMongooseConfig;
  httpServer: IHttpServerConfig;
}
