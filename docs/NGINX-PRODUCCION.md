# Configuración Nginx - Reverse Proxy para Producción

Configuración recomendada para usar Nginx como reverse proxy en producción.

## Archivo: docker-compose.prod.yml

```yaml
version: '3.8'

services:
  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: prestige-nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
      - ./logs/nginx:/var/log/nginx
    depends_on:
      - backend
    networks:
      - prestige-network

  mariadb:
    image: mariadb:11.4-alpine
    container_name: prestige-db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    volumes:
      - mariadb_data:/var/lib/mysql
      - ./barberia.sql:/docker-entrypoint-initdb.d/init.sql:ro
    networks:
      - prestige-network

  backend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: prestige-api
    restart: always
    depends_on:
      mariadb:
        condition: service_healthy
    environment:
      NODE_ENV: production
      PORT: 3000
      DB_HOST: mariadb
      DB_USER: ${DB_USER}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_NAME: ${DB_NAME}
      JWT_SECRET: ${JWT_SECRET}
      ALLOWED_ORIGINS: ${ALLOWED_ORIGINS}
    volumes:
      - ./Backend/uploads:/app/uploads
      - ./Backend/logs:/app/logs
    networks:
      - prestige-network

networks:
  prestige-network:
    driver: bridge

volumes:
  mariadb_data:
    driver: local
```

## Archivo: nginx.conf

```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 20M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json;

    # Upstream backend
    upstream prestige_backend {
        server backend:3000;
    }

    # HTTP redirect to HTTPS
    server {
        listen 80;
        server_name _;
        return 301 https://$host$request_uri;
    }

    # HTTPS Server
    server {
        listen 443 ssl http2;
        server_name prestigebarbers.com www.prestigebarbers.com;

        # SSL
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        # Security headers
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        add_header X-Frame-Options "DENY" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

        # Root location
        location / {
            root /app/Frontend/public;
            try_files $uri $uri/ =404;
        }

        # API proxy
        location /api/ {
            proxy_pass http://prestige_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;

            # Timeouts
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # Uploads
        location /uploads/ {
            alias /app/uploads/;
            expires 30d;
            access_log off;
        }

        # Health check
        location /health {
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

## Obtener Certificados SSL

### Con Let's Encrypt (gratuito)

```bash
# Instalar Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot certonly --standalone -d prestigebarbers.com -d www.prestigebarbers.com

# Los certificados estarán en:
# /etc/letsencrypt/live/prestigebarbers.com/

# Copiar a carpeta ssl/
sudo cp /etc/letsencrypt/live/prestigebarbers.com/fullchain.pem ./ssl/
sudo cp /etc/letsencrypt/live/prestigebarbers.com/privkey.pem ./ssl/

# Renovación automática
sudo systemctl enable certbot.timer
```

## Usar Configuración de Producción

```bash
# Usar docker-compose.prod.yml en lugar del default
docker-compose -f docker-compose.prod.yml up -d

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f
```

## Monitoreo en Producción

```bash
# Ver estadísticas de Nginx
docker-compose exec nginx nginx -T

# Recargar configuración (sin downtime)
docker-compose exec nginx nginx -s reload

# Ver logs
docker-compose -f docker-compose.prod.yml logs nginx
```

## Variables de Entorno para Producción

```env
NODE_ENV=production
JWT_SECRET=<random_strong_key>
DB_USER=<strong_user>
DB_PASSWORD=<strong_password>
ALLOWED_ORIGINS=https://prestigebarbers.com,https://www.prestigebarbers.com
```

## Checklist Producción

- [ ] Certificados SSL configurados
- [ ] Nginx reverse proxy activo
- [ ] JWT_SECRET cambiado a valor fuerte
- [ ] BD con usuario seguro
- [ ] CORS limitado a dominios autorizados
- [ ] Logs centralizados
- [ ] Backups automáticos
- [ ] Monitoreo activo
- [ ] Rate limiting configurado
- [ ] HTTPS forzado
