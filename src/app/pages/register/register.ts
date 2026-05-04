import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth';
import { Token } from '@angular/compiler';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {

  user = {
    name: '',
    email: '',
    password: ''
  };

  message = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.authService.register(this.user).subscribe({
      next: (res: any) => {
        const token = res.accessToken;
        this.authService.setToken(token);
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.message = err.error.message;
      }
    });
  }
}
