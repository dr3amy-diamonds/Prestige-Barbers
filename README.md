# Prestige Barbers

Plataforma digital integral para barbería que revoluciona la experiencia del cliente mediante portafolios dinámicos, sistema de reservas personalizado y comercio electrónico de productos capilares.

## Descripción General

**Prestige Barbers** es una solución completa diseñada para optimizar la gestión operativa de barberías modernas. El sistema permite a los clientes explorar portafolios profesionales de barberos, reservar turnos con profesionales específicos y adquirir productos capilares exclusivos, eliminando tiempos de espera innecesarios y mejorando significativamente la experiencia del usuario.

---

## Equipo de Desarrollo

| Nombre | Rol |
|--------|-----|
| **Juan Diego Arrieta Herrera** | Desarrollador Full Stack |
| **Valentina Ojeda Pascasión** | Desarrolladora Full Stack |

---

## Stack Tecnológico

### Backend
![Node.js Badge](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express Badge](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL Badge](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JWT Badge](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)

### Frontend
![HTML5 Badge](https://img.shields.io/badge/HTML5-E34C26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3 Badge](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript Badge](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## Seguridad

El proyecto ha sido sometido a auditorías exhaustivas de seguridad utilizando herramientas profesionales especializadas en detección de vulnerabilidades.

### Estado de Seguridad

| Aspecto | Estado | Detalles |
|---------|--------|----------|
| Headers de Seguridad | Implementado | 7/7 configurados con Helmet.js |
| CORS | Configurado | Lista blanca de orígenes permitidos |
| Rate Limiting | Implementado | 2 niveles: API general (100 req/15min), Auth endpoints (5 intentos/15min) |
| Validación de Inputs | Implementado | Express-validator en todos los endpoints |
| Protección SQL Injection | Implementado | Prepared statements y queries parametrizadas |
| Protección XSS | Implementado | CSP (Content Security Policy) y sanitización |
| Protección CSRF | Implementado | SameSite cookies |
| HTTPS Redirect | Implementado | Forzado en ambiente de producción |
| Auditorías | Completadas | Nessus y Nikto |

**Puntuación General de Seguridad: 9/10**


---

## Funcionalidades Principales

### Autenticación y Gestión de Usuarios
- Registro seguro con encriptación de contraseñas (bcrypt)
- Autenticación basada en JWT
- Cambio de contraseña y eliminación de cuenta
- Perfil de usuario persistente

### Portafolios de Profesionales
- Galería de cortes de cabello con categorización
- Galería de estilos de barba
- Sistema de destacados y principales
- Relaciones entre estilos para recomendaciones

### Sistema de Reservas
- Reservas directas con barbero específico
- Servicios adicionales dinámicos configurables
- Visualización de disponibilidad
- Cancelación de reservas
- Historial de reservas del usuario

### Comercio Electrónico
- Catálogo de productos capilares
- Carrito de compras dinámico
- Gestión de inventario

### Panel Administrativo
- Gestión completa de barberos
- Administración de productos
- Carga y gestión de imágenes
- Control de acceso administrativo

---

## Documentación

La documentación técnica completa está organizada en la carpeta `/docs`:

### Documentación Principal
- **01-Visión y Alcance.md** - Propósito, alcance y objetivos del sistema
- **02-nfrs.md** - Requisitos no funcionales
- **03-Contexto y Contenedores.md** - Diagramas C4
- **04-Backlog.md** - Backlog de historias de usuario
- **05-Sistema de Autenticación completo.md** - Especificación de autenticación
- **06-Sistema Modal de Autenticación.md** - Implementación de modales

### Documentación Frontend (`docs/docs_frontend/`)
- **07-Modales Personalizados y Detección de Sesión.md** - Componentes UI
- **08-Sistema Modal de Rservas.md** - Interfaz de reservas
- **09-Implementación de Tienda Dinamica.md** - Tienda virtual

### Documentación de Funcionalidades (`docs/docs_funcionalidades/`)
- **10-Sistema de Servicio Adicional Dinámico.md** - Servicios configurables
- **11-Sistema de Carrito de Compras.md** - E-commerce
- **12-Sistema de Gestión de Productos.md** - Inventario
- **13-Sistema de Reservas Completo.md** - Especificación completa de reservas

### Documentación de Seguridad (`docs/docs_seguridad/`)
- **14-Auditoría de Seguridad.md** - Informe de vulnerabilidades y soluciones

### Documentación Arquitectónica
- **ADR-000-monolito-node-postgres.md** - Arquitectura elegida y justificación

---

## Estructura del Proyecto

```
Prestige-Barbers/
│
├── Backend/
│   ├── database/
│   │   ├── agregar-admin.sql
│   │   ├── productos-schema.sql
│   │   ├── reservas-schema.sql
│   │   └── reservas-update-servicio-adicional.sql
│   ├── uploads/
│   ├── crear-admin.js
│   ├── install-security.js
│   ├── server.js
│   ├── verificar-admin.js
│   ├── verificar-columnas.js
│   ├── verificar-seguridad.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .env
│   ├── .env.example
│   └── .gitignore
│
├── Frontend/
│   └── public/
│       ├── index.html
│       ├── Admin/           (Panel administrativo)
│       ├── Barberos/        (Catálogo de barberos)
│       ├── Cortes/          (Galería de cortes)
│       ├── Reserva/         (Sistema de reservas)
│       ├── Tienda/          (E-commerce)
│       ├── Compra/          (Carrito de compras)
│       ├── perfil/          (Perfil de usuario)
│       ├── js/              (Scripts JavaScript)
│       ├── I-style/         (Estilos CSS)
│       ├── I-style-adm/     (Estilos admin)
│       ├── I-img/           (Imágenes)
│       ├── Icons/           (Iconos)
│       └── robots.txt
│
├── docs/
│   ├── 01-Visión y Alcance.md
│   ├── 02-nfrs.md
│   ├── 03-Contexto y Contenedores.md
│   ├── 04-Backlog.md
│   ├── 05-Sistema de Autenticación completo.md
│   ├── 06-Sistema Modal de Autenticación.md
│   ├── ADR-000-monolito-node-postgres.md
│   ├── ACTUALIZACIONES-CARRITO.md
│   ├── AUDITORIA-SEGURIDAD-PRESTIGE-BARBERS.md
│   ├── CORRECIONES-MODALES-Y-SESION.md
│   ├── IMPLEMENTACION-AUTH.md
│   ├── MODAL-RESERVA-DOCS.md
│   ├── SERVICIO-ADICIONAL-DINAMICO.md
│   ├── SISTEMA-CARRITO-COMPRAS.md
│   ├── SISTEMA-PRODUCTOS-ADMIN.md
│   ├── SISTEMA-RESERVAS-COMPLETO.md
│   ├── TIENDA-DINAMICA-IMPLEMENTADA.md
│   ├── docs_frontend/
│   ├── docs_funcionalidades/
│   ├── docs_seguridad/
│   └── docs_images/
│
├── Registros de seguridad/
│   ├── 0.0/
│   ├── 1.0/
│   └── 2.0/
│
├── package.json
├── README.md
└── .git/
```

---

## Requisitos del Sistema

### Hardware Mínimo
- Procesador: 1 GHz o superior
- Memoria RAM: 512 MB
- Almacenamiento: 500 MB disponibles

### Software Requerido
- Node.js 14.0 o superior
- MySQL 5.7 o superior
- Navegador moderno compatible con ES6

---

## Instalación

### Backend

1. Navegar a la carpeta Backend
```bash
cd Backend
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar variables de entorno
```bash
cp .env.example .env
```

4. Iniciar servidor
```bash
npm start          # Producción
npm run dev        # Desarrollo
```

### Frontend

El frontend se sirve automáticamente desde el servidor Express en la carpeta `Public`.

---

## Arquitectura

El proyecto implementa un diseño de arquitectura cliente-servidor monolítica con las siguientes características:

### Decisión Arquitectónica (ADR-000)
Se eligió una arquitectura monolítica Node.js + Express + MySQL por:
- Simplicidad operativa en fase MVP
- Escalabilidad inicial adecuada
- Compatibilidad directa con gateways de pago locales
- Facilidad de mantenimiento y despliegue
- Tecnologías estándar y accesibles

### Componentes Principales

```
┌─────────────────┐
│   Frontend      │ HTML5 / CSS3 / JavaScript Vanilla
│  (Navegador)    │ Modales, Carrito, Búsqueda
└────────┬────────┘
         │ HTTP/REST
         │
┌────────▼────────────────────────────┐
│   Backend (Node.js + Express)       │
├────────────────────────────────────┤
│ Routing         │ Endpoints REST    │
│ Middleware      │ Autenticación JWT │
│ Rate Limiting   │ Validación Input  │
│ Seguridad       │ Manejo de Files   │
└────────┬────────────────────────────┘
         │ MySQL Protocol
         │
┌────────▼────────────────┐
│   Base de Datos         │
│   MySQL 5.7+            │
│ - Usuarios              │
│ - Barberos              │
│ - Cortes / Barbas       │
│ - Reservas              │
│ - Productos             │
└─────────────────────────┘
```

---

## API REST Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener perfil actual (protegido)
- `POST /api/auth/change-password` - Cambiar contraseña (protegido)
- `DELETE /api/auth/delete-account` - Eliminar cuenta (protegido)
- `POST /api/auth/logout` - Cerrar sesión

### Catálogos
- `GET /api/cortes` - Listar cortes de cabello
- `GET /api/barberos` - Listar barberos
- `GET /api/productos` - Listar productos

### Reservas
- `POST /api/reservas` - Crear reserva (protegido)
- `GET /api/reservas/usuario/:id` - Mis reservas (protegido)
- `PUT /api/reservas/:id/cancelar` - Cancelar reserva (protegido)

### Panel Administrativo
- `POST /api/barberos` - Crear barbero
- `PUT /api/barberos/:id` - Actualizar barbero
- `DELETE /api/barberos/:id` - Eliminar barbero
- `POST /api/productos` - Crear producto
- `PUT /api/productos/:id` - Actualizar producto

---

## Variables de Entorno

Crear archivo `.env` en la carpeta `Backend`:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1234
DB_NAME=barberia

JWT_SECRET=tu_clave_secreta_aqui_cambiar_en_produccion
NODE_ENV=development

ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

---

## Criterios de Éxito MVP

El producto mínimo viable se evalúa mediante:

1. **Satisfacción del Cliente** - Validación directa en prototipos y entregables
2. **Funcionalidad** - Cumplimiento de requisitos principales
3. **Experiencia de Usuario** - Interfaz intuitiva y accesible
4. **Estabilidad** - Disponibilidad y rendimiento
5. **Seguridad** - Ausencia de vulnerabilidades críticas

El sistema está diseñado para evolucionar iterativamente basado en retroalimentación de usuarios reales, permitiendo ajustes, nuevas funcionalidades y optimizaciones progresivas.

---

## Pruebas de Seguridad

El proyecto ha completado auditorías de seguridad:

### Herramientas Utilizadas
- **Nessus** - Escaneo de vulnerabilidades
- **Nikto** - Análisis de seguridad web

### Reportes Disponibles
- `Registros de seguridad/0.0/` - Fase inicial
- `Registros de seguridad/1.0/` - Iteración 1
- `Registros de seguridad/2.0/` - Iteración 2 (Actual)

---

## Dependencias Principales

### Backend Dependencies
```json
{
  "express": "^5.1.0",
  "mysql2": "^3.15.1",
  "bcrypt": "^5.1.1",
  "jsonwebtoken": "^9.0.2",
  "helmet": "^7.2.0",
  "cors": "^2.8.5",
  "express-rate-limit": "^7.5.1",
  "express-validator": "^7.3.0",
  "multer": "^2.0.2",
  "dotenv": "^16.6.1",
  "winston": "^3.18.3"
}
```

---

## Contribución y Mejoras

Para sugerencias, reportes de bugs o mejoras:
1. Documenta claramente el problema o sugerencia
2. Incluye pasos para reproducir (si es un bug)
3. Proporciona evidencia (screenshots, logs)
4. Contacta con el equipo de desarrollo

---

## Licencia

Este proyecto está protegido. Todos los derechos reservados.

---

## Contacto y Soporte

Para consultas técnicas o soporte:
- **Juan Diego Arrieta Herrera**
- **Valentina Ojeda Pascasión**

---

**Última actualización:** Abril 2026  
**Versión:** 1.0.0  
**Estado:** En desarrollo activo

