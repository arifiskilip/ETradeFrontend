import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { _isAuthenticated } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router:Router = inject(Router);
  const spinner:NgxSpinnerService = inject(NgxSpinnerService);
  const toastr:ToastrService = inject(ToastrService);

  spinner.show();

  if(!_isAuthenticated){
    router.navigate(["login"], {queryParams:{returnUrl:state.url}});
    toastr.error("Oturum açmanız gerekiyor!","Yetkisiz erişim!");
  }
  spinner.hide();
  return true;
};

