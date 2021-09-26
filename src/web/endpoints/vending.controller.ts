import { Router, Request, Response, NextFunction } from "express";
import { ILoggerService } from "../../commons/interfaces/services/ILoggerService";
import { IProductService } from "../../components/products/product.interface";
import types from "../../constants/types";
import container from "../../container";

export default (router: Router) => {
  router.post('/approveRejectRequest', async (req: Request, res: Response, next: NextFunction) => {
    const loggerService = container.get<ILoggerService>(types.LoggerService);
    try {
      if (!req.body.approve) {
        return res.send({
          success: true,
          data: {
            message: 'Request for product has been cancelled',
          }
        });
      }
      const productService = container.get<IProductService>(types.ProductService);
      const product = await productService.getProductById(req.body.productId, req.body.inputCurrency);
      if (req.body.inputAmount >= product.amount) {
        const change = req.body.inputAmount - product.amount;
        res.send({
          success: true,
          data: {
            message: `Please collect your product ${product.name} and your change`,
            change: change,
          }
        });
      } else {
        res.send({
          success: false,
          data: {
            message: 'Insufficient amount'
          }
        });
      }
    } catch (err) {
      loggerService.error(`Error while approving/rejecting request, ${err}`);
    }
  });
}