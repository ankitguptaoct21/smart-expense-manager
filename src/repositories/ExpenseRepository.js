import { Expense } from "../models/index.js";

const getAllExpenses = async (userId) => {
    try {
        const expenses = await Expense
            .find({ user: userId, deletedAt: null })
            .sort({ date: -1 });

        return expenses;

    } catch (error) {
        throw error;
    }
}

const getExpense = async (expenseId, userId) => {
    try {
        const expense = await Expense
            .findOne({ _id: expenseId, user: userId, deletedAt: null });

        if (!expense) {
            throw new Error("Expense not found.");
        }

        return expense.toJSON();

    } catch (error) {
        throw error;
    }
}

const createExpense = async expense => {
    try {
        const newExpense = await Expense
            .create(expense);

        return newExpense.toJSON();

    } catch (error) {
        throw error;
    }
}

const updateExpense = async (expenseId, expenseDetails, userId) => {
    try {
        const expenseToUpdate = await Expense
            .findOne({ _id: expenseId, user: userId, deletedAt: null });

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
        throw error;
    } 
}

const deleteExpense = async (expenseId, userId) => {
    try {
        const expense = await Expense
            .findOne({ _id: expenseId, user: userId, deletedAt: null });

        if (!expense) {
            throw new Error("Expense not found.");
        }

        await expense.softDelete();
    } catch (error) {
        throw error;
    }
}

export default { getAllExpenses, getExpense, createExpense, updateExpense, deleteExpense };
