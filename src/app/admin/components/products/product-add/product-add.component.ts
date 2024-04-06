import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedModule } from '../../../../common/shared/shared.module';
import { GenericHttpClientService } from '../../../../services/generic-http-client.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CustomeErrorMessages } from '../../../../common/errorMessages/customeErrorMessages';
import { ValidDirective } from '../../../../common/valid.directive';

@Component({
  selector: 'app-product-add',
  standalone: true,
  imports: [SharedModule, ValidDirective],
  templateUrl: './product-add.component.html',
  styleUrl: './product-add.component.css',
})
export class ProductAddComponent implements OnInit {
  ngOnInit(): void {
    this.createProductForm();
  }

  @Output() getAll: EventEmitter<any> = new EventEmitter();

  constructor(
    private http: GenericHttpClientService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}


  //ProductForm

  productForm: FormGroup;
  errorMessages: CustomeErrorMessages = new CustomeErrorMessages();

  createProductForm() {
    this.productForm = this.formBuilder.group({
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

  get name() {
    return this.productForm.get('name');
  }
  get price() {
    return this.productForm.get('price');
  }
  get stock() {
    return this.productForm.get('stock');
  }

  addProduct() {
    if (this.productForm.valid) {
      const formData: FormData = new FormData();
      formData.append('name', this.name.value);
      formData.append('price', this.price.value);
      formData.append('stock', this.stock.value);
      for (let index = 0; index < this.images.length; index++) {
        formData.append('images', this.images[index]);
      }
      this.add(formData);
      this.productForm.reset();
      this.imageUrls = [];
    }
  }

  add(product: FormData) {
    this.spinner.show();
    this.http.post('Products/Add', product).subscribe((res) => {
      this.toastr.success('Ekleme işlemi başarılı!', 'Başarılı!');
      this.getAll.emit();
    });
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

  addImage(imageUrl: string, file: any) {
    this.imageUrls.push({
      imageUrl: imageUrl,
      name: file.name,
      size: file.size,
    });
    this.images.push(file);
    console.log(this.images); // Reactive formdaki images alanına dosyayı ekleyin
    this.productForm.get('images').setValue(this.images); // Reactive formdaki images alanını güncelleyin
  }

  removeImage(index: number) {
    this.imageUrls.splice(index, 1);
    this.images.splice(index, 1); // Reactive formdaki images alanından dosyayı kaldırın
    this.productForm.get('images').setValue(this.images); // Reactive formdaki images alanını güncelleyin
  }
}
