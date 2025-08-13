import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";

interface ObservabilityArgs {
  selfSignedIssuerName: pulumi.Input<string>;
  ingressClassName: pulumi.Input<string>;
}

/**
 * Add observability stack with Prometheus and Grafana
 */
export default class ObservabilityComponent extends pulumi.ComponentResource {
  constructor(name: string, args: ObservabilityArgs, opts?: pulumi.ComponentResourceOptions) {
    super(`my-example:observability:component`, `${name}-component`, {}, opts);

    // Crea il namespace
    const monitoringNamespace = new k8s.core.v1.Namespace(
      `${name}-namespace`,
      {
        metadata: {
          name: "monitoring",
        },
      },
      { parent: this }
    );

    // Helm Chart kube-prometheus-stack
    const observability = new k8s.helm.v3.Release(
      `${name}-kube-prometheus-stack`,
      {
        chart: "kube-prometheus-stack",
        name: "kube-prometheus-stack",
        version: "76.3.0",
        namespace: monitoringNamespace.metadata.name,
        repositoryOpts: {
          repo: "https://prometheus-community.github.io/helm-charts",
        },
        values: {
          grafana: {
            ingress: {
              enabled: true,
              ingressClassName: args.ingressClassName,
              annotations: {
                "traefik.ingress.kubernetes.io/router.entrypoints": "websecure",
                "traefik.ingress.kubernetes.io/router.tls": "true",
                "cert-manager.io/cluster-issuer": args.selfSignedIssuerName,
              },
              hosts: ["localhost.my-example.grafana"],
              tls: [
                {
                  hosts: ["localhost.my-example.grafana"],
                  secretName: "grafana-tls",
                },
              ],
            },
          },
          prometheus: {
            ingress: {
              enabled: true,
              ingressClassName: args.ingressClassName,
              annotations: {
                "traefik.ingress.kubernetes.io/router.entrypoints": "websecure",
                "traefik.ingress.kubernetes.io/router.tls": "true",
                "cert-manager.io/cluster-issuer": args.selfSignedIssuerName,
              },
              hosts: ["localhost.my-example.prometheus"],
              tls: [
                {
                  hosts: ["localhost.my-example.prometheus"],
                  secretName: "prometheus-tls",
                },
              ],
            },
          },
        },
      },
      {
        dependsOn: monitoringNamespace,
        parent: this,
      }
    );
  }
}
