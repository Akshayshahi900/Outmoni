import { Router } from 'express';
import { getExpenses, createExpense } from '../controllers/expense.controller';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.get('/', authMiddleware ,getExpenses);
router.post('/', createExpense);
// router.delete('/' , deleteExpenses);
export default router;
