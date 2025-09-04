import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import Fastify from "fastify";

const fastify = Fastify({ logger: true });

// Registra Swagger
export async function setupSwagger() {
  await fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: "API di Alessandro",
        description: "Documentazione delle API REST in Fastify con Swagger",
        version: "1.0.0",
      },
    },
  });

  await fastify.register(fastifySwaggerUi, {
    routePrefix: "/api-docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: false,
    },
    staticCSP: true,
    transformSpecification: (swaggerObject) => swaggerObject,
    transformSpecificationClone: true,
  });
}

export default fastify;
