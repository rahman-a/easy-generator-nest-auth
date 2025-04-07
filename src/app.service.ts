import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  entry(): string {
    return `
    <h1>Access Denied</h1>
    <p>You don't have permission to access API on this server.</p>
    `;
  }
}
