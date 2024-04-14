import { Inject } from "@angular/core";

export class Tools{

    apiUrl:string = "https://localhost:7280/";
    constructor() {
        
    }
    genareteImagePath(imagePath:string):string{
        return  this.apiUrl+imagePath;
    }
}