import { Router } from "express";

import { expenseController } from "../controllers/index.js";
import { authenticate } from "../middlewares/index.js";
import { validate, validateParams, createExpenseSchema, updateExpenseSchema, expenseIdSchema } from "../utils/index.js";

const expenseRoutes = () => {
    const expenseRoutes = Router();

    // All expense routes require authentication
    expenseRoutes.use(authenticate);

    expenseRoutes.get("/", expenseController.getAllExpenses);
    expenseRoutes.get("/:expenseId", validateParams(expenseIdSchema), expenseController.getExpense);
    expenseRoutes.post("/", validate(createExpenseSchema), expenseController.createExpense);
    expenseRoutes.put("/:expenseId", validateParams(expenseIdSchema), validate(updateExpenseSchema), expenseController.updateExpense);
    expenseRoutes.delete("/:expenseId", validateParams(expenseIdSchema), expenseController.deleteExpense);

    return expenseRoutes;
}

export default expenseRoutes;
