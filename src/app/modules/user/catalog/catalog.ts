import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../core/interfaces/product.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './catalog.html',
  styleUrl: './catalog.css'
})
export class Catalog implements OnInit, OnDestroy {
  products: Product[] = [];
  errorMessage = '';
  showCart = false;
  cartCount!: any;
  cartItems!: any;
  cartTotal!: any;
  currentUser!: any;
  purchasing = false;
  purchaseMessage = '';

  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
    this.cartCount = this.productService.cartCount;
    this.cartItems = this.productService.cartItems;
    this.cartTotal = this.productService.cartTotal;
    this.currentUser = this.authService.currentUser;
  }

  ngOnInit(): void {
    this.loadProducts();
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['cart'] === 'open') {
        this.showCart = true;
        this.cdr.markForCheck();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts(): void {
    this.productService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          this.products = products;
          this.cdr.markForCheck();
        },
        error: () => {
          this.errorMessage = 'Error al cargar productos';
          this.cdr.markForCheck();
        }
      });
  }

  addToCart(product: Product): void {
    this.productService.addToCart(product);
  }

  removeFromCart(productId: number): void {
    this.productService.removeFromCart(productId);
  }

  toggleCart(): void {
    this.showCart = !this.showCart;
    this.purchaseMessage = '';
  }

  purchase(): void {
    const items = this.cartItems();
    if (items.length === 0) return;

    this.purchasing = true;
    this.purchaseMessage = '';

    const purchases = items.map((item: any) =>
      this.productService.purchase({
        product_id: item.product.id,
        quantity: item.quantity
      }).pipe(takeUntil(this.destroy$))
    );

    let completed = 0;
    purchases.forEach((obs: any) => {
      obs.subscribe({
        next: () => {
          completed++;
          if (completed === purchases.length) {
            this.productService.clearCart();
            this.purchasing = false;
            this.purchaseMessage = '✅ Compra realizada exitosamente';
            this.loadProducts();
            this.cdr.markForCheck();
          }
        },
        error: (err: any) => {
          this.purchasing = false;
          this.purchaseMessage = '❌ ' + (err.error?.errors?.quantity?.[0] || 'Error en la compra');
          this.cdr.markForCheck();
        }
      });
    });
  }

  logout(): void {
    this.authService.logout();
  }
}