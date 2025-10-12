# ADR-000: Cliente-Servidor Node.js + MySQL con JWT

## Contexto
Plataforma digital Prestige Barbers para reservas, pagos en línea y
portafolios de barberos. Accesible desde navegadores web. Necesidad de
escalabilidad, separación de responsabilidades y soporte a pagos locales (Nequi,
Daviplata, tarjetas).

## Decisión
Arquitectura cliente-servidor con:
- Frontend: HTML, CSS, JavaScript.
- Backend: Node.js (Express).
- Persistencia: MySQL gestionada con PhpMyAdmin.
- Autenticación: JWT.

## Alternativas
- Monolito PHP + MySQL (simple, pero menos escalable).
- Microservicios (exceso de complejidad operativa).
- Frameworks frontend (React, Angular, Vue) — descartados en v1 para
priorizar simplicidad.

## Consecuencias
- (+) Escalabilidad inicial y modularidad.
- (+) Compatibilidad con pagos locales.
- (+) Uso de tecnologías estándar y accesibles.
- (–) Requiere gestión rigurosa de sesiones y datos personales.
- (–) Dependencia de servicios externos de pago.

## Estado
Aprobado (v1).
