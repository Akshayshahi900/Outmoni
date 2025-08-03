import { Router } from 'express';
import { getExpenses, createExpense } from '../controllers/expense.controller';

const router = Router();

router.get('/', getExpenses);
router.post('/', createExpense);

export default router;
