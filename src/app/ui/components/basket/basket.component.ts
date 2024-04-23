import { Tools } from './../../../common/tools';
import { Basket } from './../../../models/basket';
import { Component, OnInit } from '@angular/core';
import { GenericHttpClientService } from '../../../services/generic-http-client.service';
import { BasketTotalCountCalculatePipe } from '../../../pipes/basket-total-count-calculate.pipe';
import { _isAuthenticated } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [BasketTotalCountCalculatePipe],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.css'
})
export class BasketComponent implements OnInit{
  ngOnInit(): void {
    this.getAllByUserId();
  }

  baskets:Basket[];
  tools:Tools = new Tools();
  /**
   *
   */
  constructor(private http:GenericHttpClientService,
    private router:Router,
    private toastr:ToastrService,
  ) {

    
  }


  getAllByUserId(){
    this.http.get<any>('Baskets/GetAllByUserId').subscribe(res=>{
      this.baskets = res.baskets;
    })
  }

  addProduct(basket:Basket){
    if(!_isAuthenticated){
     this.router.navigate(["login"], {queryParams:{returnUrl:'/products'}});
     this.toastr.warning("Oturum açmanız gerekiyor!","Yetkisiz erişim!");
    }
    else{

    basket.quantity+=1;
    this.http.post('Baskets/Add',basket).subscribe(res=>{
     this.toastr.success("Ekleme işlemi başarılı",basket.product.name+" - ürün sepete eklendi!");
    })
    }
}

removeProduct(basket:Basket,quantity?:number){
  if(!_isAuthenticated){
   this.router.navigate(["login"], {queryParams:{returnUrl:'/products'}});
   this.toastr.warning("Oturum açmanız gerekiyor!","Yetkisiz erişim!");
  }
  else{
    if(quantity){
      this.http.post('Baskets/Delete',{productId:basket.id,quantity:1}).subscribe(res=>{
        this.toastr.success("Silme işlemi başarılı",basket.product.name+"- ürün silindi!");
        this.getAllByUserId();
       })
    }
    else{
      this.http.post('Baskets/Delete',{productId:basket.id}).subscribe(res=>{
        this.toastr.success("Silme işlemi başarılı",basket.product.name+"- ürün silindi!");
        this.getAllByUserId();
       })
    }
 
  }
}

}
