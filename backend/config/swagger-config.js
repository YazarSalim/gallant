import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'These are the api documentation for the web app side.',
    },

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
      { bearerAuth: [] },
    ],
  },

  apis: ['./api/**/*.js'],
};

export default await swaggerJsdoc(options);
