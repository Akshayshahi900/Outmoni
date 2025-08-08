import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getExpenses = async (req: Request, res: Response, next: NextFunction) => {
  const name = req.body;
  const userId = req.body.userId;
  // try {
  //   const expenses = await prisma.expense.findMany({ where: { userId } });
  //   res.json(expenses);
  // } catch (error) {
  //   next(error);
  // }
  try {
    const expenses = await prisma.expense.findMany({ where: { name } });
    res.json(expenses);
  } catch (error) {
    console.log("Cannot send the response on the client");
  }
};

// export const createExpense = async (req: Request, res: Response, next: NextFunction) => {
//   const { title, amount, category, userId } = req.body;
//   try {
//     const expense = await prisma.expense.create({
//       data: { title, amount, category, userId },
//     });
//     res.json(expense);
//   } catch (error) {
//     next(error);
//   }
// };

export const createExpense = async (req: Request, res: Response, next: NextFunction) => {
  const { name, category, amount, date } = req.body;
  try {
    const expense = await prisma.expense.create({
      data: { name, category, amount, date },
    });
    res.json(expense);
  }
  catch (error) {
    console.log("Cannot create the expense");
  }
}

export const deleteExpense = async (req: Request, res: Response, next: NextFunction) => {
  //create a id for the deletion of the expenses
  const id  = req.body;
  try {
    const expense = await prisma.expense.delete({
      where: { id },
    });
    res.json(expense);
  }
  catch (error) {
    console.log("Cannot delete the expense");
    res.json({
      message: "Cannot delete the expense"
    }
    );

  }

}
