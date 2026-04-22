import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/interfaces/product.interface';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit, OnDestroy {
  products: Product[] = [];
  productForm!: FormGroup;
  editingProduct: Product | null = null;
  showForm = false;
  errorMessage = '';
  loading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      category: ['']
    });
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

  openCreate(): void {
    this.editingProduct = null;
    this.productForm.reset();
    this.showForm = true;
  }

  openEdit(product: Product): void {
    this.editingProduct = product;
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category
    });
    this.showForm = true;
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;
    this.loading = true;

    const request = this.editingProduct
      ? this.productService.update(this.editingProduct.id, this.productForm.value)
      : this.productService.create(this.productForm.value);

    request.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.showForm = false;
        this.loading = false;
        this.loadProducts();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al guardar';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  deleteProduct(id: number): void {
    if (!confirm('¿Eliminar este producto?')) return;
    this.productService.delete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.loadProducts(),
        error: () => {
          this.errorMessage = 'Error al eliminar';
          this.cdr.markForCheck();
        }
      });
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingProduct = null;
    this.errorMessage = '';
  }
}