import { Product } from './../../../models/product';
import { Component, Input, OnInit, input } from '@angular/core';
import { SharedModule } from '../../../common/shared/shared.module';
import { NgxSpinnerService } from 'ngx-spinner';
import { GenericHttpClientService } from '../../../services/generic-http-client.service';
import { ProductSearchPipe } from '../../../pipes/product-search.pipe';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomeErrorMessages } from '../../../common/errorMessages/customeErrorMessages';
import { ValidDirective } from '../../../common/valid.directive';
import { ToastrService } from 'ngx-toastr';
import { PaginatedModel } from '../../../models/paginatedModel';
import { Router } from '@angular/router';
import { SwalService } from '../../../services/swal.service';
import { ProductAddComponent } from './product-add/product-add.component';
import { GetAllModel } from '../../../models/getAllModel';
import { DataResult } from '../../../models/dataResult';

@Component({
    selector: 'app-products',
    standalone: true,
    templateUrl: './products.component.html',
    styleUrl: './products.component.css',
    providers: [DatePipe],
    imports: [
        SharedModule,
        ProductSearchPipe,
        ValidDirective,
        ProductAddComponent
    ]
})
export class ProductsComponent implements OnInit {
  ngOnInit(): void {
    this.getAll();
    this.createProductUpdateForm();
  }

  paginatedProduct: PaginatedModel<Product[]> = new PaginatedModel<Product[]>();
  searchText: string = '';
  errorMessages: CustomeErrorMessages = new CustomeErrorMessages();
  pageSize: number = 10;

  // Mevcut sayfa numarası
  currentPage: number = 1;

  // Toplam sayfa sayısı
  totalPages: number;

  // Sayfalanmış ve görüntülenen ürünler
  displayedItems: any[] = [];

  selectedCount: number = 5;

  constructor(
    private spinner: NgxSpinnerService,
    private http: GenericHttpClientService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private router: Router,
    private swal: SwalService,
    private formBuilder:FormBuilder
  ) {}

  getAll() {
    this.spinner.show();
    this.http
      .get<GetAllModel<PaginatedModel<Product[]>>>(
        `Products/GetAll?pageIndex=${this.currentPage}&pageSize=${this.selectedCount}`
      )
      .subscribe((res) => {
        console.log(res)  
        this.paginatedProduct = res.datas;
        this.totalPages = res.datas.pagination.totalPages;
      });
  }

  delete(product: Product) {
    this.swal.callSwal(
      `'${product.name}' adlı ürünü silmek istediğinizden eminmisiniz?
    `,
      'Ürün silinecektir',
      'Evet',
      () => {
        this.http.delete(`Products/Delete?id=`, product.id).subscribe((res) => {
          this.toastr.success('Silme işlemi başarılı!', 'Başarılı');
          this.getAll();
        });
      }
    );
  }

  formatDate(dateString: string) {
    const date = new Date(dateString);
    return this.datePipe.transform(date, 'dd.MM.yyyy - HH:mm:ss');
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
    const startPage = Math.max(
      1,
      this.currentPage - Math.floor(maxPagesToShow / 2)
    );
    const endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  }

  // Kaç adet listeleneceğini beliritir
  goToChangeSelectedCount() {
    this.getAll();
    this.routerNavigate();
  }

  // Başlangıç indisini hesaplar
  calculateStartIndex(): number {
    return (this.currentPage - 1) * this.selectedCount + 1;
  }

  routerNavigate() {
    this.router.navigate(['/admin/products'], {
      queryParams: {
        pageIndex: this.currentPage,
        pageSize: this.selectedCount,
      },
    });
  }
  

  // Update Product Operations

  productUpdateForm: FormGroup;
  images: string[] = [];
  imageUrls: File[] = [];

  getUrl(image:string){ 
    return 'https://localhost:7280/'+image;
  }

  createProductUpdateForm() {
    this.productUpdateForm = this.formBuilder.group({
      id:[""],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      price: [
        '',
        [Validators.required, Validators.min(0), Validators.max(1000)],
      ],
      stock: [
        '',
        [Validators.required, Validators.min(0), Validators.max(500)],
      ],
      images: [[], Validators.required],
    });
  }

  get id() {
    return this.productUpdateForm.get('id');
  }
  get name() {
    return this.productUpdateForm.get('name');
  }
  get price() {
    return this.productUpdateForm.get('price');
  }
  get stock() {
    return this.productUpdateForm.get('stock');
  }


  setProduct(product:Product){
    this.spinner.show();
    this.http.get<DataResult<Product>>(`Products/GetById?id=${product.id}`).subscribe(res=>{
      this.productUpdateForm.get('id').setValue(res.data.id);
      this.productUpdateForm.get('name').setValue(res.data.name);
      this.productUpdateForm.get('price').setValue(res.data.price);
      this.productUpdateForm.get('stock').setValue(res.data.stock);
      this.productUpdateForm.get('images').setValue(res.data.images);
      this.images = res.data.images;
    })
  }

  getImages(event: any) {
    for (let i = 0; i < event.target.files.length; i++) {
      const file = event.target.files[i];
      if (this.validateFileType(file)) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
  
        reader.onload = () => {
          const imageUrl = reader.result as string;
          this.addImage(imageUrl,file);
        };
      } else {
        console.error('Geçersiz dosya türü: ', file.type);
      }
    }
  }

  validateFileType(file: File): boolean {
    // Sadece belirli dosya türlerini kabul edin (örneğin, resim dosyaları)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    return allowedTypes.includes(file.type);
  }
  
  addImage(imageUrl: string,file:File) {
    this.images.push(imageUrl);
    this.imageUrls.push(file); // Add the image URL to the images array
    this.productUpdateForm.get('images').setValue(file);
  }
  
  removeImage(index: number) {
    let imageUrl= this.images[index];
    this.swal.callSwal("Resmi silmek istediğinizden eminmisiniz ?","Resim silinecektir","Evet",()=>{
      if(imageUrl.startsWith('data:image')){
        this.imageUrls.splice(index,1);
        this.images.splice(index,1);
      }
      else{
        this.http.post(`Products/UrlByDeleteImage?imagePath=${imageUrl}&productId=${this.id.value}`).subscribe((res:any)=>{
          this.toastr.success(res.message,"Başarılı");
          this.getAll();
          this.images.splice(index, 1);
        },err=> this.toastr.error("Silme işleminde hata meydana geldi.","Başarısız!"));
      }
    })
    // 
    // 
  }
  
  updateProduct() {
    if (this.productUpdateForm.valid) {
      const formData: FormData = new FormData();
      formData.append('id', this.id.value);
      formData.append('name', this.name.value);
      formData.append('price', this.price.value);
      formData.append('stock', this.stock.value);
      for (let index = 0; index < this.imageUrls.length; index++) {
          formData.append('images', this.imageUrls[index]);
      }
      this.update(formData);
    }
    else{
      this.toastr.error("Lütfem resim seçiniz!","Hata")
    }
   
  }

  update(product: FormData) {
    this.spinner.show();
    this.http.post('Products/Update', product).subscribe((res) => {
      this.toastr.success('Güncelleme işlemi başarılı!', 'Başarılı!');
      this.getAll();
    });
}
}
