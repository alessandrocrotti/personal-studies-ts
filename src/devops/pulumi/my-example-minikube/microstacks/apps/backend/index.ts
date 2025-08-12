import * as pulumi from "@pulumi/pulumi";
import BackendComponent from "./components/backend";

// Recupera il nome dello stack corrente (es. "dev", "prod", "staging")
const currentStack = pulumi.getStack();
const currentOrg = pulumi.getOrganization();

const infraStack = new pulumi.StackReference(`${currentOrg}/my-example-minikube.infra/${currentStack}`);
const myExampleNamespace = infraStack.getOutput("myExampleNamespaceName");
const certManagerSelfSignedIssuerName = infraStack.getOutput("certManagerSelfSignedIssuerName");
const ingressClassName = infraStack.getOutput("ingressClassName");

const mongoDBStack = new pulumi.StackReference(`${currentOrg}/my-example-minikube.database.mongodb/${currentStack}`);
// Essendo una secret, applichiamo `pulumi.secret` per garantire che il valore sia trattato come tale
const mongodbConnectionString = mongoDBStack.getOutput("mongodbConnectionString").apply(pulumi.secret<string>) as pulumi.Output<string>;

const backend = new BackendComponent("my-backend", {
  namespace: myExampleNamespace,
  image: "allecrotti/my-example-image-be",
  replicas: 3,
  selfSignedIssuerName: certManagerSelfSignedIssuerName,
  // Utilizza il nome della release di Traefik come ingressClassName
  ingressClassName: ingressClassName,
  mongoDBDatabase: "todos",
  mongoDBConnectionString: mongodbConnectionString,
});
