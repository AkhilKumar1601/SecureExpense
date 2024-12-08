import express, { Request, Response } from "express";
import Expense from "../models/expense"; 
import User from "../models/user";
import verifyToken from "../middleware/authMiddleware";
import checkRole from "../middleware/roleMiddleware";

const router = express.Router();

// Add the verifyToken middleware to check if the user is authenticated
// Admins can view all expenses, regular users can only view their own expenses
router.get("/", verifyToken, checkRole("admin"), async (req: Request, res: Response) => {
  try {
    // Admins can view all expenses
    const expenses = await Expense.find({});
    res.status(200).json(expenses);
  } catch (e) {
    res.status(400).json({ message: "Error fetching expenses", e });
  }
});

// Route to get the current user's expenses (only accessible by the user or an admin)
router.get("/user", verifyToken, async (req: Request, res: Response) => {
  const userId = (req as any).user.id; // Get userId from the token

  try {
    // Fetch only the logged-in user's expenses
    const expenses = await Expense.find({ userId });
    res.status(200).json(expenses);
  } catch (e) {
    res.status(400).json({ message: "Error fetching expenses", e });
  }
});

// Route to manage users - only accessible by admin
router.get("/manage-users", verifyToken, checkRole("admin"), async (req: Request, res: Response) => {
  try {
    // Admins can view and manage users
    const users = await User.find({});
    res.status(200).json(users);
  } catch (e) {
    res.status(400).json({ message: "Error fetching users", e });
  }
});

// Add an expense
router.post('/add', async (req: Request, res: Response) => {
  const { userId, amount, category, note, date } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const totalExpenses = await Expense.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const newTotal = totalExpenses[0]?.total + amount;

    if (newTotal > user.budget) {
      res.status(400).json({
        message: "Budget exceeded",
        currentTotal: newTotal,
        budget: user.budget,
      });
      return;
    }

    // Create a new expense
    const expense = new Expense({
      userId,
      amount,
      category,
      note,
      date,
    });

    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (e) {
    res.status(400).json({ message: 'Error in adding expense', e });
  }
});

// Get expenses with filters and pagination (only the user’s own expenses or admin)
router.get('/', async (req: Request, res: Response) => {
  const { page = 1, limit = 10, category, startDate, endDate, userId } = req.query;

  try {
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const filter: any = { userId };

    // Add filters if provided in the query parameters
    if (category) {
      filter.category = category;
    }

    if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate as string), $lte: new Date(endDate as string) };
    }

    // Fetch expenses from the database with filters and pagination
    const expenses = await Expense.find(filter)
      .skip((parseInt(page as string) - 1) * parseInt(limit as string))
      .limit(parseInt(limit as string));

    const totalExpensesAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const isBudgetExceeded = totalExpensesAmount > user.budget;

    res.status(200).json({
      totalExpensesAmount,
      expenses,
      isBudgetExceeded,
      budget: user.budget,
    });
  } catch (e) {
    res.status(400).json({ message: "Error fetching expenses", e });
  }
});

// Update an expense
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { amount, category, note, date } = req.body;

  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      { amount, category, note, date },
      { new: true } // Return the updated document
    );

    if (!updatedExpense) {
      res.status(404).json({ message: 'Expense not found' });
      return;
    }

    res.status(200).json(updatedExpense);
  } catch (e) {
    res.status(400).json({ message: 'Error in updating the expense', e });
  }
});

// Delete an expense
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedExpense = await Expense.findByIdAndDelete(id);

    if (!deletedExpense) {
      res.status(404).json({ message: 'Expense not found' });
      return;
    }

    res.status(200).json({ message: 'Expense deleted successfully', deletedExpense });
  } catch (e) {
    res.status(400).json({ message: 'Error in deleting the expense', e });
  }
});

export default router;
