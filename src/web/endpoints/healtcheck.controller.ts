import { Router, Request, Response, NextFunction } from 'express';

export default (router: Router) => {
  router.get('/ping', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send();
  });
};