import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Inject, Injectable, inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenericHttpClientService {

  constructor(
    private http:HttpClient,
    private spinner:NgxSpinnerService,
    private toastr:ToastrService,
    @Inject("baseUrl") private apiUrl:string) { }


  get<T>(url: string): Observable<T> {
    return this.http.get<T>(this.apiUrl + url).pipe(
      tap(_ => this.spinner.hide()),
      catchError(err => this.handleError(err))
    );
  }

  post<T>(url: string, model: any): Observable<T> {
    return this.http.post<T>(this.apiUrl + url, model).pipe(
      tap(_ => this.spinner.hide()),
      catchError(err => this.handleError(err))
    );
  }


  private handleError(err: any): Observable<never> {
    this.spinner.hide();
    console.log(err)
    const errorMessage = (err.error && err.error.message) ? err.error.message : 'Bir hata oluştu.';
    this.toastr.error(errorMessage, "Hata");
    return throwError(errorMessage);
  }
}
