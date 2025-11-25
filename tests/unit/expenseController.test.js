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

const { default: expenseController } = await import("../../src/controllers/expenseController.js");

const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("expenseController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getAllExpenses uses authenticated user id", async () => {
    const req = { user: { userId: "user123" } };
    const res = createMockRes();
    const expenses = [{ id: "exp1" }];
    mockExpenseRepo.getAllExpenses.mockResolvedValue(expenses);

    await expenseController.getAllExpenses(req, res, jest.fn());

    expect(mockExpenseRepo.getAllExpenses).toHaveBeenCalledWith("user123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expenses);
  });

  test("createExpense forwards payload to repository", async () => {
    const req = {
      user: { userId: "user123" },
      body: {
        title: "Lunch",
        subtitle: "Team",
        category: "Food",
        subcategory: "Dining",
        amount: 25,
        notes: "Project sync"
      }
    };
    const res = createMockRes();
    const newExpense = { id: "exp1" };
    mockExpenseRepo.createExpense.mockResolvedValue(newExpense);

    await expenseController.createExpense(req, res, jest.fn());

    expect(mockExpenseRepo.createExpense).toHaveBeenCalledWith(expect.objectContaining({
      user: "user123",
      title: "Lunch"
    }));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(newExpense);
  });
});

