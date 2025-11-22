import { User } from "../models/index.js";

const createUser = async (user) => {
    try {
        const newUser =  await User.insertOne({
            name: user.name,
            email: user.email,
            password: user.password
        })

        return newUser.toJSON()
    } catch (error) {
        console.log(error)
    }
}

export default { createUser };
