import { Injectable, inject, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

export interface SummaryRow {
  test: string;
  positive: number;
  negative: number;
  total: number;
  positivePercent: string;
  negativePercent: string;
  totalPercent: string;
}

@Injectable({
  providedIn: 'root',
})
export class TestResultService {
  private http = inject(HttpService);
  private baseUrl = isDevMode() ? 'http://localhost:4000' : '';

  saveTestResult(data: {
    date: string;
    test: string;
    result: string;
  }): Promise<{ message: string }> {
    return this.http.post(`${this.baseUrl}/api/test-results`, data);
  }

  getSummary(startDate: string, endDate: string): Promise<SummaryRow[]> {
    return this.http.get(
      `${this.baseUrl}/api/test-results/summary?startDate=${startDate}&endDate=${endDate}`,
    );
  }

  downloadCsv(startDate: string, endDate: string): void {
    window.open(
      `${this.baseUrl}/api/test-results/csv?startDate=${startDate}&endDate=${endDate}`,
      '_blank',
    );
  }
}
