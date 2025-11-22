import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  getRequirePasswordChange(token: string): boolean {
    const decoded = this.decodeToken(token);
    return decoded?.requirePasswordChange === true;
  }
}
