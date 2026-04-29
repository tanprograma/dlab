import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { TestResultService, SummaryRow } from '../services/test-result.service';
import { CommonModule } from '@angular/common';

type NotificationMessage = {
  type: 'success' | 'error' | 'info';
  message: string;
};

@Component({
  selector: 'app-summary',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './summary.html',
  styleUrl: './summary.scss',
})
export class SummaryComponent {
  private fb = inject(FormBuilder);
  private testResultService = inject(TestResultService);

  loading = signal(false);
  notification = signal<NotificationMessage | null>(null);
  summaryRows = signal<SummaryRow[]>([]);
  displayedRows = computed(() => this.summaryRows());

  form = this.fb.group({
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
  });

  async getSummary() {
    console.log('running script');
    if (!this.form.valid) {
      this.notification.set({ type: 'error', message: 'Please select both dates.' });
      return;
    }

    const { startDate, endDate } = this.form.value as { startDate: string; endDate: string };
    this.loading.set(true);
    this.notification.set(null);
    try {
      const data = await this.testResultService.getSummary(startDate, endDate);
      console.log('data', data);
      this.summaryRows.set(data);
      if (!data.length) {
        this.notification.set({
          type: 'info',
          message: 'No results found for the selected date range.',
        });
      }
    } catch (error) {
      this.notification.set({
        type: 'error',
        message: (error as { message: string })?.message ?? 'Unable to load summary.',
      });
    }
    this.loading.set(false);
  }
  // getSummary() {
  //   if (!this.form.valid) {
  //     this.notification.set({ type: 'error', message: 'Please select both dates.' });
  //     return;
  //   }

  //   const { startDate, endDate } = this.form.value as { startDate: string; endDate: string };
  //   this.loading.set(true);
  //   this.notification.set(null);

  //   this.testResultService
  //     .getSummary(startDate, endDate)
  //     .pipe(finalize(() => this.loading.set(false)))
  //     .subscribe({
  //       next: (data) => {
  //         this.summaryRows.set(data);
  //         if (!data.length) {
  //           this.notification.set({
  //             type: 'info',
  //             message: 'No results found for the selected date range.',
  //           });
  //         }
  //       },
  //       error: (err) => {
  //         this.notification.set({
  //           type: 'error',
  //           message: err?.message ?? 'Unable to load summary.',
  //         });
  //       },
  //     });
  // }

  downloadCSV() {
    if (this.form.valid) {
      const { startDate, endDate } = this.form.value as { startDate: string; endDate: string };
      this.testResultService.downloadCsv(startDate, endDate);
    }
  }
}
