import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getExpenses = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.body.userId;
  try {
    const expenses = await prisma.expense.findMany({ where: { userId } });
    res.json(expenses);
  } catch (error) {
    next(error);
  }
};

export const createExpense = async (req: Request, res: Response, next: NextFunction) => {
  const { title, amount, category, userId } = req.body;
  try {
    const expense = await prisma.expense.create({
      data: { title, amount, category, userId },
    });
    res.json(expense);
  } catch (error) {
    next(error);
  }
};
