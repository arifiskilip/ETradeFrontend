import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }


  addToken(token:string){
    localStorage.setItem("token",token);
  }
  
  addRefreshToken(refreshToken:string){
    localStorage.setItem("refreshToken",refreshToken);
  }

  getToken(tokenName:string):string{
    return localStorage.getItem(tokenName);
  }

  deleteToken(){
    localStorage.clear();
  }
}
