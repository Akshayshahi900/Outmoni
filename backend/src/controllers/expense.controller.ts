import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { json } from 'stream/consumers';

const prisma = new PrismaClient();

export const getExpenses = async (req: Request, res: Response) => {
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
    const { name, amount, category } = req.body;
    const userId = req.user?.id;

    const expense = await prisma.expense.create({
      data: {
        name,
        amount,
        category,
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
    //create a id for the deletion of the expenses
    const userId = req.user?.id; //from JWT/session middlewares
    if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" });
    const { id } = req.body; //expense id
    if (!id) return res.status(400).json({ error: "Expense ID is required" });

    // find Expense first
    const expense = await prisma.expense.findUnique({ where: { id } });
    if (!expense) return res.status(404).json({ error: "Expense not found" });

    //ensure the expense belongs to the current user

    if (expense.userId !== userId) {
      return res.status(403).json({ error: "Not allowed to delete this expense" });
    }
    await prisma.expense.delete({ where: { id } });
    res.json({ message: "Expense deleted successfully" });


  }
  catch (error) {
    next(error);

  }

}
function next(error: unknown) {
  throw new Error('Function not implemented.');
}

