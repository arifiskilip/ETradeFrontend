import { Tools } from './../../../common/tools';
import { Component, Inject, OnInit } from '@angular/core';
import { SharedModule } from '../../../common/shared/shared.module';
import { NgxSpinnerService } from 'ngx-spinner';
import { GenericHttpClientService } from '../../../services/generic-http-client.service';
import { GetAllModel } from '../../../models/getAllModel';
import { PaginatedModel } from '../../../models/paginatedModel';
import { Product } from '../../../models/product';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductSearchPipe } from '../../../pipes/product-search.pipe';
import { _isAuthenticated } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Basket } from '../../../models/basket';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [SharedModule,ProductSearchPipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  ngOnInit(): void {
    this.getAll();
  }
  tools: Tools = new Tools();
  constructor(
    private spinner: NgxSpinnerService,
    private http: GenericHttpClientService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr:ToastrService
  ) {}

  searchText: string;
  paginatedProduct: PaginatedModel<Product[]> = new PaginatedModel<Product[]>();
  pageSize: number = 10;
  // Mevcut sayfa numarası
  currentPage: number = 1;
  // Toplam sayfa sayısı
  totalPages: number;
  // Sayfalanmış ve görüntülenen ürünler
  displayedItems: any[] = [];

  //Pagination

  // Sayfaya git
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.routerNavigate();
    }
    console.log("Page:"+page);
    console.log("Selected Page:"+this.currentPage);
  }

  // Önceki sayfaya git
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.routerNavigate();
    }
  }

  // Sonraki sayfaya git
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.routerNavigate();
    }
  }

  // İlk sayfaya git
  goToFirstPage() {
    this.currentPage = 1;
    this.routerNavigate();
  }

  // Son sayfaya git
  goToLastPage() {
    this.currentPage = this.totalPages;
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
    this.routerNavigate();
  }

  // Başlangıç indisini hesaplar
  calculateStartIndex(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  routerNavigate() {
    this.router.navigate(['/products'], {
      queryParams: {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
      },
    });
  }

  getAll() {
    this.spinner.show();
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['pageIndex'] && params['pageSize']) {
        this.http
        .get<GetAllModel<PaginatedModel<Product[]>>>(
          `Products/GetAll?pageIndex=${params['pageIndex']}&pageSize=${params['pageSize']}`
        )
        .subscribe((res) => {
          this.currentPage = params['pageIndex'];
          this.pageSize = params['pageSize'];
          console.log(this.currentPage)
          this.paginatedProduct = res.datas;
          this.totalPages = res.datas.pagination.totalPages;
        });
      }
      else{
        this.http
        .get<GetAllModel<PaginatedModel<Product[]>>>(
          `Products/GetAll?pageIndex=${this.currentPage}&pageSize=${this.pageSize}`
        )
        .subscribe((res) => {

          this.paginatedProduct = res.datas;
          this.totalPages = res.datas.pagination.totalPages;
        });
      }
    });
  }
  
  addBasket(product:Product){
       if(!_isAuthenticated){
        this.router.navigate(["login"], {queryParams:{returnUrl:'/products'}});
        this.toastr.warning("Oturum açmanız gerekiyor!","Yetkisiz erişim!");
       }
       else{
        let basket:Basket = new Basket();
       basket.productId = product.id;
       basket.quantity = 1;
       this.http.post('Baskets/Add',basket).subscribe(res=>{
        console.log(res);
        this.toastr.success("Ekleme işlemi başarılı",product.name+"-ürün sepete eklendi!");
       })
       }
  }
}
