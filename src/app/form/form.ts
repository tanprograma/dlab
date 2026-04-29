import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { TestResultService } from '../services/test-result.service';

const TEST_OPTIONS = [
  'MRDT',
  'BLOOD SMEAR(BS)',
  'URINE ROUTINE',
  'URINALYSIS',
  'S.TYPHI AG & SERUM',
  'DENGUE',
  'HIV',
  'BLOOD GLUCOSE',
  'STOOL ROUTINE',
  'FBP/CBC',
  'H.PYLORI AG & SERUM',
  'LIVER PROFILE',
  'RENAL PROFILE',
  'ELECTROLYTES',
  'LIPID PROFILE',
  'AMYLASE',
  'DIRECT BILIRUBIN',
  'TOTAL BILIRUBIN',
  'ALBUMIN',
  'HAV',
  'HBV',
  'HCV',
  'PT(PROTHROMBIN TIME)',
  'LIPASE',
  'TROPONIN',
  'D-DIMER',
  'CRP',
  'HBA1C',
  'CK-MB',
  'FERRITIN',
  'URIC ACID',
  'TOTAL CHOLESTEROL',
  'SYPHILIS',
  'UPT',
].sort((a: string, b: string) => a.localeCompare(b));
type NotificationMessage = {
  type: 'success' | 'error' | 'info';
  message: string;
};
@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.scss',
})
export class FormComponent {
  private fb = inject(FormBuilder);
  private testResultService = inject(TestResultService);

  loading = signal(false);
  notification = signal<NotificationMessage | null>(null);
  displayedNotification = computed(() => this.notification());
  testOptions = signal(TEST_OPTIONS);

  form = this.fb.group({
    date: ['', Validators.required],
    test: ['', Validators.required],
    result: ['', Validators.required],
  });

  async onSubmit() {
    if (!this.form.valid) {
      this.notification.set({ type: 'error', message: 'Please complete all fields.' });
      return;
    }

    this.loading.set(true);
    this.notification.set(null);

    try {
      await this.testResultService.saveTestResult(this.form.value as any);
      this.notification.set({ type: 'success', message: 'Data saved successfully.' });
      this.form.patchValue({ test: '', result: '' });
    } catch (err) {
      this.notification.set({
        type: 'error',
        message: (err as Error)?.message ?? 'Unable to save data.',
      });
    } finally {
      this.loading.set(false);
    }
  }
}
