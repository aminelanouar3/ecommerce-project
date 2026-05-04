import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'http://localhost:3000/cart';

  // 🔥 single source of truth
  private cartSubject = new BehaviorSubject<any[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {
    this.refreshCart(); // initial load once
  }

  // 🔄 ALWAYS SYNC FROM BACKEND
  refreshCart() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (cart) => this.cartSubject.next(cart),
      error: (err) => console.error('Cart load error:', err)
    });
  }

  // ➕ ADD TO CART
  addToCart(product: any) {
    return this.http.post(this.apiUrl, {
      productId: product.id,
      quantity: 1
    }).pipe(
      tap(() => this.refreshCart()) // 🔥 instant sync
    );
  }

  // ❌ REMOVE ITEM
  removeItem(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.refreshCart()) // 🔥 instant sync
    );
  }

  // ✏️ UPDATE QUANTITY
 updateQuantity(id: string, quantity: number) {
  return this.http.patch(`${this.apiUrl}/${id}`, {
    quantity: Number(quantity)
  }).pipe(
    tap(() => this.refreshCart())
  );
}
}
