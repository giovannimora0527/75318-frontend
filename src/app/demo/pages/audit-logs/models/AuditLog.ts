export interface AuditLog {
  id: number;
  timestamp: string;
  usernameInput: string;
  eventType: string;
  description: string;
  ipAddress: string;
}

