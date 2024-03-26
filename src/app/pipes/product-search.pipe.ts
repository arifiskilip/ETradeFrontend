import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../models/product';

@Pipe({
  name: 'productSearchPipe',
  standalone: true
})
export class ProductSearchPipe implements PipeTransform {

  transform(value: Product[], text: string): Product[] {
    if(text==null){
      return value;
    }
    return value.filter(x=> x.name.toLowerCase().includes(text.toLowerCase()) || 
     x.price.toString().toLowerCase().includes(text.toLowerCase())|| 
     x.stock.toString().toLowerCase().includes(text.toLowerCase()));
  }

}
