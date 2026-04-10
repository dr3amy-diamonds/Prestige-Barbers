# Prestige Barbers

Plataforma digital integral para barbería que revoluciona la experiencia del cliente mediante portafolios dinámicos, sistema de reservas personalizado y comercio electrónico de productos capilares.

**Inicio Rápido:** Lee [QUICK-START.md](docs/QUICK-START.md) para poner la aplicación en funcionamiento en 3 minutos con Docker.

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

### DevOps & Contenedorización
![Docker Badge](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Docker Compose Badge](https://img.shields.io/badge/Docker%20Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![GitHub Badge](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

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

## Docker - Containerización

El proyecto está completamente containerizado con Docker, permitiendo despliegue consistente sin dependencias externas (no requiere XAMPP).

### Servicios Docker

| Servicio | Tecnología | Puerto | Propósito |
|----------|-----------|--------|-----------|
| Backend | Node.js 18 Alpine | 3000 | API REST de la aplicación |
| MariaDB | MariaDB 11.4 Alpine | 3306 | Base de datos relacional |
| Adminer | Adminer Latest | 8080 | Interfaz web para administrar BD |

### Inicio Rápido con Docker

**Windows:**
```bash
docker.bat up
```

**macOS/Linux:**
```bash
chmod +x docker.sh
./docker.sh up
```

**O directamente:**
```bash
docker-compose up -d
```

### Acceso a Servicios

- Backend API: http://localhost:3000
- Adminer (Gestor BD): http://localhost:8080
- Servidor BD: mariadb:3306

### Credenciales BD (Docker)

```
Usuario: prestige_user
Contraseña: prestige_password123
Base de datos: barberia
```

### Usuarios de Prueba

La base de datos incluye los siguientes usuarios de demostración listos para usar:

| Rol | Email | Contraseña |
|-----|-------|------------|
| Usuario | `usuario@demo.com` | `usuario123` |
| Usuario | `prueba@demo.com` | `usuario123` |
| Administrador | `admin@demo.com` | `admin123` |

### Panel de Administración

**URL:** http://localhost:3000/Admin/

```
Email: admin@demo.com
Contraseña: admin123
```

> Acceso completo a gestión de barberos, productos, reservas y más.

Para más detalles, ver [Guía Docker](docs/DOCKER-SETUP.md)


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

Dependiendo de tu método de instalación:

### Con Docker (Recomendado)
- Docker Desktop
- RAM: 2GB mínimo (4GB recomendado)

### Local (sin Docker)
- Node.js 14.0 o superior
- MySQL 5.7 o superior
- RAM: 1GB mínimo

---

## Instalación y Ejecución del Sistema

Este proyecto está completamente containerizado con Docker. Los siguientes pasos permiten ejecutar la aplicación en cualquier plataforma sin instalar dependencias adicionales.

---

### Requisitos Previos

**Opción 1: Docker (Recomendado - Sin XAMPP)**
- Docker Desktop instalado
- Docker Compose (incluido en Docker Desktop)
- RAM: 2GB mínimo (4GB recomendado)

Descargar Docker Desktop: https://www.docker.com/products/docker-desktop

**Opción 2: Local (Sin Docker - Requiere instalar todo manualmente)**
- Node.js 14.0 o superior
- MySQL 5.7 o superior
- XAMPP (opcional) o LAMP stack

---

### Guía Rápida: Inicio en 3 Minutos

#### Paso 1: Verificar Requisitos Docker

```bash
docker --version
docker-compose --version
```

Si no están instalados, descargar Docker Desktop desde: https://www.docker.com/products/docker-desktop

#### Paso 2: Navegar a la Carpeta del Proyecto

```bash
cd Prestige-Barbers-Clonado
```

#### Paso 3: Iniciar los Servicios

**En Windows:**
```bash
docker.bat up
```

**En macOS/Linux:**
```bash
chmod +x docker.sh
./docker.sh up
```

**O en cualquier sistema (alternativa):**
```bash
docker-compose up -d
```

#### Paso 4: Esperar a que Todo Esté Listo

```
Esperar 30-60 segundos a que veas:

✓ prestige-barbers-db       (HEALTHY)
✓ prestige-barbers-backend  (HEALTHY)  
✓ prestige-barbers-adminer  (UP)
```

#### Paso 5: Acceder a la Aplicación

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| **Backend API** | http://localhost:3000 | Test: `GET /api/auth/me` |
| **Gestor BD Web** | http://localhost:8080 | Usuario: `prestige_user` / Pass: `prestige_password123` |
| **Base de Datos** | localhost:3306 | Usuario: `prestige_user` / Pass: `prestige_password123` |

---

### Verificar que Todo Está Corriendo

```bash
# Ver estados de contenedores
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Ver solo logs del backend
docker-compose logs -f backend

# Ver solo logs de la BD
docker-compose logs -f mariadb
```

---

### Comandos Útiles para Docker

**Detener la aplicación:**
```bash
docker-compose down
```

**Reiniciar servicios:**
```bash
docker-compose restart
```

**Acceder a MariaDB desde terminal:**
```bash
docker-compose exec mariadb mariadb -u prestige_user -pprestige_password123 barberia
```

**Acceder a línea de comandos del backend:**
```bash
docker-compose exec backend sh
```

**Limpiar TODO (⚠️ elimina datos):**
```bash
docker-compose down -v
```

**Reconstruir después de cambios en dependencias:**
```bash
docker-compose build
docker-compose restart backend
```

---

### Solución de Problemas Comunes

#### Error: "Port 3000 already in use"
```bash
# Editar .env y cambiar:
APP_PORT=3001

# Luego reiniciar:
docker-compose down
docker-compose up -d
```

#### Error: "Cannot connect to Docker daemon"
- Asegurate que Docker Desktop está abierto
- En Linux: `sudo systemctl start docker`

#### MariaDB no inicia (unhealthy)
```bash
docker-compose down -v
docker-compose up -d
```

#### Los cambios en código no se reflejan
```bash
docker-compose build --no-cache
docker-compose restart backend
```

---

### Instalación Alternativa: Local (Sin Docker)

Si prefieres no usar Docker, sigue estos pasos:

#### Backend

1. Navegar a Backend:
```bash
cd Backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear archivo .env:
```bash
cp .env.example .env
```

4. Editar `.env` con tus credenciales locales de MySQL:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=barberia
```

5. Importar base de datos:
```bash
# Con MySQL instalado
mysql -u root -p < ../barberia.sql
```

6. Iniciar servidor:
```bash
npm start          # Producción
npm run dev        # Desarrollo
```

#### Frontend

El frontend se sirve automáticamente desde Express en `http://localhost:3000` una vez que el backend inicia.

---

### Estructura de Datos y Persistencia

Los datos se almacenan en volúmenes Docker persistentes:

| Ubicación | Contenido |
|-----------|----------|
| `mariadb_data/` | Base de datos completa |
| `Backend/uploads/` | Imágenes de barberos y productos |
| `Backend/logs/` | Logs de la aplicación |

**Nota:** Al hacer `docker-compose down` SIN `-v`, los datos se mantienen.

---

### Restaurar Base de Datos

El archivo `barberia.sql` se restaura automáticamente al iniciar MariaDB.

**Si necesitas restaurar manualmente:**
```bash
docker-compose exec mariadb mariadb -u prestige_user -pprestige_password123 barberia < barberia.sql
```

**O vía Adminer (http://localhost:8080):**
1. Ir a "Importar"
2. Seleccionar `barberia.sql`
3. Ejecutar

---

### Documentación Completa

Para información más detallada, consulta:

| Documento | Contenido |
|-----------|-----------|
| [QUICK-START.md](docs/QUICK-START.md) | Inicio rápido (resumen) |
| [DOCKER-SETUP.md](docs/DOCKER-SETUP.md) | Guía Docker completa (50+ secciones) |
| [ARQUITECTURA-DOCKER.md](docs/ARQUITECTURA-DOCKER.md) | Diagramas y diseño |
| [NGINX-PRODUCCION.md](docs/NGINX-PRODUCCION.md) | Configuración para producción |

---

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

