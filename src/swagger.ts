import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';
import type { Request, Response} from "express";

export const setupSwagger = (app: Application) => {
  // Swagger definition
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Jahad Backend API',
        version: '1.0.0',
        description: 'API documentation for Jahad Backend project',
      },
      servers: [
        {
          url: 'http://localhost:4000',
        },
      ],
    },
    apis: ['./src/routes/*.ts'],
  };

  const swaggerSpec = swaggerJSDoc(options);

  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get('/swagger.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="swagger.json"');
    res.send(swaggerSpec);
  });
};
