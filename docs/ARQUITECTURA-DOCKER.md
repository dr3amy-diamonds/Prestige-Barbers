# Arquitectura Docker - Prestige Barbers

## Diagrama General

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONTENEDORES DOCKER                          │
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │    Node.js       │  │     MariaDB      │  │   Adminer    │  │
│  │   Backend API    │  │   Base de Datos  │  │ (BD Manager) │  │
│  │                  │  │                  │  │              │  │
│  │  :3000/api/*     │  │  prestige-db     │  │  :8080       │  │
│  │                  │  │                  │  │              │  │
│  └────────┬─────────┘  └────────┬─────────┘  └──────┬───────┘  │
│           │                     │                    │          │
│           └─────────────────────┼────────────────────┘          │
│                                 │                                │
│                       prestige-network                           │
│                      (docker bridge)                             │
└─────────────────────────────────┬────────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
            ┌───────▼──────┐           ┌───────▼──────┐
            │   PUERTOS    │           │   VOLÚMENES  │
            │   EXPUESTOS  │           │              │
            ├──────────────┤           ├──────────────┤
            │ :3000        │           │ mariadb_data │
            │ :3306        │           │ uploads/     │
            │ :8080        │           │ logs/        │
            └──────────────┘           └──────────────┘
```

## Flujo de Datos

```
┌──────────────┐
│  Cliente     │ (Navegador en localhost)
│  Frontend    │
└──────┬───────┘
       │ HTTP/HTTPS
       │
       ▼
┌──────────────────────┐
│  API Node.js         │
│  :3000/api/*         │
│                      │
│  • Autenticación     │
│  • Lógica de negocio │
│  • Validación        │
│  • Rate Limiting     │
│  • CORS              │
└──────┬───────────────┘
       │ MySQL Protocol
       │
       ▼
┌──────────────────────┐
│  MariaDB 11.4        │
│  :3306               │
│                      │
│  • usuarios          │
│  • barberos          │
│  • cortes            │
│  • barbas            │
│  • productos         │
│  • reservas          │
└──────────────────────┘
```

## Estructura de Directorios Docker

```
Prestige-Barbers-Clonado/
│
├── Dockerfile                    # Imagen del backend (Node.js)
├── docker-compose.yml            # Orquestación de servicios
├── docker-compose.override.yml   # Sobrescrituras para desarrollo
├── .dockerignore                 # Archivos a excluir de imagen
│
├── .env                          # Configuración (generado)
├── .env.example.docker           # Template de .env
│
├── docker.sh                     # CLI para macOS/Linux
├── docker.bat                    # CLI para Windows
│
├── barberia.sql                  # Dump inicial de BD
│
├── Backend/
│   ├── server.js
│   ├── package.json
│   ├── uploads/                  # Volumen montado
│   ├── logs/                     # Volumen montado
│   └── node_modules/             # Volumen anónimo
│
├── Frontend/
│   └── public/                   # Servido por Node.js
│
└── docs/
    ├── QUICK-START.md            # Inicio en 3 minutos
    ├── DOCKER-SETUP.md           # Guía completa
    └── NGINX-PRODUCCION.md       # Configuración avanzada
```

## Ciclo de Vida de Contenedores

```
docker-compose up -d
    │
    ├─→ CREATE (si no existe)
    │   ├─ mariadb container
    │   ├─ backend container
    │   └─ adminer container
    │
    ├─→ BUILD (si necesario)
    │   └─ imagen Node.js desde Dockerfile
    │
    ├─→ START
    │   ├─ MariaDB inicia primero
    │   ├─ Backend espera health check
    │   └─ Adminer se conecta automáticamente
    │
    └─→ UP & RUNNING
        ├─ Logs accesibles
        ├─ Volumes montados
        └─ Red bridge activa
```

## Gestión de Datos

### Persistencia

```
Host (Tu computadora)          Docker (Contenedor)
──────────────────────────────────────────────────────

mariadb_data/                  /var/lib/mysql
  └─ Datos BD persistentes        └─ BD interna

Backend/uploads/               /app/uploads
  └─ Archivos subidos            └─ Imágenes, etc.

Backend/logs/                  /app/logs
  └─ Logs de aplicación          └─ Winston logs
```

### Volúmenes

| Volumen | Tipo | Host | Contenedor | Persistente |
|---------|------|------|-----------|-------------|
| mariadb_data | named | Docker managed | /var/lib/mysql | Sí |
| uploads | bind | Backend/uploads | /app/uploads | Sí |
| logs | bind | Backend/logs | /app/logs | Sí |
| node_modules | anónimo | N/A | /app/node_modules | Desarrollo |

## Red Docker

```
┌─────────────────────────────────────────┐
│        BRIDGE NETWORK                   │
│     (prestige-network)                  │
│                                         │
│  Backend ←─DNS─→ mariadb (resuelve)    │
│  Backend ←─DNS─→ adminer               │
│  Adminer ←─DNS─→ mariadb               │
│                                         │
│  IP Pool: 172.18.0.0/16 (Docker)       │
└─────────────────────────────────────────┘

Hosts locales: localhost, 127.0.0.1
Puertos: 3000, 3306, 8080 (forwarded)
```

## Estados de Salud (Health Checks)

```
MariaDB Health Check         Backend Health Check
├─ Comando: ping -h          ├─ Comando: HTTP GET
├─ Intervalo: 10s            ├─ Intervalo: 30s
├─ Timeout: 3s               ├─ Timeout: 5s
├─ Retries: 5                ├─ Retries: 5
└─ Estado: healthy/unhealthy └─ Estado: healthy/unhealthy

Backend espera a MariaDB
└─ depends_on con condition service_healthy
```

## Ciclo de Desarrollo

```
CAMBIO EN CÓDIGO (Backend/)
    │
    ├─ Sin docker.compose.override.yml
    │  └─ Necesita: docker-compose build && docker-compose up
    │
    └─ Con docker.compose.override.yml
       └─ Volumen montado
          ├─ Nodemon detecta cambios
          ├─ Servidor reinicia automáticamente
          └─ No necesita rebuild
```

## Comparativa: Docker vs XAMPP

| Aspecto | Docker | XAMPP |
|---------|--------|-------|
| Instalación | 5 min | 10 min |
| Configuración | 2 min (.env) | 30 min |
| Inicio | `docker-compose up` | Iniciar servicios XAMPP |
| Reproducibilidad | 100% idéntico | Varía por máquina |
| Aislamiento | Total | Compartido con SO |
| Escalabilidad | Multi-contenedor | Difícil |
| Producción | Directo | Requiere reconfiguracion |
| Limpieza | `docker-compose down -v` | Manual |
| Dependencias | Solo Docker | MySQL, PHP, Apache instalados |

## Comandos Frecuentes

```bash
# Iniciar
docker-compose up -d

# Logs
docker-compose logs -f backend

# Shell del backend
docker-compose exec backend sh

# Shell de mariadb
docker-compose exec mariadb mariadb -u prestige_user -pprestige_password123 barberia

# Detener
docker-compose down

# Detener y limpiar
docker-compose down -v

# Reconstruir
docker-compose build --no-cache

# Ver estado
docker-compose ps

# Reiniciar servicio
docker-compose restart backend
```

## Componentes de Imagen Docker

```
Node.js 18 Alpine (base)
├─ SO: Alpine Linux (5 MB)
├─ Runtime: Node.js 18 (165 MB)
├─ dumb-init (gestión signals)
└─ npm dependencies (~100-200 MB)
    └─ express, bcrypt, mysql2, etc.

Total: ~300-400 MB por imagen
```

## Recursos Recomendados

### Desarrollo
```
Docker Memory: 4 GB
CPU: 2 cores
Disk: 20 GB
```

### Producción (pequeña)
```
Docker Memory: 8 GB
CPU: 4 cores
Disk: 100 GB (+ backups)
```

## Próximos Niveles

- [ ] Docker Swarm (múltiples máquinas)
- [ ] Kubernetes (orquestación avanzada)
- [ ] CI/CD (GitHub Actions, GitLab CI)
- [ ] Monitoring (Prometheus, Grafana)
- [ ] Logging (ELK Stack)
- [ ] Backup automático
- [ ] Load balancing
