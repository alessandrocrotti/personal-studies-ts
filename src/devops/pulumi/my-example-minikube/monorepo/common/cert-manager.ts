import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";
import * as certmanager from "@pulumi/kubernetes-cert-manager";
import NamespaceComponent from "./namespace";

/**
 * Add certificate manager to get a SSL certificates for any cluster endpoint which could need of it
 * (for example: Grafana needs it for SSO)
 */
export default class CertManager extends pulumi.ComponentResource {
  private readonly selfSignedClusterIssuer: k8s.apiextensions.CustomResource;
  constructor(name: string, opts?: pulumi.ComponentResourceOptions) {
    super(`my-example:cert-manager:component`, `${name}-component`, {}, opts);

    // Crea il namespace tramite il componente NamespaceComponent
    const certManagerNamespace = new NamespaceComponent("cert-manager", { parent: this });

    // Install cert-manager Helm chart using the `kubernetes-cert-manager` package.
    // This will deploy cert-manager along with CRDs required to configure certificates.
    const certManager = new certmanager.CertManager(
      `${name}-cert-manager`,
      {
        installCRDs: true,
        helmOptions: {
          namespace: certManagerNamespace.namespaceName,
        },
      },
      {
        // Garantisce che il cert-manager venga creato dopo che il namespace è stato creato
        dependsOn: [certManagerNamespace],
        // Utilizzato per garantire che le "opts" passate al componente padre siano propagate a questo componente (figlio)
        parent: this,
      }
    );

    this.selfSignedClusterIssuer = new k8s.apiextensions.CustomResource(
      `${name}-selfsigned-clusterissuer`,
      {
        apiVersion: "cert-manager.io/v1",
        kind: "ClusterIssuer",
        metadata: {
          name: "selfsigned-clusterissuer",
        },
        spec: {
          selfSigned: {},
        },
      },
      {
        // Garantisce che il ClusterIssuer venga creato dopo che il cert-manager è stato installato
        dependsOn: [certManager],
        // Utilizzato per garantire che le "opts" passate al componente padre siano propagate a questo componente (figlio)
        parent: this,
      }
    );
  }

  public get selfSignedClusterIssuerName(): pulumi.Output<string> {
    return this.selfSignedClusterIssuer.metadata.name;
  }
}
