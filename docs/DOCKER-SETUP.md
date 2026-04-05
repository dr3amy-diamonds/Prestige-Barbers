# Guía Docker - Prestige Barbers

## Requisitos Previos

### Windows
- Docker Desktop para Windows
- WSL 2 (Windows Subsystem for Linux 2)
- Mínimo 4GB RAM asignado a Docker

**Descargar:** https://www.docker.com/products/docker-desktop

### macOS
- Docker Desktop para macOS
- Mínimo 4GB RAM asignado a Docker

**Descargar:** https://www.docker.com/products/docker-desktop

### Linux
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker.io docker-compose

# Iniciar servicio
sudo systemctl start docker
sudo systemctl enable docker
```

---

## Configuración Rápida

### 1. Clonar o descargar el proyecto

```bash
cd Prestige-Barbers-Clonado
```

### 2. Crear archivo .env

```bash
# Windows
copy .env.example.docker .env

# macOS/Linux
cp .env.example.docker .env
```

### 3. Iniciar los servicios

**Windows:**
```bash
docker.bat up
```

**macOS/Linux:**
```bash
chmod +x docker.sh
./docker.sh up
```

O directamente:
```bash
docker-compose up -d
```

### 4. Verificar que está corriendo

```bash
docker-compose ps
```

Deberías ver:
- `prestige-barbers-db` - MariaDB (healthy)
- `prestige-barbers-backend` - Node.js API (healthy)
- `prestige-barbers-adminer` - DB Manager (running)

---

## Acceso a Servicios

### Backend API
- URL: `http://localhost:3000`
- Endpoints: http://localhost:3000/api/*

### Base de Datos (Adminer Web)
- URL: `http://localhost:8080`
- Servidor: `mariadb`
- Usuario: `prestige_user`
- Contraseña: `prestige_password123`
- Base de datos: `barberia`

### Acceso Directo a MariaDB
Desde terminal:
```bash
# Windows
docker.bat db-shell

# macOS/Linux
./docker.sh db-shell

# O directamente
docker-compose exec mariadb mariadb -u prestige_user -pprestige_password123 barberia
```

---

## Comandos Útiles

### Windows (docker.bat)

```bash
# Iniciar servicios
docker.bat up

# Detener servicios
docker.bat down

# Ver logs en tiempo real
docker.bat logs

# Ver logs solo del backend
docker.bat logs-backend

# Ver logs solo de la BD
docker.bat logs-db

# Reiniciar servicios
docker.bat restart

# Acceder a shell del backend
docker.bat shell

# Acceder a MariaDB
docker.bat db-shell

# Ver estado de contenedores
docker.bat status

# Limpiar todo (elimina contenedores y datos)
docker.bat clean

# Reconstruir desde cero
docker.bat rebuild
```

### macOS/Linux (docker.sh)

```bash
# Hacer script ejecutable (primera vez)
chmod +x docker.sh

# Luego los mismos comandos
./docker.sh up
./docker.sh down
./docker.sh logs
# ... etc
```

### Comandos Docker Nativos

```bash
# Iniciar contenedores
docker-compose up -d

# Detener contenedores
docker-compose down

# Ver logs
docker-compose logs -f

# Logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f mariadb

# Reconstruir imágenes
docker-compose build

# Ejecutar comando en contenedor
docker-compose exec backend npm install
docker-compose exec mariadb mariadb -u prestige_user -pprestige_password123
```

---

## Estructura de Datos

### Persistencia

Los datos están persistidos en Docker volumes:

```
mariadb_data/          # Datos de MariaDB (persistentes)
Backend/uploads/       # Archivos subidos (persistentes)
Backend/logs/         # Logs de la aplicación (persistentes)
```

Para ver volúmenes:
```bash
docker volume ls
docker volume inspect prestige-barberia_mariadb_data
```

---

## Restaurar Base de Datos

El dump `barberia.sql` se restaura automáticamente al iniciar MariaDB por primera vez.

### Si necesitas restaurar manualmente:

```bash
# Copiar archivo SQL al contenedor y ejecutarlo
docker-compose exec mariadb mariadb -u prestige_user -pprestige_password123 barberia < barberia.sql

# O a través de Adminer (http://localhost:8080)
# 1. Ir a Importar
# 2. Seleccionar barberia.sql
# 3. Ejecutar
```

---

## Variables de Entorno

Las variables están configuradas en `.env` (que creas desde `.env.example.docker`).

### Variables principales:

