import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  decode(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error("Error decodificando token:", error);
      return null;
    }
  }

  getRequirePasswordChange(token: string): boolean {
    const decoded = this.decode(token);
    return decoded?.requirePasswordChange === true;
  }

  getUsername(token: string): string | null {
    const decoded = this.decode(token);
    return decoded?.sub || null;
  }
}
