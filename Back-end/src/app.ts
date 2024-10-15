import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { routesApp } from './http/routes';
import { conectDatabase } from './lib/mongodb';

conectDatabase();

export const app = express();
app.use(cors())

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentação da API com Swagger',
    },
  },
  apis: ['./src/http/routes/**/*.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

routesApp(app)