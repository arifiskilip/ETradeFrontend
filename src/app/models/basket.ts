import { Product } from "./product";

export class Basket{
    id:string;
    appUserId:string;
    productId:string;
    quantity:number;
    product:Product;
}