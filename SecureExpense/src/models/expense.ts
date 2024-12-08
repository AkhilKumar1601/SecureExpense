import mongoose, { Schema, Document } from "mongoose";

export interface IExpense extends Document {
  userId: mongoose.Types.ObjectId; 
  amount: number; 
  category: string; 
  note?: string; 
  date: Date; 
}

const expenseSchema = new Schema<IExpense>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    note: { type: String },
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  }
);

const Expense = mongoose.model<IExpense>("Expense", expenseSchema);
export default Expense;
