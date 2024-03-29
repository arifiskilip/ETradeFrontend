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
import { PaginatedModel } from '../../../models/paginatedModel';
import { Router } from '@angular/router';
import { SwalService } from '../../../services/swal.service';

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

  paginatedProduct:PaginatedModel<Product[]> = new PaginatedModel<Product[]>();
  searchText:string="";
  productForm:FormGroup;
  errorMessages:CustomeErrorMessages = new CustomeErrorMessages();
  pageSize: number = 10;

  // Mevcut sayfa numarası
  currentPage: number = 1;

  // Toplam sayfa sayısı
  totalPages: number;

  // Sayfalanmış ve görüntülenen ürünler
  displayedItems: any[] = [];

  selectedCount:number=5;

  constructor(
    private spinner:NgxSpinnerService,
    private http:GenericHttpClientService,
    private datePipe:DatePipe,
    private formBuilder:FormBuilder,
    private toastr:ToastrService,
    private router:Router,
    private swal:SwalService
  ) {
  }



  getAll(){
    this.spinner.show();
    this.http.get<PaginatedModel<Product[]>>(`Products/GetAll?pageIndex=${this.currentPage}&pageSize=${this.selectedCount}`).subscribe(res=>{
      this.paginatedProduct =res;
      this.totalPages=res.pagination.totalPages;
    })
  }

  add(product:FormData){
    this.spinner.show();
    this.http.post("Products/AddV2",product).subscribe(res=>{
      this.toastr.success("Ekleme işlemi başarılı!","Başarılı!")
      this.getAll();
    })
  }

  delete(product:Product){
    this.swal.callSwal(`'${product.name}' adlı ürünü silmek istediğinizden eminmisiniz?
    `,"Ürün silinecektir",'Evet',()=>{
      this.http.delete(`Products/Delete?id=`,product.id).subscribe((res)=>{
        this.toastr.success("Silme işlemi başarılı!","Başarılı");
        this.getAll();
      });
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
      images:[[],Validators.required]
    })
  }

  get name() {return this.productForm.get("name");}
  get price() {return this.productForm.get("price");}
  get stock() {return this.productForm.get("stock");}

  addProduct(){
    if(this.productForm.valid){
      console.log(this.productForm.value)
      const formData : FormData = new FormData();
      formData.append("name",this.name.value);
      formData.append("price",this.price.value);
      formData.append("stock",this.stock.value);
      for (let index = 0; index < this.images.length; index++) {
        formData.append("images",this.images[index]);
      }
      this.add(formData)
      console.log(formData);
      this.productForm.reset();
    }
  }

  //Pagination

  // Sayfaya git
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getAll();
      this.routerNavigate();
    }
  }

  // Önceki sayfaya git
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getAll();
      this.routerNavigate();
    }
  }

  // Sonraki sayfaya git
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getAll();
      this.routerNavigate();
    }
  }

  // İlk sayfaya git
  goToFirstPage() {
    this.currentPage = 1;
    this.getAll();
    this.routerNavigate();
  }

  // Son sayfaya git
  goToLastPage() {
    this.currentPage = this.totalPages;
    this.getAll();
    this.routerNavigate();
  }

  // Sayfa numaralarını döndürür
  getPageNumbers(): number[] {
    const pageNumbers = [];
    const maxPagesToShow = 10; // Sayfa numaralarının maksimum gösterileceği miktarı belirleyin
    const startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  }
  // Kaç adet listeleneceğini beliritir
  goToChangeSelectedCount(){
    this.getAll();
    this.routerNavigate();
  }
    // Başlangıç indisini hesaplar
    calculateStartIndex(): number {
      return (this.currentPage - 1) * this.selectedCount + 1;
    }

    routerNavigate(){
      this.router.navigate(['/admin/products'],{
        queryParams:{pageIndex:this.currentPage,pageSize:this.selectedCount}
      })
    }

    // Images
    images: File[] = [];
    imageUrls: any[] = [];
    getImages(event: any) {
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];
        if (this.validateFileType(file)) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
  
          reader.onload = () => {
            const imageUrl = reader.result as string;
            this.addImage(imageUrl, file);
          }
        } else {
          console.error('Geçersiz dosya türü: ', file.type);
        }
      }
    }
  
    validateFileType(file: File): boolean {
      // Sadece belirli dosya türlerini kabul edin (örneğin, resim dosyaları)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      return allowedTypes.includes(file.type);
    }
  
    addImage(imageUrl: string, file: any) {
      this.imageUrls.push({ imageUrl: imageUrl, name: file.name, size: file.size });
      this.images.push(file); // Reactive formdaki images alanına dosyayı ekleyin
      this.productForm.get('images').setValue(this.images); // Reactive formdaki images alanını güncelleyin
    }
  
    removeImage(index: number) {
      this.imageUrls.splice(index, 1);
      this.images.splice(index, 1); // Reactive formdaki images alanından dosyayı kaldırın
      this.productForm.get('images').setValue(this.images); // Reactive formdaki images alanını güncelleyin
    }
  
}
