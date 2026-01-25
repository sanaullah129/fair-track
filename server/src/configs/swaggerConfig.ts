import swaggerJsdoc from 'swagger-jsdoc';
import { IEnvConfig } from './IEnvConfig';

export const getSwaggerOptions = (config: IEnvConfig) => {
    const options = swaggerJsdoc({
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Fair Track API',
                version: '1.0.0',
                description: 'API documentation for Fair Track application - A fair expense tracking system',
                contact: {
                    name: 'API Support',
                    url: 'https://example.com',
                    email: 'support@example.com',
                },
            },
            servers: [
                {
                    url: `http://localhost:${config.port || 3001}${config.apiPrefix || '/api'}`,
                    description: 'Development Server',
                },
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    },
                },
                schemas: {
                    User: {
                        type: 'object',
                        required: ['username', 'email', 'password'],
                        properties: {
                            _id: {
                                type: 'string',
                                example: '507f1f77bcf86cd799439011',
                            },
                            username: {
                                type: 'string',
                                minLength: 3,
                                maxLength: 50,
                                example: 'john_doe',
                            },
                            email: {
                                type: 'string',
                                format: 'email',
                                example: 'john@example.com',
                            },
                            password: {
                                type: 'string',
                                minLength: 6,
                                example: 'password123',
                            },
                            type: {
                                type: 'string',
                                enum: ['admin', 'user'],
                                default: 'user',
                            },
                            createdAt: {
                                type: 'string',
                                format: 'date-time',
                            },
                            updatedAt: {
                                type: 'string',
                                format: 'date-time',
                            },
                        },
                    },
                    Category: {
                        type: 'object',
                        required: ['name', 'userId'],
                        properties: {
                            _id: {
                                type: 'string',
                                example: '507f1f77bcf86cd799439011',
                            },
                            name: {
                                type: 'string',
                                minLength: 2,
                                maxLength: 100,
                                example: 'Groceries',
                            },
                            description: {
                                type: 'string',
                                maxLength: 500,
                                example: 'Grocery expenses',
                            },
                            userId: {
                                type: 'string',
                                example: '507f1f77bcf86cd799439011',
                            },
                            createdAt: {
                                type: 'string',
                                format: 'date-time',
                            },
                            updatedAt: {
                                type: 'string',
                                format: 'date-time',
                            },
                        },
                    },
                    Transaction: {
                        type: 'object',
                        required: ['amount', 'type', 'userId', 'categoryId'],
                        properties: {
                            _id: {
                                type: 'string',
                                example: '507f1f77bcf86cd799439011',
                            },
                            amount: {
                                type: 'number',
                                minimum: 0,
                                example: 50.00,
                            },
                            date: {
                                type: 'string',
                                format: 'date-time',
                            },
                            note: {
                                type: 'string',
                                maxLength: 500,
                                example: 'Weekly groceries',
                            },
                            type: {
                                type: 'string',
                                enum: ['credit', 'debit'],
                                example: 'debit',
                            },
                            userId: {
                                type: 'string',
                                example: '507f1f77bcf86cd799439011',
                            },
                            categoryId: {
                                type: 'string',
                                example: '507f1f77bcf86cd799439011',
                            },
                            createdAt: {
                                type: 'string',
                                format: 'date-time',
                            },
                            updatedAt: {
                                type: 'string',
                                format: 'date-time',
                            },
                        },
                    },
                    Error: {
                        type: 'object',
                        properties: {
                            message: {
                                type: 'string',
                            },
                            error: {
                                type: 'string',
                            },
                        },
                    },
                },
            },
            tags: [
                {
                    name: 'User',
                    description: 'User management endpoints',
                },
                {
                    name: 'Category',
                    description: 'Category management endpoints',
                },
                {
                    name: 'Transaction',
                    description: 'Transaction management endpoints',
                },
            ],
        },
        apis: ['./src/routes/*.ts'],
    });

    return options;
};
