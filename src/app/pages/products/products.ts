import { Component, OnInit } from '@angular/core';
import { NgFor, JsonPipe } from '@angular/common';
import { ProductService } from '../../services/product';
import { ChangeDetectorRef } from '@angular/core';
import { CartService } from '../../services/cart';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [NgFor,RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private toast: ToastService,
  ) {}
  ngOnInit() {
  console.log('COMPONENT LOADED');
  this.productService.getProducts().subscribe({
    next: (res: any) => {
      console.log('RAW RESPONSE:', res);
      // 🔥 FORCE IMMUTABLE ASSIGNMENT
      this.products = [...res];
      this.cd.detectChanges();
      console.log('PRODUCTS AFTER ASSIGN:', this.products);
    },
    error: (err) => {
      console.error('API ERROR:', err);
    }
  });
}
  addToCart(product: any) {
  console.log('🟢 ADD TO CART CLICKED ONCE');

  this.cartService.addToCart(product).subscribe({
    next: () => {
      console.log('🟢 HTTP SUCCESS');

      this.toast.show('Added to cart 🛒');
    }
  });
}
}
