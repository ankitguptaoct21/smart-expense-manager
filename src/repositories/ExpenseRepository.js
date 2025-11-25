import { Expense } from "../models/index.js";

const getAllExpenses = async () => {
    try {
        const expenses = await Expense
            .find({ deletedAt: null })
            .sort({ date: -1 });

        return expenses;

    } catch (error) {
        throw new Error(error);
    }
}

const getExpense = async expenseId => {
    try {
        const expense = await Expense
            .findById(expenseId);

        return expense.toJSON();

    } catch (error) {
        throw new Error(error);
    }
}

const createExpense = async expense => {
    try {
        const newExpense = await Expense
            .create(expense);

        return newExpense.toJSON();

    } catch (error) {
        throw new Error(error);
    }
}

const updateExpense = async (expenseId, expenseDetails) => {
    try {
        const expenseToUpdate = await Expense
            .findById(expenseId)

        if (!expenseToUpdate) {
            throw new Error("Expense not found.");
        }

        const allowedFields = ["title", "subtitle", "amount", "category", "subcategory", "date", "notes"];
        for (const key of allowedFields) {
            if (expenseDetails[key] !== undefined) {
                expenseToUpdate[key] = expenseDetails[key];
            }
        }

        if (expenseToUpdate.amount <= 0) {
            throw new Error("Amount must be greater than 0.")
        }

        await expenseToUpdate.save();

        return expenseToUpdate.toJSON();
    } catch (error) {
        throw new Error(error);
    } 
}

const deleteExpense = async expenseId => {
    try {
        const expense = await Expense
            .findById(expenseId);

        if (!expense) {
            throw new Error("Expense doesn't exist.");
        }

        await expense.softDelete();
    } catch (error) {
        throw new Error(error);
    }
}

export default { getAllExpenses, getExpense, createExpense, updateExpense, deleteExpense };
