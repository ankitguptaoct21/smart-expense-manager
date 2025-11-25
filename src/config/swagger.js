import swaggerJsdoc from "swagger-jsdoc";
import appConfig from "./index.js";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Smart Expense Manager API",
            version: "1.0.0",
            description: "An API for managing expenses smartly and much more.",
            contact: {
                name: "Ankit Gupta",
            },
        },
        servers: [
            {
                url: `http://localhost:${appConfig.port}`,
                description: "Development server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Enter JWT token obtained from /api/auth/signin or /api/auth/signup",
                },
            },
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            description: "User ID",
                        },
                        name: {
                            type: "string",
                            description: "User's full name",
                        },
                        email: {
                            type: "string",
                            format: "email",
                            description: "User's email address",
                        },
                        role: {
                            type: "string",
                            enum: ["user", "admin"],
                            description: "User role",
                        },
                        isVerified: {
                            type: "boolean",
                            description: "Whether the user is verified",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },
                Expense: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            description: "Expense ID",
                        },
                        user: {
                            type: "string",
                            description: "User ID who owns this expense",
                        },
                        title: {
                            type: "string",
                            description: "Expense title",
                        },
                        subtitle: {
                            type: "string",
                            description: "Expense subtitle",
                        },
                        category: {
                            type: "string",
                            description: "Expense category",
                        },
                        subcategory: {
                            type: "string",
                            description: "Expense subcategory",
                        },
                        amount: {
                            type: "number",
                            minimum: 0.01,
                            description: "Expense amount",
                        },
                        date: {
                            type: "string",
                            format: "date-time",
                            description: "Expense date",
                        },
                        notes: {
                            type: "string",
                            description: "Additional notes",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },
                Error: {
                    type: "object",
                    properties: {
                        error: {
                            type: "string",
                            description: "Error message",
                        },
                    },
                },
                SignupRequest: {
                    type: "object",
                    required: ["name", "email", "password"],
                    properties: {
                        name: {
                            type: "string",
                            minLength: 2,
                            maxLength: 50,
                            description: "User's full name",
                        },
                        email: {
                            type: "string",
                            format: "email",
                            description: "User's email address",
                        },
                        password: {
                            type: "string",
                            minLength: 8,
                            format: "password",
                            description: "User's password (minimum 8 characters)",
                        },
                    },
                },
                SigninRequest: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: {
                            type: "string",
                            format: "email",
                            description: "User's email address",
                        },
                        password: {
                            type: "string",
                            format: "password",
                            description: "User's password",
                        },
                    },
                },
                ChangePasswordRequest: {
                    type: "object",
                    required: ["email", "oldPassword", "newPassword"],
                    properties: {
                        email: {
                            type: "string",
                            format: "email",
                            description: "User's email address",
                        },
                        oldPassword: {
                            type: "string",
                            format: "password",
                            description: "Current password",
                        },
                        newPassword: {
                            type: "string",
                            minLength: 8,
                            format: "password",
                            description: "New password (minimum 8 characters)",
                        },
                    },
                },
                CreateExpenseRequest: {
                    type: "object",
                    required: ["title", "subtitle", "category", "subcategory", "amount", "notes"],
                    properties: {
                        title: {
                            type: "string",
                            description: "Expense title",
                        },
                        subtitle: {
                            type: "string",
                            description: "Expense subtitle",
                        },
                        category: {
                            type: "string",
                            description: "Expense category",
                        },
                        subcategory: {
                            type: "string",
                            description: "Expense subcategory",
                        },
                        amount: {
                            type: "number",
                            minimum: 0.01,
                            description: "Expense amount (must be greater than 0)",
                        },
                        date: {
                            type: "string",
                            format: "date-time",
                            description: "Expense date (optional, defaults to current date)",
                        },
                        notes: {
                            type: "string",
                            description: "Additional notes",
                        },
                    },
                },
                UpdateExpenseRequest: {
                    type: "object",
                    properties: {
                        title: {
                            type: "string",
                            description: "Expense title",
                        },
                        subtitle: {
                            type: "string",
                            description: "Expense subtitle",
                        },
                        category: {
                            type: "string",
                            description: "Expense category",
                        },
                        subcategory: {
                            type: "string",
                            description: "Expense subcategory",
                        },
                        amount: {
                            type: "number",
                            minimum: 0.01,
                            description: "Expense amount (must be greater than 0)",
                        },
                        date: {
                            type: "string",
                            format: "date-time",
                            description: "Expense date",
                        },
                        notes: {
                            type: "string",
                            description: "Additional notes",
                        },
                    },
                },
                AuthResponse: {
                    type: "object",
                    properties: {
                        user: {
                            $ref: "#/components/schemas/User",
                        },
                        token: {
                            type: "string",
                            description: "JWT authentication token",
                        },
                    },
                },
            },
        },
        tags: [
            {
                name: "Authentication",
                description: "User authentication endpoints",
            },
            {
                name: "Expenses",
                description: "Expense management endpoints",
            },
            {
                name: "Health",
                description: "Health check endpoints",
            },
        ],
    },
    apis: ["./src/routes/*.js"], // Path to the API files
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;

