import BackendComponent from "./backend/components";
import MyExampleNamespace from "./common/my-example-namespace";
import FrontendComponent from "./frontend/components";

const myExampleNamespace = new MyExampleNamespace("my-example-namespace");
const backend = new BackendComponent(
  "backend",
  {
    namespace: myExampleNamespace.namespaceName,
    image: "allecrotti/my-example-image-be",
    replicas: 3,
  },
  { parent: myExampleNamespace }
);
const frontend = new FrontendComponent(
  "frontend",
  {
    namespace: myExampleNamespace.namespaceName,
    image: "allecrotti/my-example-image-fe",
    replicas: 3,
  },
  { parent: myExampleNamespace }
);
