import Joi from "joi";

// Validation middleware factory
export const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map(detail => detail.message).join(", ");
            return res.status(400).json({ error: `Validation error: ${errors}` });
        }

        req.body = value; // Use validated and sanitized values
        next();
    };
};

// Validation middleware for params
export const validateParams = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.params, { abortEarly: false });

        if (error) {
            const errors = error.details.map(detail => detail.message).join(", ");
            return res.status(400).json({ error: `Validation error: ${errors}` });
        }

        req.params = value;
        next();
    };
};

// Auth validation schemas
export const signupSchema = Joi.object({
    name: Joi.string().trim().min(2).max(50).required()
        .messages({
            "string.min": "Name must be at least 2 characters",
            "string.max": "Name must be at most 50 characters",
            "any.required": "Name is required"
        }),
    email: Joi.string().email().trim().lowercase().required()
        .messages({
            "string.email": "Please provide a valid email address",
            "any.required": "Email is required"
        }),
    password: Joi.string().min(8).required()
        .messages({
            "string.min": "Password must be at least 8 characters",
            "any.required": "Password is required"
        })
});

export const signinSchema = Joi.object({
    email: Joi.string().email().trim().lowercase().required()
        .messages({
            "string.email": "Please provide a valid email address",
            "any.required": "Email is required"
        }),
    password: Joi.string().required()
        .messages({
            "any.required": "Password is required"
        })
});

export const changePasswordSchema = Joi.object({
    email: Joi.string().email().trim().lowercase().required()
        .messages({
            "string.email": "Please provide a valid email address",
            "any.required": "Email is required"
        }),
    oldPassword: Joi.string().required()
        .messages({
            "any.required": "Old password is required"
        }),
    newPassword: Joi.string().min(8).required()
        .messages({
            "string.min": "New password must be at least 8 characters",
            "any.required": "New password is required"
        })
});

// Expense validation schemas
export const createExpenseSchema = Joi.object({
    title: Joi.string().trim().required()
        .messages({
            "any.required": "Title is required"
        }),
    subtitle: Joi.string().trim().required()
        .messages({
            "any.required": "Subtitle is required"
        }),
    category: Joi.string().trim().required()
        .messages({
            "any.required": "Category is required"
        }),
    subcategory: Joi.string().trim().required()
        .messages({
            "any.required": "Subcategory is required"
        }),
    amount: Joi.number().positive().greater(0).required()
        .messages({
            "number.positive": "Amount must be greater than 0",
            "any.required": "Amount is required"
        }),
    date: Joi.date().optional(),
    notes: Joi.string().trim().required()
        .messages({
            "any.required": "Notes are required"
        })
});

export const updateExpenseSchema = Joi.object({
    title: Joi.string().trim().optional(),
    subtitle: Joi.string().trim().optional(),
    category: Joi.string().trim().optional(),
    subcategory: Joi.string().trim().optional(),
    amount: Joi.number().positive().greater(0).optional()
        .messages({
            "number.positive": "Amount must be greater than 0"
        }),
    date: Joi.date().optional(),
    notes: Joi.string().trim().optional()
}).min(1).messages({
    "object.min": "At least one field must be provided for update"
});

export const expenseIdSchema = Joi.object({
    expenseId: Joi.string().hex().length(24).required()
        .messages({
            "string.hex": "Expense ID must be a valid MongoDB ObjectId",
            "string.length": "Expense ID must be 24 characters",
            "any.required": "Expense ID is required"
        })
});
