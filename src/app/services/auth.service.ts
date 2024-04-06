import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { SwalService } from './swal.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private localStorage:LocalStorageService, private jwtHelper:JwtHelperService, private toastr:ToastrService,
    private swalSerice:SwalService
  ) { }


  identityCheck(){
    const token:string = this.localStorage.getToken();

    let expired:boolean;
  
    try{
      expired = this.jwtHelper.isTokenExpired(token);
    }
    catch{
      expired = true;
    }

    _isAuthenticated = token != null && !expired;
  }

 logOut(){
  this.swalSerice.callSwal("Çıkış yapmak istediğinizden emin misin?","Çıkış yapılacaktır","Evet",()=>{
    this.localStorage.deleteToken();
    this.identityCheck();
    this.toastr.success("Çıkış işlemi başar")
  })
  }


  get isAuthenticated():boolean{
    return _isAuthenticated;
  }
}

export let _isAuthenticated:boolean;
