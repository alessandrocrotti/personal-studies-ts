import * as fs from "fs";
import * as os from "os";
import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";
import BackendComponent from "./backend/components";
import CertManager from "./common/cert-manager";
import Constants from "./common/constants";
import MongoDB from "./common/mongodb";
import NamespaceComponent from "./common/namespace";
import Traefik from "./common/traefik";
import FrontendComponent from "./frontend/components";

// Crea il k8sProvider da usare.
// Non sarebbe necessario, perchè pulumi lanciato dal proprio pc riesce auutomaticamente a recuperare il kubeconfig, ma è utile per essere espliciti e per poterlo usare in altri contesti
// Recupera il kubeconfig usando os.homedir() per essere compatibile con Windows, Mac e Linux
const kubeconfigPath = `${os.homedir()}/.kube/config`;
const kubeconfig = pulumi.secret(fs.readFileSync(kubeconfigPath).toString());
const k8sProvider = new k8s.Provider("k8s-provider", { kubeconfig });

const traefik = new Traefik("my-traefik", { provider: k8sProvider });

const certManager = new CertManager("my-cert-manager", { provider: k8sProvider });

const config = new pulumi.Config();
const mongoRootPassword = config.requireSecret(Constants.SECRET_KEY_MONGODB_ROOT_PASSWORD);
const mongoTodosUserPassword = config.requireSecret(Constants.SECRET_KEY_MONGODB_TODOS_USER_PASSWORD);
const mongodb = new MongoDB(
  "my-mongodb",
  {
    mongoRootPassword,
    mongoTodosUserPassword,
  },
  { provider: k8sProvider }
);

const myExampleNamespace = new NamespaceComponent("my-example", { provider: k8sProvider });

const backend = new BackendComponent(
  "my-backend",
  {
    namespace: myExampleNamespace.namespaceName,
    image: "allecrotti/my-example-image-be",
    replicas: 3,
    selfSignedIssuerName: certManager.selfSignedClusterIssuerName,
    // Utilizza il nome della release di Traefik come ingressClassName
    ingressClassName: traefik.releaseName,
    mongoDBDatabase: "todos",
    mongoDBConnectionString: mongodb.connectionString,
  },
  {
    provider: k8sProvider,
    dependsOn: [myExampleNamespace, mongodb, traefik, certManager],
  }
);

const frontend = new FrontendComponent(
  "my-frontend",
  {
    namespace: myExampleNamespace.namespaceName,
    image: "allecrotti/my-example-image-fe",
    replicas: 3,
    selfSignedIssuerName: certManager.selfSignedClusterIssuerName,
    // Utilizza il nome della release di Traefik come ingressClassName
    ingressClassName: traefik.releaseName,
  },
  {
    provider: k8sProvider,
    dependsOn: [myExampleNamespace, traefik, certManager],
  }
);
