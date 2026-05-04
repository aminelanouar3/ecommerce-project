import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private api = 'http://localhost:3000';
  constructor(private http: HttpClient) {}
  getProducts() {
     console.log('CALLING API...');
     return this.http.get(`${this.api}/products`);
  }
}
