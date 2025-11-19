import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { json } from 'stream/consumers';

const prisma = new PrismaClient();

export const getExpenses = async (req: Request, res: Response ,  next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" });

    const expenses = await prisma.expense.findMany({
      where: { userId },
    });

    res.json(expenses);
  } catch (error) {
    next(error);
  }

};

export const createExpense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, amount, category, date } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" });

    const expense = await prisma.expense.create({
      data: {
        title:String(title),
        amount:Number(req.body.amount),
        category:String(category),
        date:new Date(date),
        userId, // store the userId from header
      },
    });

    res.status(201).json(expense);
  } catch (error) {
    next(error);
  }
};


export const deleteExpense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" });

    const { id } = req.params; // ✅ get id from URL param
    if (!id) return res.status(400).json({ error: "Expense ID is required" });

    const expense = await prisma.expense.findUnique({ where: { id } });
    if (!expense) return res.status(404).json({ error: "Expense not found" });

    if (expense.userId !== userId) {
      return res.status(403).json({ error: "Not allowed to delete this expense" });
    }

    await prisma.expense.delete({ where: { id } });
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    next(error);
  }
};


