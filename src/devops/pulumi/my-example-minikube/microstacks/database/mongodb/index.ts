import * as pulumi from "@pulumi/pulumi";
import MongoDB from "./components/mongodb";

const SECRET_KEY_MONGODB_ROOT_PASSWORD = "mongoRootPassword";
const SECRET_KEY_MONGODB_TODOS_USER_PASSWORD = "mongoTodosUserPassword";

const config = new pulumi.Config();
const mongoRootPassword = config.requireSecret(SECRET_KEY_MONGODB_ROOT_PASSWORD);
const mongoTodosUserPassword = config.requireSecret(SECRET_KEY_MONGODB_TODOS_USER_PASSWORD);

const mongodb = new MongoDB("my-mongodb", { mongoRootPassword, mongoTodosUserPassword });

// Contenendo la root password, la esportiamo come secret
export const mongodbConnectionString = pulumi.secret(mongodb.connectionString);
