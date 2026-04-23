# Lexco Frontend - Angular 21

SPA desarrollada en Angular 21 con Tailwind CSS.

**Autor:** Cristhian David Roncancio  
**Fecha:** Abril 2026

## Tecnologías
- Angular 21
- Tailwind CSS 3.4
- TypeScript
- RxJS + Signals

## Instalación

### 1. Clonar repositorio
```bash
git clone https://github.com/neodevone/lexco-frontend.git
cd lexco-frontend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar aplicación
```bash
ng serve
```

Abrir `http://localhost:4200`

## Arquitectura
```
src/app/
├── core/
│   ├── guards/        # AuthGuard, RoleGuard, GuestGuard
│   ├── interceptors/  # Bearer token automático
│   ├── interfaces/    # User, Product, CartItem
│   └── services/      # AuthService, UserService, ProductService
├── modules/
│   ├── auth/          # Login, Register
│   ├── admin/         # Dashboard, Users, Products, Profile
│   └── user/          # Catalog, ProductDetail, Cart
└── shared/
└── components/    # WelcomeCard
```

## Características técnicas
- Lazy Loading en todos los módulos
- Signals para estado reactivo del carrito y usuario
- ChangeDetectionStrategy.OnPush en todos los componentes
- Lifecycle hooks: ngOnInit, ngOnChanges, ngOnDestroy
- Formularios reactivos con validación de contraseña segura
- AuthGuard, RoleGuard y GuestGuard
- Interceptor HTTP para Bearer token
- Carrito persistente en localStorage
- Nueva sintaxis Angular (@if, @for)

## Usuarios de prueba
- Admin: admin@lexco.com / Admin@1234
- User: user@lexco.com / User@1234