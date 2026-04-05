#!/bin/bash

# Script para ejecutar comandos Docker en el proyecto Prestige Barbers
# Uso: ./docker.sh [comando]

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funciones
show_help() {
    echo "Prestige Barbers - Docker CLI"
    echo ""
    echo "Uso: ./docker.sh [comando]"
    echo ""
    echo "Comandos disponibles:"
    echo "  up                Inicia los servicios (MariaDB + Backend)"
    echo "  down              Detiene los servicios"
    echo "  restart           Reinicia los servicios"
    echo "  logs              Muestra logs en tiempo real"
    echo "  logs-backend      Muestra logs del backend"
    echo "  logs-db           Muestra logs de la BD"
    echo "  build             Construye las imágenes Docker"
    echo "  rebuild           Construye nuevamente todo"
    echo "  shell             Accede al shell del backend"
    echo "  db-shell          Accede al shell de MariaDB"
    echo "  status            Muestra estado de los contenedores"
    echo "  clean             Elimina contenedores y volúmenes"
    echo "  help              Muestra este mensaje"
    echo ""
    echo "Ejemplos:"
    echo "  ./docker.sh up              # Inicia los servicios"
    echo "  ./docker.sh logs            # Ve los logs"
    echo "  ./docker.sh down            # Detiene los servicios"
}

case "$1" in
    up)
        echo -e "${GREEN}Iniciando servicios...${NC}"
        docker-compose up -d
        echo -e "${GREEN}Servicios iniciados correctamente${NC}"
        echo ""
        echo "URLs disponibles:"
        echo "  - Backend: http://localhost:3000"
        echo "  - Adminer (BD): http://localhost:8080"
        echo ""
        echo "Credenciales BD:"
        echo "  - Host: mariadb"
        echo "  - Usuario: prestige_user"
        echo "  - Contraseña: prestige_password123"
        echo "  - BD: barberia"
        ;;
    down)
        echo -e "${YELLOW}Deteniendo servicios...${NC}"
        docker-compose down
        echo -e "${GREEN}Servicios detenidos${NC}"
        ;;
    restart)
        echo -e "${YELLOW}Reiniciando servicios...${NC}"
        docker-compose restart
        echo -e "${GREEN}Servicios reiniciados${NC}"
        ;;
    logs)
        docker-compose logs -f
        ;;
    logs-backend)
        docker-compose logs -f backend
        ;;
    logs-db)
        docker-compose logs -f mariadb
        ;;
    build)
        echo -e "${GREEN}Construyendo imágenes...${NC}"
        docker-compose build
        echo -e "${GREEN}Imágenes construidas${NC}"
        ;;
    rebuild)
        echo -e "${YELLOW}Limpiando y reconstruyendo...${NC}"
        docker-compose down -v
        docker-compose build --no-cache
        docker-compose up -d
        echo -e "${GREEN}Reconstrucción completada${NC}"
        ;;
    shell)
        docker-compose exec backend sh
        ;;
    db-shell)
        docker-compose exec mariadb mariadb -u prestige_user -pprestige_password123 barberia
        ;;
    status)
        docker-compose ps
        ;;
    clean)
        echo -e "${RED}Eliminando contenedores y volúmenes...${NC}"
        docker-compose down -v
        echo -e "${GREEN}Limpieza completada${NC}"
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo -e "${RED}Comando desconocido: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
