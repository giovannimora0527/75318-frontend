export interface LoginResponse {
  exitoso: boolean;
  mensaje: string;
  token?: string;
  username?: string;
  rol?: string;
  bloqueado: boolean;
  intentosRestantes?: number;
}