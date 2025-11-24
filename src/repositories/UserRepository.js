import { User } from "../models/index.js";

const _findUserByEmail = async email => await User
        .findOne({ email })
        .select("+password")
        .exec();

const createUser = async user => {
    try {
        const newUser =  await User.create({
            name: user.name,
            email: user.email,
            password: user.password
        });

        return newUser.toJSON();

    } catch (error) {
        console.log(error);
    }
}

const authenticateUser = async (email, password) => {
    try {
        const user = await _findUserByEmail(email);

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
        console.log(error);
    }
}

const changePassword = async (email, newPassword) => {
    try {
        const user = await _findUserByEmail(email);
        
        if (!user) {
            throw new Error(`User with email ${email} doesn't exist.`);
        }

        user.password = newPassword;
        await user.save();

        return await _findUserByEmail(email).toJSON();

    } catch (error) {
        console.log(error);
    }
}

export default { createUser, authenticateUser, changePassword };
