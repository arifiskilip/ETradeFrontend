import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../common/shared/shared.module';
import { NgxSpinnerService } from 'ngx-spinner';
import { GenericHttpClientService } from '../../../services/generic-http-client.service';
import { Product } from '../../../models/product';
import { ProductSearchPipe } from "../../../pipes/product-search.pipe";
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomeErrorMessages } from '../../../common/errorMessages/customeErrorMessages';
import { ValidDirective } from '../../../common/valid.directive';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-products',
    standalone: true,
    templateUrl: './products.component.html',
    styleUrl: './products.component.css',
    imports: [SharedModule, ProductSearchPipe,ValidDirective],
    providers:[DatePipe]
})
export class ProductsComponent implements OnInit {
  ngOnInit(): void {
    this.getAll();
    this.createProductForm();
  }

  products:Product[]=[];
  searchText:string="";
  productForm:FormGroup;
  errorMessages:CustomeErrorMessages = new CustomeErrorMessages();

  constructor(
    private spinner:NgxSpinnerService,
    private http:GenericHttpClientService,
    private datePipe:DatePipe,
    private formBuilder:FormBuilder,
    private toastr:ToastrService
  ) {}



  getAll(){
    this.spinner.show();
    this.http.get<Product[]>("Products/GetAll").subscribe(res=>{
      this.products =res;
    })
  }

  add(product:Product){
    this.spinner.show();
    this.http.post("Products/Add",product).subscribe(res=>{
      this.toastr.success("Ekleme işlemi başarılı!","Başarılı!")
      this.getAll();
    })
  }

  formatDate(dateString:string){
    const date = new Date(dateString);
    return this.datePipe.transform(date,'dd.MM.yyyy - HH:mm:ss')
  }

  createProductForm(){
    this.productForm = this.formBuilder.group({
      name:["",[Validators.required,Validators.minLength(3),Validators.maxLength(50)]],
      price:["",[Validators.required,Validators.min(0),Validators.max(1000)]],
      stock:["",[Validators.required,Validators.min(0),Validators.max(500)]],
    })
  }

  get name() {return this.productForm.get("name");}
  get price() {return this.productForm.get("price");}
  get stock() {return this.productForm.get("stock");}

  addProduct(){
    if(this.productForm.valid){
      this.add(this.productForm.value)
      this.productForm.reset();
    }
  }
}
