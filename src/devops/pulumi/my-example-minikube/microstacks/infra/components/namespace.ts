import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";

export default class NamespaceComponent extends pulumi.ComponentResource {
  public readonly namespaceName: pulumi.Output<string>;
  constructor(namespaceString: string, opts?: pulumi.ComponentResourceOptions) {
    super(`my-example:namespace:component`, `${namespaceString}-namespace-component`, {}, opts);

    const namespace = new k8s.core.v1.Namespace(
      `${namespaceString}-namespace`,
      {
        metadata: {
          name: namespaceString,
        },
      },
      { parent: this }
    );

    this.namespaceName = namespace.metadata.name;
    this.registerOutputs({
      namespaceName: this.namespaceName,
    });
  }
}
