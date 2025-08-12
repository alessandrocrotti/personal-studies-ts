import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";
import Constants from "../common/constants";

interface BackendArgs {
  namespace: pulumi.Input<string>;
  image: pulumi.Input<string>;
  replicas?: pulumi.Input<number>;
  selfSignedIssuerName: pulumi.Input<string>;
  mongoDBServiceName: pulumi.Input<string>;
  mongoDBNamespaceName: pulumi.Input<string>;
  mongoDBDatabase: pulumi.Input<string>;
  ingressClassName: pulumi.Input<string>;
}

export default class BackendComponent extends pulumi.ComponentResource {
  constructor(name: string, args: BackendArgs, opts?: pulumi.ComponentResourceOptions) {
    super(`my-example:backend:component`, `${name}-component`, {}, opts);

    // Crea una kubernetes secret utilizzando le pulumi secret
    const config = new pulumi.Config();
    const mongoRootPassword = config.requireSecret(Constants.SECRET_KEY_MONGODB_ROOT_PASSWORD);
    const mongoTodosUserPassword = config.requireSecret(Constants.SECRET_KEY_MONGODB_TODOS_USER_PASSWORD);
    const mongoSecret = new k8s.core.v1.Secret(
      `${name}-mongo-secret`,
      {
        metadata: {
          name: Constants.SECRET_KEY_MY_EXAMPLE_MONGODB,
          namespace: args.namespace,
        },
        stringData: {
          [Constants.SECRET_KEY_MONGODB_ROOT_PASSWORD]: mongoRootPassword,
          [Constants.SECRET_KEY_MONGODB_TODOS_USER_PASSWORD]: mongoTodosUserPassword,
        },
      },
      {
        // Utilizzato per garantire che le "opts" passate al componente padre siano propagate a questo componente (figlio)
        parent: this,
      }
    );

    const appName = "my-example-be";
    const host = Constants.HOSTNAME_BACKEND;
    const envKeyMongoDBPassword = "MONGODB_PASSWORD";
    const appLabels = { app: appName };
    const deployment = new k8s.apps.v1.Deployment(
      `${name}-deployment`,
      {
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
                  ports: [{ containerPort: 8000 }],
                  env: [
                    {
                      name: envKeyMongoDBPassword,
                      valueFrom: {
                        secretKeyRef: {
                          name: Constants.SECRET_KEY_MY_EXAMPLE_MONGODB,
                          key: Constants.SECRET_KEY_MONGODB_ROOT_PASSWORD,
                        },
                      },
                    },
                    {
                      name: "MONGODB_URI",
                      // Componiamo l'URI di connessione a MongoDB utilizzando la variabile d'ambiente envKeyMongoDBPassword e gli args MongoDBReleaseName e MongoDBNamespaceName ricavati dal componente MongoDB
                      value: pulumi.interpolate`mongodb://root:$(${envKeyMongoDBPassword})@${args.mongoDBServiceName}.${args.mongoDBNamespaceName}.svc.cluster.local:27017/${args.mongoDBDatabase}?authSource=admin`,
                    },
                  ],
                },
              ],
            },
          },
        },
      },
      {
        // Garantisce che il deployment venga creato dopo che il secret è stato creato
        dependsOn: [mongoSecret],
        // Utilizzato per garantire che le "opts" passate al componente padre siano propagate a questo componente (figlio)
        parent: this,
      }
    );

    const service = new k8s.core.v1.Service(
      `${name}-service`,
      {
        metadata: {
          namespace: args.namespace,
          name: `${appName}-service`,
        },
        spec: {
          type: "ClusterIP",
          // Utilizzare la porta 8080 sia per il backend che per il frontend non è un problema, basta che si utilizzino nomi di servizio diversi
          ports: [{ port: 8080, targetPort: deployment.spec.template.spec.containers[0].ports[0].containerPort }],
          selector: appLabels,
        },
      },
      {
        // Utilizzato per garantire che le "opts" passate al componente padre siano propagate a questo componente (figlio)
        parent: this,
      }
    );

    const ingress = new k8s.networking.v1.Ingress(
      `${name}-ingress`,
      {
        metadata: {
          namespace: args.namespace,
          name: `${appName}-ingress`,
          annotations: {
            // Limita l'ingress al traffico dall'endpoint web, cioè HTTP
            "traefik.ingress.kubernetes.io/router.entrypoints": "web",
          },
        },
        spec: {
          ingressClassName: args.ingressClassName,
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
      {
        // Utilizzato per garantire che le "opts" passate al componente padre siano propagate a questo componente (figlio)
        parent: this,
      }
    );

    const secureIngress = new k8s.networking.v1.Ingress(
      `${name}-secure-ingress`,
      {
        metadata: {
          namespace: args.namespace,
          name: `${appName}-secure-ingress`,
          annotations: {
            "cert-manager.io/cluster-issuer": args.selfSignedIssuerName,
            // Limita l'ingress al traffico dall'endpoint websecure, cioè HTTPS
            "traefik.ingress.kubernetes.io/router.entrypoints": "websecure",
          },
        },
        spec: {
          ingressClassName: args.ingressClassName,
          tls: [
            {
              hosts: [host],
              secretName: `${appName}-tls`,
            },
          ],
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
      {
        // Utilizzato per garantire che le "opts" passate al componente padre siano propagate a questo componente (figlio)
        parent: this,
      }
    );
  }
}
