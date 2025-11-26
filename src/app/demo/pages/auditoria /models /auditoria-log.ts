export interface AuditoriaLog {
  fechaHora: string;        // ISO 8601
  usernameIngresado: string;
  motivo: string;           // Ej: "LOGIN_EXITOSO", "INTENTO_LOGIN_FALLIDO"
  exitoso: boolean;
  descripcionError?: string;
  ipAddress: string;
  userAgent: string;
}
