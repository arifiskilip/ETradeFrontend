import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { SwalService } from './swal.service';
import { GenericHttpClientService } from './generic-http-client.service';
import { DataResult } from '../models/dataResult';
import { Token } from '../models/token';
import { firstValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private localStorage:LocalStorageService, private jwtHelper:JwtHelperService, private toastr:ToastrService,
    private swalSerice:SwalService, private http:GenericHttpClientService
  ) { }


  identityCheck(){
    const token:string = this.localStorage.getToken("token");

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

  async refreshTokenLogin(refreshToken: string, callBackFunction?: (state:any) => void): Promise<any> {
    const observable = this.http.post("Auth/RefreshTokenLogin", { refreshToken: refreshToken });

    try {
      const tokenResponse = await firstValueFrom(observable) as DataResult<Token>;

      if (tokenResponse) {
        localStorage.setItem("accessToken", tokenResponse.data.accessToken);
        localStorage.setItem("refreshToken", tokenResponse.data.refreshToken);
      }

      callBackFunction(tokenResponse ? true : false);
    } catch {
      callBackFunction(false);
    }
  }



  get isAuthenticated():boolean{
    return _isAuthenticated;
  }
}

export let _isAuthenticated:boolean;
