import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {
  
  private productSource = new Subject<any>();
  product$ = this.productSource.asObservable();

  constructor() { }

  
  setProduct(product: any) {
    this.productSource.next(product);
  }
}
