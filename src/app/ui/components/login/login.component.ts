import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../common/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { GenericHttpClientService } from '../../../services/generic-http-client.service';
import { DataResult } from '../../../models/dataResult';
import { LocalStorageService } from '../../../services/local-storage.service';
import { Token } from '../../../models/token';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  ngOnInit(): void {
   this.createLoginForm();
  }
  
  loginForm:FormGroup;
  constructor(private formBuilder:FormBuilder, private toastr:ToastrService,
    private spinner:NgxSpinnerService, private http:GenericHttpClientService, private storageService:LocalStorageService,
  private activatedRoute:ActivatedRoute, private router:Router, private authService:AuthService) {
    
  }


  createLoginForm(){
    this.loginForm = this.formBuilder.group({
      userNameOrEmail:["",[Validators.required]],
      password:["",[Validators.required]]
    })
  }


  login(){
    this.spinner.show();
    if(this.loginForm.valid){
      this.http.post<DataResult<Token>>("auth/login",this.loginForm.value).subscribe(res=>{
        this.toastr.success(res.message,"Başarılı");
        this.storageService.addToken(res.data.accessToken);
        this.authService.identityCheck();
        this.activatedRoute.queryParams.subscribe(params=>{
          if(params["returnUrl"]){
            this.router.navigate([params["returnUrl"]]);
          }
          else{
            this.router.navigate([""]);
          }
        })
      },err=> this.toastr.error(err.error.message,"Hata"));
    }
  }

}
