import { Router } from "express";

import { expenseController } from "../controllers/index.js";

const expenseRoutes = () => {
    const expenseRoutes = Router();

    expenseRoutes.get("/", expenseController.getAllExpenses);
    expenseRoutes.get("/:expenseId", expenseController.getExpense);
    expenseRoutes.post("/", expenseController.createExpense);
    expenseRoutes.put("/:expenseId", expenseController.updateExpense);

    return expenseRoutes;
}

export default expenseRoutes;
