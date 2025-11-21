import dotenv from "dotenv";
import Joi from "joi";

// Loading .env
dotenv.config();

// Preparing JOI schema
const joiEnvSchema = Joi.object({
    PORT: Joi.number().integer().min(1).max(9999).required(),
    NODE_ENV: Joi.string().valid("development", "production", "test", "staging").required(),
    MONGO_URI: Joi.string().uri().required(),
    JWT_SECRET: Joi.string().min(10).required(),
    JWT_EXPIRES_IN: Joi.string().required(),
    BCRYPT_SALT_ROUNDS: Joi.number().integer().min(1).max(20).required()
}).unknown(true);

// Validating environment variables
const { error, value: validatedEnv } = joiEnvSchema.validate(process.env, { abortEarly: false });

if (error) {
    const messages = error.details.map(d => `${d.path.join('.')}: ${d.message}`).join('\n  ');
    throw new Error(`Config validation error:\n  ${messages}`);
}

const appConfig = {
    port: validatedEnv.PORT,
    node_env: validatedEnv.NODE_ENV,
    db: {
        url: validatedEnv.MONGO_URI
    },
    jwt: {
        secret: validatedEnv.JWT_SECRET,
        expires_in: validatedEnv.JWT_EXPIRES_IN
    },
    bcrypt_salt_round: validatedEnv.BCRYPT_SALT_ROUNDS,
    // _raw: validatedEnv // Default environment variables
}

export default Object.freeze(appConfig);
