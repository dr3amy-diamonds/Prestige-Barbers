# Prestige-Barbers
Proyecto de Arquitectura de Software



## Criterios de Éxito del Producto Mínimo Viable (MVP)

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

### 📁 docs/
- `01-vision-alcance.md` → Documento de visión y alcance del sistema.  
- `02-nfrs.md` → Requisitos no funcionales (NFRs).  
- `03-c4-contexto-contenedores.md` → Diagramas C4: contexto y contenedores.  
- `04-backlog.md` → Backlog inicial con historias de usuario.  
- 📂 `docs_images/` → Carpeta de imágenes usadas en la documentación.  

### 📁 adr/
- `ADR-000-monolito-node-postgres.md` → Primera decisión arquitectónica documentada (ADR).  



## Estructura de Carpetas
📂 Proyecto/
├── 📂 adr/
│   └── ADR-000-monolito-node-postgres.md
│
├── 📂 Backend/
│   ├── 📂 node_modules/
│   ├── .env
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
│
├── 📂 docs/
│   ├── 📂 docs_images/
│   │   ├── image.jpg
│   │   └── image2.png
│   ├── 01-vision-alcance.md
│   ├── 02-nfrs.md
│   ├── 03-c4-contexto-contenedores.md
│   └── 04-backlog.md
│
├── 📂 Frontend/
│   └── 📂 public/
│       └── index.html
│
└── README.md
