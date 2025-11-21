**Resumen: Recuperación de contraseña y control de intentos**

Este documento describe el flujo implementado en el backend de ejemplo (`backend_example`) para:
- Recuperación de contraseña (sin revelar información al usuario).
- Registro de intentos fallidos de inicio de sesión y bloqueo temporal.

Archivos relevantes
- `backend_example/server.js` : implementación de endpoints `/auth/password-recovery` y `/auth/login`, función `auditLog(...)` y constantes de configuración `MAX_FAILED` y `LOCK_MINUTES`.
- `backend_example/db/init.js` : definición de tablas `users`, `audit_logs` y `password_recovery_tokens` y semillas.

Cambios en la base de datos
- Tabla `users` (agregados/confirmados):
  - `failed_login_attempts INTEGER DEFAULT 0` — contador de intentos fallidos consecutivos.
  - `is_locked_until INTEGER DEFAULT NULL` — timestamp (epoch seconds) hasta el que el usuario permanece bloqueado.
- Tabla `password_recovery_tokens` (nueva):
  - `id, user_id, token, expires_at, used` — almacena tokens de recuperación con expiración y marcador de uso.
- Tabla `audit_logs` (ya existente):
  - `timestamp, username, ip, event, description` — registra eventos de auditoría.

Flujo: Recuperación de contraseña
1. El usuario envía su `username` mediante `POST /auth/password-recovery`.
2. Backend busca el usuario por `username`.
   - Si no existe: se inserta un registro en `audit_logs` con `event = PASSWORD_RECOVERY_INVALID_USER`, `username` (valor recibido), `ip` y `description = 'Username not found'`. Se responde al cliente con un mensaje genérico: "Si la cuenta existe, se ha enviado un correo con instrucciones." (no se revela si el usuario existe).
   - Si existe: se genera un token (actualmente no criptográficamente fuerte en el ejemplo) y se inserta en `password_recovery_tokens` con `expires_at`. Se registra `PASSWORD_RECOVERY_SENT` en `audit_logs`. En el ejemplo el token se imprime en consola (simula envío de email). Se responde con el mismo mensaje genérico.

Flujo: Intentos de login y bloqueo temporal
1. El usuario envía credenciales con `POST /auth/login`.
2. Backend valida existencia del usuario. Si no existe: `LOGIN_FAILED` auditado y se responde 401 con mensaje genérico.
3. Si el usuario existe y `is_locked_until` > ahora: se audit `LOGIN_BLOCKED` y se responde 423 (Account temporarily locked).
4. Si la contraseña es incorrecta:
   - Se incrementa `failed_login_attempts`.
   - Si `failed_login_attempts >= MAX_FAILED` (por defecto 3) se calcula `is_locked_until = now + LOCK_MINUTES*60` y se actualiza el usuario.
   - Se escribe `LOGIN_FAILED` con el número de intento y, si aplica, `USER_LOCKED` con la ventana de bloqueo.
   - Se responde 401 con mensaje genérico.
5. Si la contraseña es correcta: `failed_login_attempts` se resetea a 0, `is_locked_until` a NULL y se escribe `LOGIN_SUCCESS`.

Parámetros configurables
- `MAX_FAILED` : variable de entorno `MAX_FAILED_ATTEMPTS` (por defecto 3).
- `LOCK_MINUTES` : variable `LOCK_DURATION_MINUTES` en minutos (por defecto 5).

Buenas prácticas recomendadas (siguientes pasos)
- Usar `crypto.randomBytes()` para generar tokens seguros.
- Implementar endpoint para canjear token (`/auth/password-reset`) que verifique `expires_at` y marque `used = 1`.
- Integrar envío real de correo (SMTP / proveedor) en lugar de imprimir en consola.
- Asegurar manejo correcto de IPs si hay proxy (`trust proxy`) y usar cabeceras `X-Forwarded-For` si aplica.
- Considerar rate-limiting por IP además del contador por usuario.

Dónde mirar evidencia
- Consultar `backend_example/server.js` para ver los `auditLog(...)` insertando registros en `audit_logs`.
- Ejecutar consultas o usar `GET /audit/logs` para ver eventos `PASSWORD_RECOVERY_INVALID_USER`, `PASSWORD_RECOVERY_SENT`, `LOGIN_FAILED`, `USER_LOCKED`, `LOGIN_BLOCKED` y `LOGIN_SUCCESS`.

Fecha: 2025-11-21
