import { ExpenseRepo } from "../repositories/index.js";

const getAllExpenses = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const allExpenses = await ExpenseRepo.getAllExpenses(userId);

        res.status(200).json(allExpenses);
    } catch (error) {
        return next(error);
    }
}

const getExpense = async (req, res, next) => {
    try {
        const { expenseId } = req.params;
        const userId = req.user.userId;
        const expense = await ExpenseRepo.getExpense(expenseId, userId);

        res.status(200).json(expense);
    } catch (error) {
        return next(error);
    }
}

const createExpense = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const expense = {
            user: userId,
            title: req.body.title,
            subtitle: req.body.subtitle,
            category: req.body.category,
            subcategory: req.body.subcategory,
            amount: req.body.amount,
            notes: req.body.notes
        }
        const newExpense = await ExpenseRepo.createExpense(expense);

        res.status(201).json(newExpense);
    } catch (error) {
        return next(error);
    }
}

const updateExpense = async (req, res, next) => {
    try {
        const { expenseId } = req.params;
        const userId = req.user.userId;
        const expenseDetails = req.body;
        const updatedExpense = await ExpenseRepo.updateExpense(expenseId, expenseDetails, userId);

        res.status(200).json(updatedExpense);
    } catch (error) {
        return next(error);
    }
}

const deleteExpense = async (req, res, next) => {
    try {
        const { expenseId } = req.params;
        const userId = req.user.userId;
        await ExpenseRepo.deleteExpense(expenseId, userId);

        res.status(204).json({});
    } catch (error) {
        return next(error);
    }
}

export default { getAllExpenses, getExpense, createExpense, updateExpense, deleteExpense };
