import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  isLoggedIn$ = this.loggedIn.asObservable();
  constructor(private http: HttpClient,) {}
  // 🔐 LOGIN API
  login(user: { email: string; password: string }) {
    return this.http.post('http://localhost:3000/auth/login', user);
  }
  // 📝 REGISTER API
  register(user: { email: string; password: string }) {
    return this.http.post('http://localhost:3000/auth/register', user);
  }
  // 💾 SAVE TOKEN
  setToken(token: string) {
  console.log('SETTING TOKEN:', token);
  localStorage.setItem('token', token);
  console.log('STORED:', localStorage.getItem('token'));
  this.loggedIn.next(true);
}
  logout() {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
  }
  isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
}
}
