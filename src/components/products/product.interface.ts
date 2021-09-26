import { Document } from "mongoose";

export interface IProduct {
  _id: any,
  name: string,
  currency: string,
  amount: number,
}

export interface IProductDocument extends Document, IProduct {

}

export interface IProductRepository {
  getAllProducts(): Promise<IProduct[]>;
  getProductById(productId): Promise<IProduct>;
  createProducts(products);
}

export interface IProductService {
  getAllProducts(currency: string): Promise<IProduct[]>;
  getProductById(productId: string, currency: string): Promise<IProduct>;
  createProducts(products);
}