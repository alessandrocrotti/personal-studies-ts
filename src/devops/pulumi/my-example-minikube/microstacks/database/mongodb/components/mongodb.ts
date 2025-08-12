import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";

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

    const config = new pulumi.Config();

    // Crea il namespace tramite il componente NamespaceComponent
    const mongoDBNamespace = new k8s.core.v1.Namespace(
      `${name}-namespace`,
      {
        metadata: {
          name: "mongodb",
        },
      },
      { parent: this }
    );

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
        namespace: mongoDBNamespace.metadata.name,
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

    // Esporta il nome della release come output.
    // Avendo messo `name: "mongodb",` questa sarà fissa "mongodb", ma è corretto recuperarla dinamicamente nel caso si scegla di cambiare release name
    // Si usa apply proprio perchè status è un output asincrono e deve essere risolto dopo che la risorsa è stata creata
    this.releaseName = mongodbRelease.status.apply((status) => status.name);
    this.namespaceName = mongoDBNamespace.metadata.name;
    this.connectionString = pulumi.interpolate`mongodb://root:${args.mongoRootPassword}@${this.releaseName}.${this.namespaceName}.svc.cluster.local:27017`;

    this.registerOutputs({
      releaseName: this.releaseName,
      namespaceName: this.namespaceName,
      connectionString: this.connectionString,
    });
  }
}
