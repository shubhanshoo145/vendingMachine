import { model, Schema } from "mongoose";
import { IProductDocument } from "./product.interface";

const productSchema = new Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
});

export default model<IProductDocument>('products', productSchema);