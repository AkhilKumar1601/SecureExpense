import express from 'express';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import expenseRoutes from './routes/expenseRoutes';

connectDB();

const app = express();
app.use(express.json());

app.use('/api/users',userRoutes)
app.use('/api/expenses',expenseRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'SecureExpense API is running' });
});


app.listen(5000, () => console.log(`Server running on port`));
