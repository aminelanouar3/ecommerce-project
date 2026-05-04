import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  user = {
    email: '',
    password: ''
  };
  message = '';
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  onSubmit() {
    this.authService.login(this.user).subscribe({
      next: (res: any) => {
        console.log('LOGIN RESPONSE:', res);
        const token = res.accessToken;
        console.log('EXTRACTED TOKEN:', token);
        this.authService.setToken(token); // 🔥 MUST RUN
        console.log('AFTER SET TOKEN LOCALSTORAGE:', localStorage.getItem('token'));
        this.router.navigate(['/products']);
    },
      error: (err) => {
        this.message = err.error.message;
      }
    });
  }
}
