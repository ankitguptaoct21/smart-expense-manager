import request from "supertest";
import jwt from "jsonwebtoken";
import { jest } from "@jest/globals";

const mockExpenseRepo = {
  getAllExpenses: jest.fn(),
  getExpense: jest.fn(),
  createExpense: jest.fn(),
  updateExpense: jest.fn(),
  deleteExpense: jest.fn()
};

jest.unstable_mockModule("../../src/repositories/index.js", () => ({
  ExpenseRepo: mockExpenseRepo,
  UserRepo: {}
}));

const { default: app } = await import("../../src/app.js");
const { default: appConfig } = await import("../../src/config/index.js");

const signToken = (payload = { userId: "user123", role: "user" }) =>
  jwt.sign(payload, appConfig.jwt.secret, { expiresIn: "1h" });

describe("Expense routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("requires authentication", async () => {
    const response = await request(app).get("/api/expenses");
    expect(response.status).toBe(401);
  });

  test("GET /api/expenses returns data for authenticated user", async () => {
    const expenses = [{ id: "exp1" }];
    mockExpenseRepo.getAllExpenses.mockResolvedValue(expenses);

    const response = await request(app)
      .get("/api/expenses")
      .set("Authorization", `Bearer ${signToken()}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expenses);
    expect(mockExpenseRepo.getAllExpenses).toHaveBeenCalledWith("user123");
  });

  test("POST /api/expenses validates payload", async () => {
    const response = await request(app)
      .post("/api/expenses")
      .set("Authorization", `Bearer ${signToken()}`)
      .send({ title: "Lunch" });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("Validation error");
    expect(mockExpenseRepo.createExpense).not.toHaveBeenCalled();
  });

  test("POST /api/expenses creates expense", async () => {
    const expense = { id: "exp1" };
    mockExpenseRepo.createExpense.mockResolvedValue(expense);

    const response = await request(app)
      .post("/api/expenses")
      .set("Authorization", `Bearer ${signToken()}`)
      .send({
        title: "Lunch",
        subtitle: "Team",
        category: "Food",
        subcategory: "Dining",
        amount: 20,
        notes: "Project sync"
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(expense);
    expect(mockExpenseRepo.createExpense).toHaveBeenCalled();
  });
});

