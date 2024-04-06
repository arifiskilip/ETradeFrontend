import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../common/shared/shared.module';
import { AuthService, _isAuthenticated } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{

  constructor(public authService:AuthService,private router:Router) {
   
  }
  ngOnInit(): void {
    this.authService.identityCheck();
  }


  logOut(){
    this.authService.logOut();
    this.router.navigate([""]);
  }
}
