import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, CartItem, PurchasePayload, PurchaseResponse } from '../interfaces/product.interface';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'http://127.0.0.1:8000/api/products';
  private _cartItems = signal<CartItem[]>([]);

  cartItems = this._cartItems.asReadonly();
  cartCount = computed(() => this._cartItems().reduce((acc, item) => acc + item.quantity, 0));
  cartTotal = computed(() => this._cartItems().reduce((acc, item) => acc + (item.product.price * item.quantity), 0));

  constructor(private http: HttpClient) {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage(): void {
    const saved = localStorage.getItem('cart');
    if (saved) {
      this._cartItems.set(JSON.parse(saved));
    }
  }

  private saveCartToStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this._cartItems()));
  }

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, data);
  }

  update(id: number, data: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  purchase(payload: PurchasePayload): Observable<PurchaseResponse> {
    return this.http.post<PurchaseResponse>(`${this.apiUrl}/purchase`, payload);
  }

  addToCart(product: Product): void {
    const items = this._cartItems();
    const existing = items.find(i => i.product.id === product.id);
    if (existing) {
      this._cartItems.set(items.map(i =>
        i.product.id === product.id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ));
    } else {
      this._cartItems.set([...items, { product, quantity: 1 }]);
    }
    this.saveCartToStorage();
  }

  removeFromCart(productId: number): void {
    this._cartItems.set(this._cartItems().filter(i => i.product.id !== productId));
    this.saveCartToStorage();
  }

  clearCart(): void {
    this._cartItems.set([]);
    localStorage.removeItem('cart');
  }
}