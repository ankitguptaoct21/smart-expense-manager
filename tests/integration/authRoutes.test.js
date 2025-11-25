import request from "supertest";
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

const { default: app } = await import("../../src/app.js");

describe("Auth routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("POST /api/auth/signup returns 201 for valid payload", async () => {
    const user = { id: "user1", role: "user" };
    mockUserRepo.createUser.mockResolvedValue(user);

    const response = await request(app)
      .post("/api/auth/signup")
      .send({ name: "Jane", email: "jane@example.com", password: "password123" });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ user, token: expect.any(String) });
    expect(mockUserRepo.createUser).toHaveBeenCalled();
  });

  test("POST /api/auth/signup validates input", async () => {
    const response = await request(app)
      .post("/api/auth/signup")
      .send({ name: "Jane", email: "invalid-email", password: "pass" });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("Validation error");
    expect(mockUserRepo.createUser).not.toHaveBeenCalled();
  });

  test("POST /api/auth/signin returns token", async () => {
    const user = { id: "user1", role: "user" };
    mockUserRepo.authenticateUser.mockResolvedValue(user);

    const response = await request(app)
      .post("/api/auth/signin")
      .send({ email: "jane@example.com", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ user, token: expect.any(String) });
    expect(mockUserRepo.authenticateUser).toHaveBeenCalledWith("jane@example.com", "password123");
  });
});

