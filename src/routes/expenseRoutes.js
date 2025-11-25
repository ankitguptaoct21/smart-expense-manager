import { Router } from "express";

import { expenseController } from "../controllers/index.js";
import { authenticate } from "../middlewares/index.js";
import { validate, validateParams, createExpenseSchema, updateExpenseSchema, expenseIdSchema } from "../utils/index.js";

const expenseRoutes = () => {
    const expenseRoutes = Router();

    // All expense routes require authentication
    expenseRoutes.use(authenticate);

    /**
     * @swagger
     * /api/expenses:
     *   get:
     *     summary: Get all expenses for the authenticated user
     *     tags: [Expenses]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of expenses
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Expense'
     *       401:
     *         description: Unauthorized - Invalid or missing token
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    expenseRoutes.get("/", expenseController.getAllExpenses);

    /**
     * @swagger
     * /api/expenses/{expenseId}:
     *   get:
     *     summary: Get a specific expense by ID
     *     tags: [Expenses]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: expenseId
     *         required: true
     *         schema:
     *           type: string
     *         description: The expense ID
     *     responses:
     *       200:
     *         description: Expense details
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Expense'
     *       400:
     *         description: Invalid expense ID format
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       401:
     *         description: Unauthorized - Invalid or missing token
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       404:
     *         description: Expense not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    expenseRoutes.get("/:expenseId", validateParams(expenseIdSchema), expenseController.getExpense);

    /**
     * @swagger
     * /api/expenses:
     *   post:
     *     summary: Create a new expense
     *     tags: [Expenses]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateExpenseRequest'
     *     responses:
     *       201:
     *         description: Expense successfully created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Expense'
     *       400:
     *         description: Validation error
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       401:
     *         description: Unauthorized - Invalid or missing token
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    expenseRoutes.post("/", validate(createExpenseSchema), expenseController.createExpense);

    /**
     * @swagger
     * /api/expenses/{expenseId}:
     *   put:
     *     summary: Update an existing expense
     *     tags: [Expenses]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: expenseId
     *         required: true
     *         schema:
     *           type: string
     *         description: The expense ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateExpenseRequest'
     *     responses:
     *       200:
     *         description: Expense successfully updated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Expense'
     *       400:
     *         description: Validation error
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       401:
     *         description: Unauthorized - Invalid or missing token
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       404:
     *         description: Expense not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    expenseRoutes.put("/:expenseId", validateParams(expenseIdSchema), validate(updateExpenseSchema), expenseController.updateExpense);

    /**
     * @swagger
     * /api/expenses/{expenseId}:
     *   delete:
     *     summary: Delete (soft delete) an expense
     *     tags: [Expenses]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: expenseId
     *         required: true
     *         schema:
     *           type: string
     *         description: The expense ID
     *     responses:
     *       204:
     *         description: Expense successfully deleted
     *       400:
     *         description: Invalid expense ID format
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       401:
     *         description: Unauthorized - Invalid or missing token
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       404:
     *         description: Expense not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    expenseRoutes.delete("/:expenseId", validateParams(expenseIdSchema), expenseController.deleteExpense);

    return expenseRoutes;
}

export default expenseRoutes;
