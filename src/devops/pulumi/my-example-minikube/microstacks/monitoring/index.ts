import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";
import ObservabilityComponent from "./components/observability";

// Recupera il nome dello stack corrente (es. "dev", "prod", "staging")
const currentStack = pulumi.getStack();
const currentOrg = pulumi.getOrganization();

const infraStack = new pulumi.StackReference(`${currentOrg}/my-example-minikube.infra/${currentStack}`);
const kubeconfig = infraStack.getOutput("kubeconfigFile");
const certManagerSelfSignedIssuerName = infraStack.getOutput("certManagerSelfSignedIssuerName");
const ingressClassName = infraStack.getOutput("ingressClassName");

// IMPORTANTE: questa logica di esportare il kubeconfig è logicamente corretta, ma quando fai ripartire il minikube questo rigenera il file kubeconfig e quindi cambia ogni volta.
// Nei vari componenti lascio commentata la logica come esempio, ma è meglio lasciare la gestione implicita
const k8sProvider = new k8s.Provider("k8s-provider", { kubeconfig });

const observability = new ObservabilityComponent(
  "my-observability",
  {
    selfSignedIssuerName: certManagerSelfSignedIssuerName,
    // Utilizza il nome della release di Traefik come ingressClassName
    ingressClassName: ingressClassName,
  }
  /*, { provider: k8sProvider } */
);
