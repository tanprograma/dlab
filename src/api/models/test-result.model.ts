import mongoose from 'mongoose';

const testResultSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  test: { type: String, required: true },
  result: { type: String, enum: ['positive', 'negative'], required: true },
});

export const TestResult =
  mongoose.models['TestResult'] || mongoose.model('TestResult', testResultSchema);
