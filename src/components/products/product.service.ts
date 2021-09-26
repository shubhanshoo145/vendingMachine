import { inject, injectable } from "inversify";
import types from "../../constants/types";
import { getFxRate } from "../../utils/getFxRate";
import { IProduct, IProductRepository, IProductService } from "./product.interface";

@injectable()
export class ProductService implements IProductService {
  @inject(types.ProductRepository) private productRepository: IProductRepository;

  public async createProducts(products) {
    return await this.productRepository.createProducts(products);
  }

  public async getAllProducts(currency: string): Promise<IProduct[]> {
    const allProducts = await this.productRepository.getAllProducts();
    let productsByCurrency = [];
    for (const product of allProducts) {
      if (product.currency === currency) {
        productsByCurrency.push(product);
      } else {
        // get rate in respective currency
        const rate = await getFxRate(product.currency, currency);
        const costInInputCurrency = product.amount * rate;
        const productDataInInputCurrency = {
          _id: product._id,
          name: product.name,
          amount: costInInputCurrency,
          currency: currency,
        };
        productsByCurrency.push(productDataInInputCurrency);
      }
    }
    return productsByCurrency;
  }

  public async getProductById(productId: string, currency: string): Promise<IProduct> {
    const product = await this.productRepository.getProductById(productId);
    if (product.currency === currency) {
      return product;
    }
    const rate = await getFxRate(product.currency, currency);
    const costInInputCurrency = product.amount * rate;
    return {
      _id: product._id,
      name: product.name,
      amount: costInInputCurrency,
      currency: currency,
    };
  }
}