const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Node.js API with Swagger',
        version: '1.0.0',
        description: 'This is a REST API application made with Express and documented with Swagger',
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Development server',
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
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
    tags: [
        {
            name: 'Users',
            description: 'User related endpoints',
        },
        {
            name: 'Properties',
            description: 'Property related endpoints',
        },
        {
            name: 'Reservations',
            description: 'Reservation related endpoints',
        },
    ],
};

// Options for the swagger docs
const options = {
    swaggerDefinition,
    // Paths to files containing OpenAPI definitions
    apis: ['./app.js', './routes/*.js'],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerSpec, swaggerUi };
