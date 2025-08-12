import BackendComponent from "./backend/components";
import CertManager from "./common/cert-manager";
import MongoDB from "./common/mongodb";
import NamespaceComponent from "./common/namespace";
import Traefik from "./common/traefik";
import FrontendComponent from "./frontend/components";

const traefik = new Traefik("my-traefik");
const certManager = new CertManager("my-cert-manager", {
  dependsOn: [traefik],
});
const mongodb = new MongoDB("my-mongodb");
const myExampleNamespace = new NamespaceComponent("my-example");
const backend = new BackendComponent(
  "my-backend",
  {
    namespace: myExampleNamespace.namespaceName,
    image: "allecrotti/my-example-image-be",
    replicas: 3,
    selfSignedIssuerName: certManager.selfSignedClusterIssuerName,
    mongoDBDatabase: "todos",
    // Utilizza il nome della release di MongoDB come mongoDBServiceName
    mongoDBServiceName: mongodb.releaseName,
    mongoDBNamespaceName: mongodb.namespaceName,
    // Utilizza il nome della release di Traefik come ingressClassName
    ingressClassName: traefik.releaseName,
  },
  { dependsOn: [myExampleNamespace, mongodb, certManager] }
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
  { dependsOn: [myExampleNamespace, certManager] }
);
