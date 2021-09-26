import { Router, Request, Response, NextFunction } from 'express';
import { ILoggerService } from '../../commons/interfaces/services/ILoggerService';
import { IProductService } from '../../components/products/product.interface';
import types from '../../constants/types';
import container from '../../container';

export default (router: Router) => {
  router.post('/createProducts', async (req: Request, res: Response, next: NextFunction) => {
    const productService = container.get<IProductService>(types.ProductService);
    const loggerService = container.get<ILoggerService>(types.LoggerService);
    try {
      await productService.createProducts(req.body.products);
      res.send({
        success: true,
        data: {
          message: 'Products created successfully',
        }
      });
    } catch (err) {
      loggerService.error(`Error while creating products, ${err}`);
    }
  });

  router.post('/getAllProducts', async (req: Request, res: Response, next: NextFunction) => {
    const productService = container.get<IProductService>(types.ProductService);
    const loggerService = container.get<ILoggerService>(types.LoggerService);
    try {
      const allProducts = await productService.getAllProducts(req.body.currency);
      res.send({
        success: true,
        data: {
          products: allProducts,
        }
      });
    } catch (err) {
      loggerService.error(`Error while getting product details, ${err}`);
    }
  });

  router.post('/selectProduct', async (req: Request, res: Response, next: NextFunction) => {
    const productService = container.get<IProductService>(types.ProductService);
    const loggerService = container.get<ILoggerService>(types.LoggerService);
    try {
      const product = await productService.getProductById(req.body.productId, req.body.currency);
      res.send({
        success: true,
        data: {
          product
        }
      });
    } catch (err) {
      loggerService.error(`Error while selecting product, ${err}`);
    }
  });
};