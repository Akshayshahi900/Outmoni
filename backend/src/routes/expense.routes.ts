import { Router } from 'express';
import { getExpenses, createExpense } from '../controllers/expense.controller';
import { verifyAuth } from '../middlewares/verifyAuth';

const router = Router();

router.get('/', verifyAuth, getExpenses);
router.post('/', verifyAuth, createExpense);
// router.delete('/', verifyAuth, deleteExpenses);
export default router;
