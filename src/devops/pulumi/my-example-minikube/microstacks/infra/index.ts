import * as fs from "fs";
import * as os from "os";
import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";
import Traefik from "./components/traefik";
import CertManager from "./components/cert-manager";
import NamespaceComponent from "./components/namespace";

// Crea il k8sProvider da usare.
// Non sarebbe necessario, perchè pulumi lanciato dal proprio pc riesce auutomaticamente a recuperare il kubeconfig, ma è utile per essere espliciti e per poterlo usare in altri contesti
// Recupera il kubeconfig usando os.homedir() per essere compatibile con Windows, Mac e Linux
const kubeconfigPath = `${os.homedir()}/.kube/config`;
const kubeconfig = pulumi.secret(fs.readFileSync(kubeconfigPath).toString());
const k8sProvider = new k8s.Provider("k8s-provider", { kubeconfig });

const traefik = new Traefik("my-traefik" /*, { provider: k8sProvider } */);
const certManager = new CertManager("my-cert-manager" /*, { provider: k8sProvider } */);
const myExampleNamespace = new NamespaceComponent("my-example" /*, { provider: k8sProvider } */);

// Esporta il kubeconfig come output, in modo che possa essere usato da altri microstacks
// IMPORTANTE: questa logica di esportare il kubeconfig è logicamente corretta, ma quando fai ripartire il minikube questo rigenera il file kubeconfig e quindi cambia ogni volta.
// Nei vari componenti lascio commentata la logica come esempio, ma è meglio lasciare la gestione implicita
export const kubeconfigFile = kubeconfig;
export const ingressClassName = traefik.releaseName;
export const certManagerSelfSignedIssuerName = certManager.selfSignedClusterIssuerName;
export const myExampleNamespaceName = myExampleNamespace.namespaceName;