```env
# Base de datos
DB_HOST=mariadb              # Nombre del servicio Docker
DB_PORT=3306
DB_USER=prestige_user
DB_PASSWORD=prestige_password123
DB_NAME=barberia

# JWT
JWT_SECRET=tu_clave_secreta_aqui

# API
PORT=3000
NODE_ENV=development

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

---

## Modo Desarrollo vs Producción

### Desarrollo (por defecto)

- Hot reload habilitado (cambios automáticos)
- Logs detallados
- Adminer disponible para administrar BD
- Volúmenes montados para código

```bash
NODE_ENV=development docker-compose up
```

### Producción

```bash
# Crear .env con NODE_ENV=production
NODE_ENV=production docker-compose -f docker-compose.yml up -d
```

**Cambios recomendados para producción:**
1. Cambiar `JWT_SECRET` por uno aleatorio fuerte
2. Cambiar contraseña de BD
3. Remover Adminer (comentar servicio)
4. Usar reverse proxy (Nginx)
5. Habilitar HTTPS
6. Limitar CORS a dominios específicos

---

## Solución de Problemas

### Puerto ya en uso

```bash
# Cambiar puerto en .env
APP_PORT=3001           # En lugar de 3000
DB_PORT_EXPOSE=3307     # En lugar de 3306

# Luego reiniciar
docker-compose down
docker-compose up -d
```

### MariaDB no inicia

```bash
# Ver logs
docker-compose logs mariadb

# Si hay problemas de volumen
docker-compose down -v  # Elimina volúmenes
docker-compose up -d    # Reinicia (recrea volumen)
```

### Backend no conecta a BD

Verificar:
1. MariaDB esté en estado `healthy`: `docker-compose ps`
2. Variables de entorno sean correctas en `.env`
3. `DB_HOST=mariadb` (no localhost cuando estás en Docker)

```bash
# Verificar conectividad
docker-compose exec backend ping mariadb
```

### Limpiar todo para empezar de cero

```bash
docker-compose down -v          # Elimina contenedores y volúmenes
docker system prune -a          # Limpia imágenes no usadas
docker-compose up -d --build    # Reconstruye desde cero
```

---

## Monitoreo y Logs

### Ver logs en tiempo real

```bash
# Todos los servicios
docker-compose logs -f

# Servicios específicos
docker-compose logs -f backend
docker-compose logs -f mariadb
docker-compose logs -f adminer

# Últimas 50 líneas
docker-compose logs --tail=50 backend
```

### Monitor de recursos

```bash
# Ver consumo de CPU, memoria, etc
docker stats
```

---

## Integración con IDEs

### VS Code

1. Instalar extensión "Dev Containers"
2. Instalar extensión "Remote - Containers"
3. Abrir carpeta en contenedor

### WebStorm/IntelliJ

1. Settings → Project → Python Interpreter
2. Agregar Docker Compose interpreter
3. Seleccionar servicio `backend`

---

## Backups

### Backup de datos

```bash
# Exportar datos de MariaDB
docker-compose exec mariadb mariadb-dump -u prestige_user -pprestige_password123 barberia > backup_$(date +%Y%m%d_%H%M%S).sql

# Copiar volumenes
docker run --rm -v prestige-barberia_mariadb_data:/data -v $(pwd):/backup alpine tar czf /backup/mariadb_backup_$(date +%Y%m%d_%H%M%S).tar.gz /data
```

### Restaurar desde backup

```bash
# Restaurar SQL
docker-compose exec mariadb mariadb -u prestige_user -pprestige_password123 barberia < backup_20260405_120000.sql
```

---

## Actualizaciones

### Actualizar imágenes base

```bash
docker-compose pull
docker-compose up -d
```

### Reconstruir backend después de cambios en dependencias

```bash
docker-compose build --no-cache backend
docker-compose up -d
```

---

## Despliegue

Para despliegue en producción, considerar:

1. Usar Docker Swarm o Kubernetes
2. Servir con reverse proxy (Nginx/Apache)
3. Habilitar HTTPS con Let's Encrypt
4. Usar secretos de Docker/K8s para credenciales
5. Implementar CI/CD (GitHub Actions, GitLab CI)
6. Monitoreo (Prometheus, GraphQL, ELK)

---

## Recursos Útiles

- Docker Docs: https://docs.docker.com/
- MariaDB Docker: https://hub.docker.com/_/mariadb
- Node.js Docker: https://hub.docker.com/_/node
- Compose Spec: https://compose-spec.io/

---

## Soporte

Para problemas o preguntas:
- Revisar logs: `docker-compose logs`
- Verificar .env esté bien configurado
- Asegurar que puertos no estén en conflicto
- Consultar documentación oficial de Docker
