import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  async get(url: string): Promise<any> {
    const req = await fetch(url);
    if (!req.ok) {
      throw new Error(`HTTP error! status: ${req.status}`);
    }
    return req.json();
  }
  async post(url: string, data: any): Promise<any> {
    const req = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!req.ok) {
      throw new Error(`HTTP error! status: ${req.status}`);
    }
    return req.json();
  }
}
