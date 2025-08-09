import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";

interface FrontendArgs {
  namespace: pulumi.Input<string>;
  image: pulumi.Input<string>;
  replicas?: pulumi.Input<number>;
}

export default class FrontendComponent extends pulumi.ComponentResource {
  constructor(name: string, args: FrontendArgs, opts?: pulumi.ComponentResourceOptions) {
    super("my-example:frontendComponent", name, {}, opts);

    const appName = "my-example-fe";
    const host = "localhost.my-example.fe";
    const appLabels = { app: appName };
    const deployment = new k8s.apps.v1.Deployment(name, {
      metadata: {
        namespace: args.namespace,
        labels: appLabels,
        name: `${appName}-deployment`,
      },
      spec: {
        selector: { matchLabels: appLabels },
        replicas: args.replicas || 1,
        strategy: {
          type: "RollingUpdate",
          rollingUpdate: {
            maxSurge: 1,
            maxUnavailable: 1,
          },
        },
        template: {
          metadata: {
            labels: {
              ...appLabels,
              name: `${appName}-pod`,
            },
          },
          spec: {
            containers: [
              {
                name: `${appName}-container`,
                image: args.image,
                ports: [{ containerPort: 80 }],
                env: [
                  {
                    name: "API_URL",
                    value: "http://localhost.my-example.be",
                  },
                ],
              },
            ],
          },
        },
      },
    });

    const service = new k8s.core.v1.Service(name, {
      metadata: {
        namespace: args.namespace,
        name: `${appName}-service`,
      },
      spec: {
        type: "ClusterIP",
        ports: [{ port: 8080, targetPort: deployment.spec.template.spec.containers[0].ports[0].containerPort }],
        selector: appLabels,
      },
    });

    const ingress = new k8s.networking.v1.Ingress(
      name,
      {
        metadata: {
          namespace: args.namespace,
          name: `${appName}-ingress`,
        },
        spec: {
          ingressClassName: "traefik",
          rules: [
            {
              host,
              http: {
                paths: [
                  {
                    path: "/",
                    pathType: "Prefix",
                    backend: {
                      service: {
                        name: service.metadata.name,
                        port: { number: service.spec.ports[0].port },
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      { parent: deployment }
    );
  }
}
