import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";

export default class MyExampleNamespace extends pulumi.ComponentResource {
  private readonly myExampleNamespace: k8s.core.v1.Namespace;
  constructor(name: string, opts?: pulumi.ComponentResourceOptions) {
    super("my-example:MyExampleNamespace", name, {}, opts);

    this.myExampleNamespace = new k8s.core.v1.Namespace("my-example-namespace", {
      metadata: {
        name: "my-example",
      },
    });
  }

  public get namespaceName(): pulumi.Output<string> {
    return this.myExampleNamespace.metadata.name;
  }
}
