import { HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {

  const toastr = inject(ToastrService);
  const spinner = inject(NgxSpinnerService);
  const authService=inject(AuthService)
  const router = inject(Router);

  return next(req).pipe(catchError(error => {
    spinner.show();
    switch (error.status) {
      case HttpStatusCode.Unauthorized:

        authService.refreshTokenLogin(localStorage.getItem("refreshToken"), (state) => {
          if (!state) {
            const url = router.url;
            if (url == "/products")
              toastr.warning("Sepete ürün eklemek için oturum açmanız gerekiyor.", "Oturum açınız!");
            else
              toastr.warning("Bu işlemi yapmaya yetkiniz bulunmamaktadır!", "Yetkisiz işlem!");
          }
        }).then(data => {
          toastr.warning("Bu işlemi yapmaya yetkiniz bulunmamaktadır!", "Yetkisiz işlem!");
        });
        toastr.warning("Yetkiniz yok!");
        break;
      case HttpStatusCode.InternalServerError:
        toastr.warning("Sunucuya erişilmiyor!", "Sunucu hatası!");
        break;
      case HttpStatusCode.BadRequest:
         toastr.warning(error.error.message, "Geçersiz istek!");
        break;
      case HttpStatusCode.NotFound:
        toastr.warning("Sayfa bulunamadı!", "Sayfa bulunamadı!");
        break;
      default:
        toastr.warning("Beklenmeyen bir hata meydana gelmiştir!", "Hata!");
        break;
    }

    spinner.hide();
    return of(error);
  }));
};

