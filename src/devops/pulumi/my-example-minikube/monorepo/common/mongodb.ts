import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";
import NamespaceComponent from "./namespace";

interface MongoDBArgs {
  mongoRootPassword: pulumi.Input<string>;
  mongoTodosUserPassword: pulumi.Input<string>;
}

export default class MongoDB extends pulumi.ComponentResource {
  public readonly releaseName: pulumi.Output<string>;
  public readonly namespaceName: pulumi.Output<string>;
  public readonly connectionString: pulumi.Output<string>;
  constructor(name: string, args: MongoDBArgs, opts?: pulumi.ComponentResourceOptions) {
    super(`my-example:mongodb:component`, `${name}-component`, {}, opts);

    // Crea il namespace tramite il componente NamespaceComponent
    const mongoDBNamespace = new NamespaceComponent("mongodb", { parent: this });

    // Installa mongodb come se Helm chart fosse un unico componente
    const mongodbRelease = new k8s.helm.v3.Release(
      `${name}-mongodb-release`,
      {
        chart: "mongodb",
        // Release name per evitare di avere nomi complessi con il suffisso del nome del componente
        name: "mongodb",
        repositoryOpts: {
          repo: "https://charts.bitnami.com/bitnami",
        },
        namespace: mongoDBNamespace.namespaceName,
        version: "16.5.40",
        values: {
          auth: {
            enabled: true,
            rootPassword: args.mongoRootPassword,
            username: "todos-user",
            password: args.mongoTodosUserPassword,
            database: "todos",
          },
          service: {
            type: "ClusterIP",
            port: 27017,
          },
          persistence: {
            enabled: true,
            storageClass: "standard",
            size: "1Gi",
          },
          resources: {
            requests: {
              memory: "512Mi",
              cpu: "250m",
            },
            limits: {
              memory: "1Gi",
              cpu: "500m",
            },
          },
          metrics: {
            enabled: true,
            serviceMonitor: {
              enabled: false, // Set to true if you are using Prometheus
            },
          },
        },
      },
      {
        // Garantisce che il rilascio venga creato dopo che il namespace è stato creato
        dependsOn: [mongoDBNamespace],
        // Utilizzato per garantire che le "opts" passate al componente padre siano propagate a questo componente (figlio)
        parent: this,
      }
    );

    this.releaseName = mongodbRelease.status.apply((status) => status.name);
    this.namespaceName = mongoDBNamespace.namespaceName;
    // Utilizzo interpolate per risolvere le variabili che sono Output visto che sono valori asincroni
    this.connectionString = pulumi.interpolate`mongodb://root:${args.mongoRootPassword}@${this.releaseName}.${this.namespaceName}.svc.cluster.local:27017`;
    this.registerOutputs({
      releaseName: this.releaseName,
      namespaceName: this.namespaceName,
      connectionString: this.connectionString,
    });
  }
}
