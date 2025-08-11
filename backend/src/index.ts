import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.routes';
import expenseRoutes from './routes/expense.routes';
import { errorHandler } from './middlewares/error.middleware';
import { verifyAuth } from './middlewares/verifyAuth';

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/api', verifyAuth); // ALl '/api' routes  are protected 
app.use('/api/auth', authRoutes); // used for user registration and login

app.get('/', (req, res) => {
  res.send('Finance Tracker Backend is Live 🚀');
});

app.use('/api/expenses', expenseRoutes);


app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
