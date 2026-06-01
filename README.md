# 📦 StockFlow — Gestión de inventarios y pedidos

Sistema web integral para administrar productos, registrar movimientos de inventario, procesar pedidos de clientes y monitorear el stock en tiempo real, incluyendo una tienda pública y un panel administrativo con control de acceso por roles.

---

## 🚀 Primeros pasos

### Requisitos

- Node.js 20+
- PostgreSQL
- pnpm

### Instalación

```bash
pnpm install
```

### Base de datos

```bash
cp .env.example .env
```

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | URL de conexión a PostgreSQL |
| `JWT_SECRET` | Clave secreta para firmar tokens |
| `JWT_EXPIRES_IN_SEC` | Segundos antes de que expire el token |

```bash
pnpx prisma migrate dev
```

### Desarrollo

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## 🧪 Usuarios de prueba

| Rol | Email | Contraseña |
|---|---|---|
| ADMIN | sofia@gmail.com | `987654aBC!` |
| USER | alex@gmail.com | `987654aBC!` |

---

## ✨ Funcionalidades

### Tienda pública (`/`)
- **Catálogo de productos**: visualización de todos los productos con imagen, precio y descripción.
- **Selector de cantidad**: stepper interactivo para elegir cantidad (mín. 1, máx. stock disponible).
- **Compra**: redirige al flujo de pago con los datos del producto y cantidad seleccionada.

![tienda](/public/images/tienda.png)


### Checkout / Pago (`/payment`)
- **Formulario de envío**: datos del cliente (nombre, email, teléfono, dirección, ciudad, región, notas) con validación Zod.
- **Resumen del pedido**: visualización de producto, cantidad, subtotal, costo de envío (gratis desde $50.000) y total.
- **Pago simulado**: formulario de tarjeta de crédito con proceso asíncrono de 2 segundos y generación de ID de transacción.
- **Creación atómica**: la orden se crea validando stock disponible dentro de `prisma.$transaction`.

![checkout pago](/public/images/checkout-pago.png)


### Gestión de pedidos (`/pedidos`)
- **Listado de pedidos**: tarjetas con información completa (cliente, producto, cantidad, fechas, responsable).
- **Estados de orden**: `PENDING / PAID / PROCESSING / SHIPPED / DELIVERED / CANCELLED / REFUNDED`.
- **Asignación y despacho**: el empleado puede tomar un pedido, lo que actualiza el estado, descuenta stock del inventario y genera una transacción de salida, todo en una sola operación atómica.

![pedidos](/public/images/pedidos.png)


### Transacciones de inventario (`/transacciones`)
- **Búsqueda por producto**: combobox con búsqueda textual para seleccionar producto.
- **Registro de movimientos**: entradas y salidas con actualización atómica del stock vía `prisma.$transaction`.
- **Tabla de movimientos**: historial completo con tipo (entrada/salida), cantidad, fecha y responsable.
- **Gráfica de evolución de saldo**: línea diaria del stock a lo largo del mes.
- **Gráfica comparativa**: barras apiladas de entradas vs salidas por día.

![vista transacciones](/public/images/transacciones-1.png)
![crear transacciones](/public/images/transacciones-2.png)


### Productos (`/productos`)
- **CRUD completo**: creación, listado en tabla, vista de stock actual.
- **Campos**: nombre, stock inicial, precio, descripción, imagen, creador responsable.

![lista de productos](/public/images/productos-1.png)
![crear producto](/public/images/productos-2.png)


### Usuarios (`/usuarios`) — Solo ADMIN
- **CRUD completo**: creación con contraseña segura (regex validada), edición de rol, listado.
- **Roles**: `ADMIN` (acceso total) y `USER` (limitado a productos, pedidos y transacciones).

![lista de usarios](/public/images/usuarios-1.png)
![crear usuario](/public/images/usuarios-2.png)
![modificar rol del usuario](/public/images/usuarios-3.png)


### Autenticación
- Login con JWT + bcrypt, sesión manejada via httpOnly cookies.
- Middleware de protección de rutas con control de acceso por rol.
- Sidebar responsiva con menú adaptado al rol del usuario.

![lista de productos en movil](/public/images/movil-1.png)
![menú en movil ](/public/images/movil-2.png)
---

## 🛠️ Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4, shadcn/ui|
| Base de datos | PostgreSQL + Prisma |
| Validación | Zod 4 + React Hook Form |
| Autenticación | JWT + bcrypt |
| Gráficos | Recharts |
| Notificaciones | Sonner |
| Iconos | Lucide React |
| Paquete | pnpm |

---

## 📁 Estructura del proyecto

```
src/
├── app/                        
│   ├── (auth)/                 # Rutas públicas
│   │   ├── login/              # Inicio de sesión
│   │   └── payment/            # Página de pago/checkout
│   ├── (main)/                 # Panel administrativo (autenticado)
│   │   ├── pedidos/            # Gestión de pedidos
│   │   ├── productos/          # CRUD de productos
│   │   ├── transacciones/      # Movimientos de stock y gráficas
│   │   └── usuarios/           # Administración de usuarios
│   ├── layout.tsx              # Layout raíz
│   └── page.tsx                # Tienda pública (landing)
├── core/                       # Lógica compartida del núcleo
│   ├── components/             # Sidebar, navegación
│   ├── hooks/                  # useAuth
│   ├── providers/              # AuthProvider
│   └── types/                  # AuthContextType
├── features/                   # Módulos por funcionalidad
│   ├── auth/                   # Autenticación y login
│   ├── order/                  # Órdenes de compra
│   ├── payment/                # Flujo de pago simulado
│   ├── productos/              # CRUD de productos
│   ├── shop/                   # Tienda pública
│   ├── transacciones/          # Movimientos de stock
│   └── usuarios/               # CRUD de usuarios
├── shared/                     # Componentes y utilidades reutilizables
│   ├── components/ui/          
│   └── lib/                  
├── styles/                     # globals.css (Tailwind 4)
└── proxy.ts                    # Middleware de autenticación
```


