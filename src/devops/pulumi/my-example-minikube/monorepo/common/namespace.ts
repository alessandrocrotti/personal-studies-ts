import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";

export default class NamespaceComponent extends pulumi.ComponentResource {
  private readonly namespace: k8s.core.v1.Namespace;
  constructor(namespace: string, opts?: pulumi.ComponentResourceOptions) {
    super(`my-example:namespace:component`, `${namespace}-namespace-component`, {}, opts);

    this.namespace = new k8s.core.v1.Namespace(
      `${namespace}-namespace`,
      {
        metadata: {
          name: namespace,
        },
      },
      { parent: this }
    );
  }

  public get namespaceName(): pulumi.Output<string> {
    return this.namespace.metadata.name;
  }
}
