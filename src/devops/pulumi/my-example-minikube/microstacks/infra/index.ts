import Traefik from "./components/traefik";
import CertManager from "./components/cert-manager";
import NamespaceComponent from "./components/namespace";

const traefik = new Traefik("my-traefik");
const certManager = new CertManager("my-cert-manager");
const myExampleNamespace = new NamespaceComponent("my-example");

export const ingressClassName = traefik.releaseName;
export const certManagerSelfSignedIssuerName = certManager.selfSignedClusterIssuerName;
export const myExampleNamespaceName = myExampleNamespace.namespaceName;
