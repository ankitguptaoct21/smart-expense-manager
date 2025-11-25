import { Router } from "express";

import { authController } from "../controllers/index.js";
import { validate, signupSchema, signinSchema, changePasswordSchema } from "../utils/index.js";

const authRoutes = () => {
    const authRoutes = Router();

    /**
     * @swagger
     * /api/auth/signup:
     *   post:
     *     summary: Register a new user
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/SignupRequest'
     *     responses:
     *       201:
     *         description: User successfully created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/AuthResponse'
     *       400:
     *         description: Validation error
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       409:
     *         description: Email already in use
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    authRoutes.post("/signup", validate(signupSchema), authController.signup);

    /**
     * @swagger
     * /api/auth/signin:
     *   post:
     *     summary: Sign in an existing user
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/SigninRequest'
     *     responses:
     *       200:
     *         description: Successfully authenticated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/AuthResponse'
     *       400:
     *         description: Validation error
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       401:
     *         description: Invalid credentials
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    authRoutes.post("/signin", validate(signinSchema), authController.signin);

    /**
     * @swagger
     * /api/auth/change-password:
     *   post:
     *     summary: Change user password
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ChangePasswordRequest'
     *     responses:
     *       200:
     *         description: Password successfully changed
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/AuthResponse'
     *       400:
     *         description: Validation error
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       401:
     *         description: Invalid old password
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    authRoutes.post("/change-password", validate(changePasswordSchema), authController.changePassword);
    // Add logout route here (client-side token removal)

    return authRoutes;
}

export default authRoutes;
