import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";
import MongoDB from "./components/mongodb";

// Recupera il nome dello stack corrente (es. "dev", "prod", "staging")
const currentStack = pulumi.getStack();
const currentOrg = pulumi.getOrganization();

const infraStack = new pulumi.StackReference(`${currentOrg}/my-example-minikube.infra/${currentStack}`);
const kubeconfig = infraStack.getOutput("kubeconfigFile");

const SECRET_KEY_MONGODB_ROOT_PASSWORD = "mongoRootPassword";
const SECRET_KEY_MONGODB_TODOS_USER_PASSWORD = "mongoTodosUserPassword";

const config = new pulumi.Config();
const mongoRootPassword = config.requireSecret(SECRET_KEY_MONGODB_ROOT_PASSWORD);
const mongoTodosUserPassword = config.requireSecret(SECRET_KEY_MONGODB_TODOS_USER_PASSWORD);

const k8sProvider = new k8s.Provider("k8s-provider", { kubeconfig });

const mongodb = new MongoDB("my-mongodb", { mongoRootPassword, mongoTodosUserPassword }, { provider: k8sProvider });

// Contenendo la root password, la esportiamo come secret
export const mongodbConnectionString = pulumi.secret(mongodb.connectionString);
