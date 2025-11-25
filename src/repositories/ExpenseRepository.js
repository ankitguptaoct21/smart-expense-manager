import { Expense } from "../models/index.js";

const getAllExpenses = async () => {
    try {
        const expenses = await Expense
            .find()
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

export default { getAllExpenses, getExpense, createExpense };
