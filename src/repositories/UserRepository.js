import { User } from "../models/index.js";

const createUser = async user => {
    try {
        const newUser =  await User.create({
            name: user.name,
            email: user.email,
            password: user.password
        });

        return newUser.toJSON();

    } catch (error) {
        throw error;
    }
}

const authenticateUser = async (email, password) => {
    try {
        const user = await User.findByEmailWithPassword(email);

        // If user does not exist
        if (!user) {
            throw new Error(`User with email ${email} doesn't exist.`)
        }

        // Verify password
        const isPasswordVerified = await user.comparePassword(password);

        // Failed login attempt
        if (!isPasswordVerified) {
            throw new Error(`Password for email ${email} is incorrect.`);
        }

        // Successful login attempt
        return user.toJSON();

    } catch (error) {
        throw error;
    }
}

const changePassword = async (email, oldPassword, newPassword) => {
    try {
        const user = await User.findByEmailWithPassword(email);
        
        if (!user) {
            throw new Error(`User with email ${email} doesn't exist.`);
        }

        // Verify old password
        const isPasswordVerified = await user.comparePassword(oldPassword);
        if (!isPasswordVerified) {
            throw new Error("Current password is incorrect.");
        }

        user.password = newPassword;
        await user.save();

        return user.toJSON();

    } catch (error) {
        throw error;
    }
}

export default { createUser, authenticateUser, changePassword };
