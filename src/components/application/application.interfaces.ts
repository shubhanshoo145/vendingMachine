import { Server } from 'http';
import { Express } from 'express';

export interface IMongooseService {
  openConnection(): Promise<void>;
  closeConnection(callback: (any: any) => void): void
}

export interface IHttpService {
  httpServer: Server;
  webServer: Express;
  initializeServer(): Promise<void>;
}

export interface IHttpRouter {
  register(webServer: Express): void;
}