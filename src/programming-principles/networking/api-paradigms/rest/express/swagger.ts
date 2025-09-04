import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API di Alessandro",
      version: "1.0.0",
      description: "Documentazione delle API REST in Express con Swagger",
    },
  },
  apis: ["./**/*.ts"], // o il file dove hai definito le rotte (server.ts oppure tutte le .ts)
};

export const swaggerSpec = swaggerJSDoc(options);
export const swaggerUiMiddleware = swaggerUi.serve;
export const swaggerUiSetup = swaggerUi.setup(swaggerSpec);
