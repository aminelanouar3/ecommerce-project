import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf, AsyncPipe } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgIf, AsyncPipe],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  isLoggedIn = false;
  constructor(
    public authService: AuthService,
    private router: Router,
  ) {
    this.authService.isLoggedIn$.subscribe(value => {
      this.isLoggedIn = value;});
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  goCart() {
  console.log('CLICK CART');
  this.router.navigateByUrl('/cart');
}
}
