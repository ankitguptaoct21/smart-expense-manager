import { jest } from "@jest/globals";

const mockUserRepo = {
  createUser: jest.fn(),
  authenticateUser: jest.fn(),
  changePassword: jest.fn()
};

jest.unstable_mockModule("../../src/repositories/index.js", () => ({
  UserRepo: mockUserRepo,
  ExpenseRepo: {}
}));

const { default: authController } = await import("../../src/controllers/authController.js");

const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("authController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("signup returns token and user on success", async () => {
    const req = { body: { name: "Jane", email: "jane@example.com", password: "password123" } };
    const res = createMockRes();
    const next = jest.fn();
    const user = { id: "user1", role: "user" };
    mockUserRepo.createUser.mockResolvedValue(user);

    await authController.signup(req, res, next);

    expect(mockUserRepo.createUser).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ user, token: expect.any(String) }));
    expect(next).not.toHaveBeenCalled();
  });

  test("signup responds 409 on duplicate email", async () => {
    const req = { body: { name: "Jane", email: "jane@example.com", password: "password123" } };
    const res = createMockRes();
    const next = jest.fn();
    const error = { code: 11000, keyPattern: { email: 1 } };
    mockUserRepo.createUser.mockRejectedValue(error);

    await authController.signup(req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ error: "Email already in use" });
    expect(next).not.toHaveBeenCalled();
  });

  test("signin returns token", async () => {
    const req = { body: { email: "jane@example.com", password: "password123" } };
    const res = createMockRes();
    const user = { id: "user1", role: "user" };
    mockUserRepo.authenticateUser.mockResolvedValue(user);

    await authController.signin(req, res, jest.fn());

    expect(mockUserRepo.authenticateUser).toHaveBeenCalledWith("jane@example.com", "password123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ user, token: expect.any(String) }));
  });

  test("changePassword returns token after success", async () => {
    const req = { body: { email: "jane@example.com", oldPassword: "old", newPassword: "new" } };
    const res = createMockRes();
    const user = { id: "user1", role: "user" };
    mockUserRepo.changePassword.mockResolvedValue(user);

    await authController.changePassword(req, res, jest.fn());

    expect(mockUserRepo.changePassword).toHaveBeenCalledWith("jane@example.com", "old", "new");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ user, token: expect.any(String) }));
  });
});

