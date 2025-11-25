import { jest } from "@jest/globals";

const mockExpenseDoc = () => ({
  toJSON: jest.fn().mockReturnValue({ id: "exp1", title: "Coffee" }),
  save: jest.fn().mockResolvedValue(true),
  softDelete: jest.fn().mockResolvedValue(true)
});

const mockExpenseModel = {
  find: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  create: jest.fn()
};

jest.unstable_mockModule("../../src/models/index.js", () => ({
  Expense: mockExpenseModel,
  User: {}
}));

const { default: ExpenseRepo } = await import("../../src/repositories/ExpenseRepository.js");

describe("ExpenseRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getAllExpenses filters by user and excludes deleted records", async () => {
    const sortedResult = [{ id: "exp1" }];
    const sortMock = jest.fn().mockResolvedValue(sortedResult);
    mockExpenseModel.find.mockReturnValue({ sort: sortMock });

    const result = await ExpenseRepo.getAllExpenses("user123");

    expect(mockExpenseModel.find).toHaveBeenCalledWith({ user: "user123", deletedAt: null });
    expect(sortMock).toHaveBeenCalledWith({ date: -1 });
    expect(result).toEqual(sortedResult);
  });

  test("getExpense throws when not found", async () => {
    mockExpenseModel.findOne.mockResolvedValue(null);

    await expect(ExpenseRepo.getExpense("exp1", "user123")).rejects.toThrow("Expense not found.");
  });

  test("updateExpense saves allowed fields", async () => {
    const doc = mockExpenseDoc();
    doc.amount = 20;
    mockExpenseModel.findOne.mockResolvedValue(doc);

    const updates = { title: "Tea", amount: 15 };
    const updated = await ExpenseRepo.updateExpense("exp1", updates, "user123");

    expect(mockExpenseModel.findOne).toHaveBeenCalledWith({ _id: "exp1", user: "user123", deletedAt: null });
    expect(doc.title).toBe("Tea");
    expect(doc.amount).toBe(15);
    expect(doc.save).toHaveBeenCalled();
    expect(updated).toEqual({ id: "exp1", title: "Coffee" });
  });

  test("deleteExpense throws when expense missing", async () => {
    mockExpenseModel.findOne.mockResolvedValue(null);

    await expect(ExpenseRepo.deleteExpense("exp1", "user123")).rejects.toThrow("Expense not found.");
  });
});

