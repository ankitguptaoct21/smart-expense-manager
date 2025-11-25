import { ExpenseRepo } from "../repositories/index.js";

const getAllExpenses = async (req, res, next) => {
    try {
        const allExpenses = await ExpenseRepo.getAllExpenses();

        res.status(200).json(allExpenses);
    } catch (error) {
        return next(error);
    }
}

const getExpense = async (req, res, next) => {
    try {
        const { expenseId } = req.params;
        const expense = await ExpenseRepo.getExpense(expenseId);

        res.status(200).json(expense);
    } catch (error) {
        return next (error);
    }
}

const createExpense = async (req, res, next) => {
    try {
        let userId = "6924699f0a5663bbda30c4b5";
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
        const expenseDetails = req.body;
        const updatedExpense = await ExpenseRepo.updateExpense(expenseId, expenseDetails);

        res.status(200).json(updatedExpense);
    } catch (error) {
        return next(error);
    }
}

const deleteExpense = async (req, res, next) => {
    try {
        const { expenseId } = req.params;
        await ExpenseRepo.deleteExpense(expenseId);

        res.status(204).json({});
    } catch (error) {
        return next(error);
    }
}

export default { getAllExpenses, getExpense, createExpense, updateExpense, deleteExpense };
