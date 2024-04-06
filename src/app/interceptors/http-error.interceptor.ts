import { HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {

  const toastr = inject(ToastrService);
  const spinner = inject(NgxSpinnerService);

  return next(req).pipe(catchError(error => {
    spinner.show();
    switch (error.status) {
      case HttpStatusCode.Unauthorized:

        // this.userAuthService.refreshTokenLogin(localStorage.getItem("refreshToken"), (state) => {
        //   if (!state) {
        //     const url = this.router.url;
        //     if (url == "/products")
        //       this.toastrService.message("Sepete ürün eklemek için oturum açmanız gerekiyor.", "Oturum açınız!", {
        //         messageType: ToastrMessageType.Warning,
        //         position: ToastrPosition.TopRight
        //       });
        //     else
        //       this.toastrService.message("Bu işlemi yapmaya yetkiniz bulunmamaktadır!", "Yetkisiz işlem!", {
        //         messageType: ToastrMessageType.Warning,
        //         position: ToastrPosition.BottomFullWidth
        //       });
        //   }
        // }).then(data => {
        //   this.toastrService.message("Bu işlemi yapmaya yetkiniz bulunmamaktadır!", "Yetkisiz işlem!", {
        //     messageType: ToastrMessageType.Warning,
        //     position: ToastrPosition.BottomFullWidth
        //   });
        // });
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

