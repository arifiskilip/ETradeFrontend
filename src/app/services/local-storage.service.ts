import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }


  addToken(token:string){
    localStorage.setItem("token",token);
  }

  getToken():string{
    return localStorage.getItem("token");
  }

  deleteToken(){
    localStorage.removeItem("token");
  }
}
