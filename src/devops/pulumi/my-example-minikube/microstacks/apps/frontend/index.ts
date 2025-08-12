import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";
import FrontendComponent from "./components/frontend";

// Recupera il nome dello stack corrente (es. "dev", "prod", "staging")
const currentStack = pulumi.getStack();
const currentOrg = pulumi.getOrganization();

const infraStack = new pulumi.StackReference(`${currentOrg}/my-example-minikube.infra/${currentStack}`);
const kubeconfig = infraStack.getOutput("kubeconfigFile");
const myExampleNamespace = infraStack.getOutput("myExampleNamespaceName");
const certManagerSelfSignedIssuerName = infraStack.getOutput("certManagerSelfSignedIssuerName");
const ingressClassName = infraStack.getOutput("ingressClassName");

const k8sProvider = new k8s.Provider("k8s-provider", { kubeconfig });

const backend = new FrontendComponent(
  "my-frontend",
  {
    namespace: myExampleNamespace,
    image: "allecrotti/my-example-image-fe",
    replicas: 3,
    selfSignedIssuerName: certManagerSelfSignedIssuerName,
    // Utilizza il nome della release di Traefik come ingressClassName
    ingressClassName: ingressClassName,
  },
  { provider: k8sProvider }
);
