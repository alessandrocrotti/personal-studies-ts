import { FastifyPluginAsync } from "fastify";

const users: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/", async function (request, reply) {
    return "this is users";
  });

  // Example of a route with a parameter
  // This will respond to GET requests at /users/:id
  fastify.get("/:id", async (req) => {
    const { id } = req.params as { id: string };
    return { userId: id };
  });
};

export default users;
