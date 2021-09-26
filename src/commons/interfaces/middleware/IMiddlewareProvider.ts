import { Express, Router } from 'express';

export interface IMiddlewareProvider {
  register(router: Router | Express): void;
}