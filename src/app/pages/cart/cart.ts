import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {
  cart: any[] = [];
  constructor(private cartService: CartService) {}
  ngOnInit() {
    // 🔥 reactive state (NO manual loadCart, NO duplication)
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });
  }
  // ❌ REMOVE (no local mutation)
  remove(id: string) {
  // 🔥 1. INSTANT UI UPDATE (no waiting)
  this.cart = this.cart.filter(item => item.id !== id);
  // 🔥 2. backend call
  this.cartService.removeItem(id).subscribe({
    next: () => {
      // optional safety sync
      this.cartService.refreshCart();
    },
    error: () => {
      // 🔥 rollback if backend fails
      this.cartService.refreshCart();
    }
  });
}

increase(item: any) {

  const newQty = item.quantity + 1;

  // 🔥 1. instant UI update
  item.quantity = newQty;

  // 🔥 2. backend sync
  this.cartService.updateQuantity(item.id, newQty).subscribe({
    error: () => {
      // rollback if backend fails
      item.quantity--;
    }
  });
}
  decrease(item: any) {

  if (item.quantity <= 1){
    return this.remove(item.id);
  };

  const newQty = item.quantity - 1;

  // 🔥 1. instant UI update
  item.quantity = newQty;

  // 🔥 2. backend sync
  this.cartService.updateQuantity(item.id, newQty).subscribe({
    error: () => {
      // rollback if backend fails
      item.quantity++;
    }
  });
}
  // 💰 TOTAL PRICE
  getTotal(): number {
    return this.cart.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );
  }
}
