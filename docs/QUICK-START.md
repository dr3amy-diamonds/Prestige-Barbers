# INICIO RÁPIDO - Prestige Barbers con Docker

Para poner la aplicación en funcionamiento en 3 minutos, sigue estos pasos:

## Paso 1: Verificar Requisitos

Necesitas tener instalado:
- Docker Desktop: https://www.docker.com/products/docker-desktop

**Verificar instalación:**
```bash
docker --version
docker-compose --version
```

---

## Paso 2: Navegar a la Carpeta del Proyecto

```bash
cd Prestige-Barbers-Clonado
```

---

## Paso 3: Iniciar Servicios

### En Windows:
```bash
docker.bat up
```

### En macOS/Linux:
```bash
./docker.sh up
```

### O cualquier sistema:
```bash
docker-compose up -d
```

**Espera a ver:**
```
✓ prestige-barbers-db       (HEALTHY)
✓ prestige-barbers-backend   (HEALTHY)
✓ prestige-barbers-adminer   (UP)
```

---

## Paso 4: Acceder a la Aplicación

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| **API Backend** | http://localhost:3000 | Test: `GET /api/auth/me` |
| **Gestor BD (Web)** | http://localhost:8080 | Usuario: `prestige_user` / Pass: `prestige_password123` |
| **BD Directamente** | localhost:3306 | Usuario: `prestige_user` |

---

## Paso 5: Verificar Estado

```bash
# Ver que todo está running
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Ver solo logs del backend
docker-compose logs -f backend

# Ver solo logs de BD
docker-compose logs -f mariadb
```

---

## Comandos Útiles

### Detener Servicios
```bash
docker-compose down
```

### Reiniciar Servicios
```bash
docker-compose restart
```

### Acceder a MariaDB desde Terminal
```bash
docker-compose exec mariadb mariadb -u prestige_user -pprestige_password123 barberia
```

### Acceder a Node.js Shell
```bash
docker-compose exec backend sh
```

### Limpiar TODO (⚠️ elimina datos)
```bash
docker-compose down -v
```

---

## Solución de Problemas Rápida

### Error: "Port 3000 already in use"
```bash
# Editar .env y cambiar:
APP_PORT=3001
# Luego:
docker-compose down
docker-compose up -d
```

### Error: "Cannot connect to Docker daemon"
- Asegúrate que Docker Desktop está abierto
- Reinicia Docker Desktop

### MariaDB no inicia (estado unhealthy)
```bash
# Eliminar volumen problemático
docker-compose down -v
# Reiniciar
docker-compose up -d
```

### Cambios en código no se reflejan
```bash
# Reconstruir imagen
docker-compose build
docker-compose restart backend
```

---

## Próximos Pasos

1. **Administrar BD:** Ir a http://localhost:8080
   - Host: `mariadb`
   - Usuario: `prestige_user`
   - Pass: `prestige_password123`
   - BD: `barberia`

2. **Probar API:** Usar Postman o similar en http://localhost:3000/api

3. **Ver documentación completa:** [DOCKER-SETUP.md](DOCKER-SETUP.md)

4. **Entrar en desarrollo:** Edita archivos en `Backend/` y verás cambios automáticos

---

## Importante

- El archivo `.env` se creó automáticamente desde `.env.example.docker`
- Los datos de BD se cargan automáticamente desde `barberia.sql`
- Los datos persisten en `mariadb_data` volumen
- Subidas de usuarios se guardan en `Backend/uploads`

---

## Soporte Rápido

```bash
# Ver todos los comandos disponibles
docker.bat help          # Windows
./docker.sh help         # macOS/Linux

# Ver recursos usados
docker stats

# Ver volúmenes
docker volume ls

# Ver redes
docker network ls
```

---

¡Listo! Tu aplicación Prestige Barbers está corriendo sin XAMPP necesario.
