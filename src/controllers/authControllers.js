import jwt from "jsonwebtoken";

import appConfig from "../config/index.js";
import { UserRepo } from "../repositories/index.js";

const _signToken = user => {
    const payload = {
        userId: String(user.id || user._id),
        role: user.role || "user"
    }

    const jwtSecret = appConfig.jwt.secret;
    const expiresIn = appConfig.jwt.expires_in;

    return jwt.sign(payload, jwtSecret, { expiresIn });
}

const signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, Email, and Password are required' });
        }

        // Create user (UserRepository will hash password in pre-save)
        const user = await UserRepo.createUser({ name, email, password });

        // Sign user token
        const token = _signToken(user);

        // Return token + sanitized user object (model's toJSON hides password)
        return res.status(201).json({ user, token });

    } catch (error) {
        // handle duplicate email (Mongo E11000)
        if (error && error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            return res.status(409).json({ error: 'Email already in use' });
        }
        // pass to centralized error handler
        return next(error);
    }
}

const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await UserRepo.authenticateUser(email, password);

        const token = _signToken(user);

        return res.status(200).json({ user, token });

    } catch (error) {
        return next(error);
    }
}

export default { signup, signin };
