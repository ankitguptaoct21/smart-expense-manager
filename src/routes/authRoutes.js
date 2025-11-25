import { Router } from "express";

import { authController } from "../controllers/index.js";
import { validate, signupSchema, signinSchema, changePasswordSchema } from "../utils/index.js";

const authRoutes = () => {
    const authRoutes = Router();

    authRoutes.post("/signup", validate(signupSchema), authController.signup);
    authRoutes.post("/signin", validate(signinSchema), authController.signin);
    authRoutes.post("/change-password", validate(changePasswordSchema), authController.changePassword);
    // Add logout route here (client-side token removal)

    return authRoutes;
}

export default authRoutes;
