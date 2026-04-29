import mongoose from 'mongoose';
import express from 'express';
import { TestResult } from './models/test-result.model';

// Connect to MongoDB
const mongoURI = process.env['MONGODB_URI'] || 'mongodb://localhost:27017/dlab';
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => console.error('MongoDB connection error:', err));

export function setupApiRoutes(app: express.Application) {
  // Middleware
  app.use(express.json());

  app.post('/api/test-results', async (req, res) => {
    try {
      const { date, test, result } = req.body;
      const newResult = new TestResult({ date: new Date(date), test, result });
      await newResult.save();
      res.status(201).json({ message: 'Saved' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/test-results/summary', async (req, res) => {
    const { startDate, endDate } = req.query as { startDate: string; endDate: string };
    const start = new Date(startDate);
    const end = new Date(endDate);
    const results = await TestResult.find({ date: { $gte: start, $lte: end } });
    const summaryMap: { [key: string]: { positive: number; negative: number } } = {};

    results.forEach((r) => {
      if (!summaryMap[r.test]) summaryMap[r.test] = { positive: 0, negative: 0 };
      summaryMap[r.test][r.result as 'positive' | 'negative']++;
    });

    const summary = Object.entries(summaryMap).map(([test, counts]) => {
      const total = counts.positive + counts.negative;
      const positivePercent = total ? ((counts.positive / total) * 100).toFixed(2) : '0.00';
      const negativePercent = total ? ((counts.negative / total) * 100).toFixed(2) : '0.00';
      const totalPercent = '100.00';

      return {
        test,
        positive: counts.positive,
        negative: counts.negative,
        total,
        positivePercent,
        negativePercent,
        totalPercent,
      };
    });

    res.json(summary);
  });

  app.get('/api/test-results/csv', async (req, res) => {
    const { startDate, endDate } = req.query as { startDate: string; endDate: string };
    const start = new Date(startDate);
    const end = new Date(endDate);
    const results = await TestResult.find({ date: { $gte: start, $lte: end } });
    const csv = results
      .map((r) => `${r.date.toISOString().split('T')[0]},${r.test},${r.result}`)
      .join('\n');
    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename="test-results.csv"');
    res.send('date,test,result\n' + csv);
  });
}
