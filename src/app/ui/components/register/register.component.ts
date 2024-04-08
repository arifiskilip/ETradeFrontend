import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DataResult } from '../../../models/dataResult';
import { GenericHttpClientService } from '../../../services/generic-http-client.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { Token } from '../../../models/token';
import { SharedModule } from '../../../common/shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  ngOnInit(): void {
   this.createRegisterForm();
  }
  
  registerForm:FormGroup;
  constructor(private formBuilder:FormBuilder, private toastr:ToastrService,
    private spinner:NgxSpinnerService, private http:GenericHttpClientService, private storageService:LocalStorageService,
  private authService:AuthService,  private router:Router) {
    
  }


  createRegisterForm(){
    this.registerForm = this.formBuilder.group({
      userName:["",[Validators.required]],
      password:["",[Validators.required]],
      fullName:["",[Validators.required]],
      email:["",[Validators.required, Validators.email]]
    })
  }


  register(){
    this.spinner.show();
    if(this.registerForm.valid){
      console.log(this.registerForm.value)
      this.http.post<DataResult<Token>>("Auth/Regiser",this.registerForm.value).subscribe(res=>{
        this.toastr.success(res.message,"Başarılı");
        this.storageService.addToken(res.data.accessToken);
        this.storageService.addToken(res.data.refreshToken);
        this.authService.identityCheck();
        this.router.navigate([""]);
      },err=> this.toastr.error(err.error.message,"Hata"));
    }
  }

}
