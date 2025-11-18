# Prestige-Barbers

## 📖 Sobre el Proyecto

**Prestige Barbers** es una plataforma digital integral para barbería que permite a los clientes explorar portafolios de barberos, reservar turnos personalizados y adquirir productos capilares exclusivos, mejorando la experiencia y eliminando tiempos de espera.

## 🔐 Seguridad

Este proyecto ha sido auditado con **Nessus** y **Nikto** y todas las vulnerabilidades han sido corregidas.

### 📋 Estado de Seguridad

- ✅ **Headers de Seguridad:** 7/7 implementados
- ✅ **CORS:** Configurado con whitelist
- ✅ **Rate Limiting:** Implementado (2 niveles)
- ✅ **Validación de Inputs:** Express-validator
- ✅ **SQL Injection:** Protegido
- ✅ **XSS:** Mitigado con CSP y sanitización
- ✅ **CSRF:** Protegido con SameSite cookies

**Score de Seguridad:** 🟢 **9/10**


## 🎯 Criterios de Éxito del Producto Mínimo Viable (MVP)

Los criterios de éxito del Producto Mínimo Viable (MVP) estarán
determinados principalmente por el nivel de satisfacción del cliente frente a las
funcionalidades entregadas en las primeras versiones del sistema. Para ello, se considerará
como parámetro clave la validación directa del cliente sobre los prototipos y entregables,
asegurando que estos respondan adecuadamente a la problemática planteada y a las
necesidades del público objetivo.

Dado que el sistema continuará evolucionando tras su lanzamiento inicial, se
contempla un proceso iterativo de mejora basado en la retroalimentación de los
consumidores finales. La interacción real con la plataforma permitirá identificar ajustes
necesarios, nuevas funcionalidades y detalles finales que optimicen la experiencia del
usuario. Esta retroalimentación será gestionada por el Product Owner y canalizada hacia el
equipo de desarrollo para su análisis e implementación.

## 📂 Mapa de Documentación

### 📁 Documentación Principal (docs/)
- `01-Visión y Alcance.md` → Propósito, alcance y objetivos del sistema.
- `02-nfrs.md` → Requisitos no funcionales (NFRs).
- `03-Contexto y Contenedores.md` → Diagramas C4: contexto y contenedores.
- `04-Backlog.md` → Backlog inicial con historias de usuario.
- `05-Sistema de Autenticación completo.md` → Documentación del sistema de autenticación.
- `06-Sistema Modal de Autenticación.md` → Implementación de modales de autenticación.

### 📁 Documentación Frontend (docs/docs_frontend/)
- `07-Modales Personalizados y Detección de Sesión.md` → Modales y gestión de sesión.
- `08-Sistema Modal de Rservas.md` → Sistema de reservas.
- `09-Implementación de Tienda Dinamica.md` → Tienda virtual dinámica.

### 📁 Documentación Funcionalidades (docs/docs_funcionalidades/)
- `10-Sistema de Servicio Adicional Dinámico.md` → Servicios adicionales en reservas.
- `11-Sistema de Carrito de Compras.md` → Carrito de compras.
- `12-Sistema de Gestión de Productos.md` → Gestión de productos.
- `13-Sistema de Reservas Completo .md` → Sistema completo de reservas.

### 📁 Documentación Seguridad (docs/docs_seguridad/)
- `14-Auditoría de Seguridad.md` → Auditoría y análisis de vulnerabilidades.

### 📁 Imágenes (docs/docs_images/)
- Imágenes usadas en la documentación.

### 📁 Decisiones Arquitectónicas (adr/)
- `ADR-000-monolito-node-postgres.md` → Decisión arquitectónica principal.

## Estructura de Carpetas

```bash
Prestige-Barbers/
│
├── adr/
│   └── ADR-000-monolito-node-postgres.md
│
├── Backend/
│   ├── database/
│   │   ├── agregar-admin.sql
│   │   ├── productos-schema.sql
│   │   ├── reservas-schema.sql
│   │   └── reservas-update-servicio-adicional.sql
│   ├── uploads/
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── crear-admin.js
│   ├── install-security.js
│   ├── package-lock.json
│   ├── package.json
│   ├── server.js
│   ├── verificar-admin.js
│   ├── verificar-columnas.js
│   └── verificar-seguridad.js
│
├── docs/
│   ├── docs_frontend/
│   │   ├── 07-Modales Personalizados y Detección de Sesión.md
│   │   ├── 08-Sistema Modal de Rservas.md
│   │   └── 09-Implementación de Tienda Dinamica.md
│   ├── docs_funcionalidades/
│   │   ├── 10-Sistema de Servicio Adicional Dinámico.md
│   │   ├── 11-Sistema de Carrito de Compras.md
│   │   ├── 12-Sistema de Gestión de Productos.md
│   │   └── 13-Sistema de Reservas Completo .md
│   ├── docs_images/
│   │   ├── image.jpg
│   │   └── image2.png
│   ├── docs_seguridad/
│   │   └── 14-Auditoría de Seguridad.md
│   ├── 01-Visión y Alcance.md
│   ├── 02-nfrs.md
│   ├── 03-Contexto y Contenedores.md
│   ├── 04-Backlog.md
│   ├── 05-Sistema de Autenticación completo.md
│   └── 06-Sistema Modal de Autenticación.md
│
├── Frontend/
│   └── public/
│       ├── Admin/
│       ├── Barberos/
│       ├── Compra/
│       ├── Cortes/
│       ├── I-img/
│       ├── I-style/
│       ├── I-style-adm/
│       ├── Icons/
│       ├── js/
│       ├── perfil/
│       ├── Reserva/
│       ├── Tienda/
│       └── index.html
│
├── Registros de seguridad/
│   ├── 0.0/
│   ├── 1.0/
│   └── 2.0/
│
├── node_modules/
├── package-lock.json
├── package.json
└── README.md
```

