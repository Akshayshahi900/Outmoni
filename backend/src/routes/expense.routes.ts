import { Router } from 'express';
import { getExpenses, createExpense, deleteExpense } from '../controllers/expense.controller';
import { verifyAuth } from '../middlewares/verifyAuth';

const router = Router();

router.get('/', getExpenses);
router.post('/',  createExpense);
router.delete('/:id' , deleteExpense);
// router.delete('/', verifyAuth, deleteExpenses);
export default router;
