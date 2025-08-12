import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";
import NamespaceComponent from "./namespace";

export default class Traefik extends pulumi.ComponentResource {
  public readonly releaseName: pulumi.Output<string>;
  public readonly namespaceName: pulumi.Output<string>;
  constructor(name: string, opts?: pulumi.ComponentResourceOptions) {
    super(`my-example:traefik:component`, `${name}-component`, {}, opts);

    // Crea il namespace tramite il componente NamespaceComponent
    const traefikNamespace = new NamespaceComponent("traefik", { parent: this });

    // Installa traefik come se Helm chart fosse un unico componente
    const traefik = new k8s.helm.v3.Release(`${name}-traefik-release`, {
      chart: "traefik",
      repositoryOpts: {
        repo: "https://traefik.github.io/charts",
      },
      // Release name per evitare di avere nomi complessi con il suffisso del nome del componente
      name: "traefik",
      namespace: traefikNamespace.namespaceName,
      version: "37.0.0",
    });

    // Esporta il nome della release come output.
    // Avendo messo `name: "traefik",` questa sarà fissa "traefik", ma è corretto recuperarla dinamicamente nel caso si scegla di cambiare release name
    this.releaseName = traefik.status.apply((status) => status.name);
    this.namespaceName = traefikNamespace.namespaceName;
  }
}
