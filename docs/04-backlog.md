### 04. Backlog

### 🔹 Usabilidad
- **Escenario:**  
  Dado que el usuario accede por primera vez a la plataforma, cuando navega por las secciones principales, entonces debe comprender intuitivamente cómo reservar un turno sin necesidad de asistencia externa.  
- **Métrica de Evaluación:**  
  Tiempo promedio para completar una reserva ≤ 3 minutos.  
- **Evidencia Esperada:**  
  Resultados de pruebas de usuario y validación del cliente.  

---

### 🔹 Disponibilidad
- **Escenario:**  
  Dado que el sistema está en producción, cuando un usuario intenta acceder en horario comercial, entonces la plataforma debe estar operativa sin interrupciones.  
- **Métrica de Evaluación:**  
  Disponibilidad mensual ≥ 99.5%.  
- **Evidencia Esperada:**  
  Informes de monitoreo del servidor y registros del tiempo de disponibilidad en el sistema.  

---

### 🔹 Seguridad
- **Escenario:**  
  Dado que el usuario inicia sesión, cuando ingresa sus credenciales y datos personales, entonces estos deben ser cifrados y protegidos contra accesos no autorizados.  
- **Métrica de Evaluación:**  
  Cifrado AES-256, autenticación con doble factor.  
- **Evidencia Esperada:**  
  Auditorías de seguridad y resultados de pruebas de penetración.  

---

### 🔹 Escalabilidad
- **Escenario:**  
  Dado que la cantidad de usuarios activos aumenta, cuando se superan los 1000 accesos simultáneos, entonces el sistema debe mantener su rendimiento sin degradación perceptible.  
- **Métrica de Evaluación:**  
  Tiempo de respuesta ≤ 2 segundos bajo carga.  
- **Evidencia Esperada:**  
  Pruebas de estrés y simulaciones de tráfico concurrente. 