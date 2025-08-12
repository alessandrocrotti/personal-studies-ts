import * as pulumi from "@pulumi/pulumi";
import FrontendComponent from "./components/frontend";

// Recupera il nome dello stack corrente (es. "dev", "prod", "staging")
const currentStack = pulumi.getStack();
const currentOrg = pulumi.getOrganization();

const infraStack = new pulumi.StackReference(`${currentOrg}/my-example-minikube.infra/${currentStack}`);
const myExampleNamespace = infraStack.getOutput("myExampleNamespaceName");
const certManagerSelfSignedIssuerName = infraStack.getOutput("certManagerSelfSignedIssuerName");
const ingressClassName = infraStack.getOutput("ingressClassName");

const backend = new FrontendComponent("my-frontend", {
  namespace: myExampleNamespace,
  image: "allecrotti/my-example-image-fe",
  replicas: 3,
  selfSignedIssuerName: certManagerSelfSignedIssuerName,
  // Utilizza il nome della release di Traefik come ingressClassName
  ingressClassName: ingressClassName,
});
