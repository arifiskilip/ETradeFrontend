import { Pipe, PipeTransform } from '@angular/core';
import { Basket } from '../models/basket';

@Pipe({
  name: 'basketTotalCountCalculate',
  standalone: true
})
export class BasketTotalCountCalculatePipe implements PipeTransform {

  transform(value: Basket[]): number {
    let totalCount = 0;
   if(value != null){
    value.forEach(item=>{
      totalCount += item.quantity * item.product.price
     })
   }
   return totalCount;
  }

}
