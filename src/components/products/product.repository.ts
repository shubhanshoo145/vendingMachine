import { inject, injectable } from "inversify";
import { Model } from "mongoose";
import types from "../../constants/types";
import { IProduct, IProductDocument, IProductRepository } from "./product.interface";


@injectable()
export class ProductRepository implements IProductRepository {
  @inject(types.ProductModel) private readonly productModel: Model<IProductDocument>;

  public async createProducts(products) {
    return await this.productModel.insertMany(products);
  }

  public async getAllProducts(): Promise<IProduct[]> {
    return await this.productModel.find({}).lean();
  }

  public async getProductById(productId): Promise<IProduct> {
    return await this.productModel.findById(productId).lean();
  }
}