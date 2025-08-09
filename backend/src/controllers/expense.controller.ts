import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export const getExpenses = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; //from JWT/session middlewares
    if (!userId) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }
      const expenses = await prisma.expense.findMany({ where: { userId } });
    res.json(expenses);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });

  }

};

export const createExpense = async (req: Request, res: Response, next: NextFunction) => {

//   const { name, amount, category, userId } = req.body;
//   if(!userId){
//     return res.status(401).json({error:"UNAUTHORIZED"});
//   }
//   try {
//     const expense = await prisma.expense.create({
//       data: { name, amount, category, userId },
//     });
//     res.json(expense);
//   } catch (error) {
//   console.error("Error creating expense:", error);
//   return res.status(500).json({ error: "Failed to create expense" });
// }

try{
  const userId = req.user?.id; //Extracting from the jwt session 
  if(!userId){
    return res.status(401).json({error:"UNAUTHORIZED"});
    
  }
  const {name, amount, category} = req.body;
  if(!name|| !amount || !category){
    return res.status(400).json({error:"Missing required fields"});
  }
  const expense   = await prisma.expense.create({
    data:{name , amount :Number(amount) , category , userId},
  });
res.json(expense);

}
catch(error){
  next(error);
}
};


export const deleteExpense = async (req: Request, res: Response, next: NextFunction) => {
  //create a id for the deletion of the expenses
  const userId = req.user?.id; //from JWT/session middlewares
  if(!userId) return res.status(401).json({error:"UNAUTHORIZED"});
  const {id} = req.body; //expense id
  if(!id) return res.status(400).json({error:"Expense ID is required"});

  //ensure the expense belongs to the current user

  try {
    const expense = await prisma.expense.delete({
      where: {id },
    });
    if(!expense || expense.userId !== userId){
      return res.status(403).json({error:"Not allowed to delete this expense"});
    }
    await prisma.expense.delete({where:{id}});
    res.json({message:"Expense deleted successfully"});
    
  }
  catch (error) {
   next(error);

  }

}
