import { jest } from "@jest/globals";

const mockUserDoc = overrides => ({
  toJSON: jest.fn().mockReturnValue({ id: "user1", email: "jane@example.com" }),
  comparePassword: jest.fn().mockResolvedValue(true),
  save: jest.fn().mockResolvedValue(true),
  ...overrides
});

const mockUserModel = {
  create: jest.fn(),
  findByEmailWithPassword: jest.fn()
};

jest.unstable_mockModule("../../src/models/index.js", () => ({
  User: mockUserModel,
  Expense: {}
}));

const { default: UserRepo } = await import("../../src/repositories/UserRepository.js");

describe("UserRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("createUser persists name, email, password", async () => {
    const doc = mockUserDoc();
    mockUserModel.create.mockResolvedValue(doc);

    const result = await UserRepo.createUser({ name: "Jane", email: "jane@example.com", password: "secret123" });

    expect(mockUserModel.create).toHaveBeenCalledWith({
      name: "Jane",
      email: "jane@example.com",
      password: "secret123"
    });
    expect(result).toEqual({ id: "user1", email: "jane@example.com" });
  });

  test("authenticateUser throws when user missing", async () => {
    mockUserModel.findByEmailWithPassword.mockResolvedValue(null);

    await expect(UserRepo.authenticateUser("missing@example.com", "pass")).rejects.toThrow(
      "User with email missing@example.com doesn't exist."
    );
  });

  test("authenticateUser throws on invalid password", async () => {
    const doc = mockUserDoc({ comparePassword: jest.fn().mockResolvedValue(false) });
    mockUserModel.findByEmailWithPassword.mockResolvedValue(doc);

    await expect(UserRepo.authenticateUser("jane@example.com", "bad-pass")).rejects.toThrow(
      "Password for email jane@example.com is incorrect."
    );
  });

  test("changePassword validates current password", async () => {
    const doc = mockUserDoc();
    mockUserModel.findByEmailWithPassword.mockResolvedValue(doc);

    await UserRepo.changePassword("jane@example.com", "old-pass", "new-pass");

    expect(doc.comparePassword).toHaveBeenCalledWith("old-pass");
    expect(doc.password).toBe("new-pass");
    expect(doc.save).toHaveBeenCalled();
  });
});

