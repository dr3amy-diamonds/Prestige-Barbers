@echo off
REM Script para ejecutar comandos Docker en Windows
REM Uso: docker.bat [comando]

setlocal enabledelayedexpansion

if "%1%"=="" (
    call :show_help
    exit /b 1
)

if /i "%1%"=="up" (
    echo Iniciando servicios...
    docker-compose up -d
    echo.
    echo Servicios iniciados correctamente
    echo.
    echo URLs disponibles:
    echo   - Backend: http://localhost:3000
    echo   - Adminer (BD): http://localhost:8080
    echo.
    echo Credenciales BD:
    echo   - Host: mariadb
    echo   - Usuario: prestige_user
    echo   - Contrasena: prestige_password123
    echo   - BD: barberia
    exit /b 0
)

if /i "%1%"=="down" (
    echo Deteniendo servicios...
    docker-compose down
    echo Servicios detenidos
    exit /b 0
)

if /i "%1%"=="restart" (
    echo Reiniciando servicios...
    docker-compose restart
    echo Servicios reiniciados
    exit /b 0
)

if /i "%1%"=="logs" (
    docker-compose logs -f
    exit /b 0
)

if /i "%1%"=="logs-backend" (
    docker-compose logs -f backend
    exit /b 0
)

if /i "%1%"=="logs-db" (
    docker-compose logs -f mariadb
    exit /b 0
)

if /i "%1%"=="build" (
    echo Construyendo imagenes...
    docker-compose build
    echo Imagenes construidas
    exit /b 0
)

if /i "%1%"=="rebuild" (
    echo Limpiando y reconstruyendo...
    docker-compose down -v
    docker-compose build --no-cache
    docker-compose up -d
    echo Reconstruccion completada
    exit /b 0
)

if /i "%1%"=="shell" (
    docker-compose exec backend sh
    exit /b 0
)

if /i "%1%"=="db-shell" (
    docker-compose exec mariadb mariadb -u prestige_user -pprestige_password123 barberia
    exit /b 0
)

if /i "%1%"=="status" (
    docker-compose ps
    exit /b 0
)

if /i "%1%"=="clean" (
    echo Eliminando contenedores y volumenes...
    docker-compose down -v
    echo Limpieza completada
    exit /b 0
)

if /i "%1%"=="help" (
    call :show_help
    exit /b 0
)

if /i "%1%"=="--help" (
    call :show_help
    exit /b 0
)

if /i "%1%"=="-h" (
    call :show_help
    exit /b 0
)

echo Comando desconocido: %1%
echo.
call :show_help
exit /b 1

:show_help
echo Prestige Barbers - Docker CLI
echo.
echo Uso: docker.bat [comando]
echo.
echo Comandos disponibles:
echo   up                Inicia los servicios (MariaDB + Backend)
echo   down              Detiene los servicios
echo   restart           Reinicia los servicios
echo   logs              Muestra logs en tiempo real
echo   logs-backend      Muestra logs del backend
echo   logs-db           Muestra logs de la BD
echo   build             Construye las imagenes Docker
echo   rebuild           Construye nuevamente todo
echo   shell             Accede al shell del backend
echo   db-shell          Accede al shell de MariaDB
echo   status            Muestra estado de los contenedores
echo   clean             Elimina contenedores y volumenes
echo   help              Muestra este mensaje
echo.
echo Ejemplos:
echo   docker.bat up              # Inicia los servicios
echo   docker.bat logs            # Ve los logs
echo   docker.bat down            # Detiene los servicios
goto :eof
