# My Example Cluster

This is just an example of cluster with a frontend app, a backend app and mongodb. This comes from the docker example on `docker/my-example-image/docker-compose.yaml` where there you have the application running on your docker network, while here we have all on kubernetes. Images have already been published on m

Questo è un esempio di cluster dove abbiamo un'app di frontend, una di backend e mongodb. Sarebbe la rappresentazione su kubernetes dello stesso esempio fatto tramite `docker/my-example-image/docker-compose.yaml` sulla docker network. Le immagini sono state già pubblicate e sono accessibili per kuberentes.

## MongoDB

MongoDB deve essere installato tramite helm per poi essere utilizzato correttamente dentro il cluster. C'è la possibilità di installarlo standalone (un solo pod non scalabile) o come replicaset (scalabile orizzontalmente). Per ambienti reali di produzione si usa il replicaset che garantisce più flessibilità in futuro e anche funzionalità aggiuntive, per cui useremo questa modalità.

```shell
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm install my-example-mongo bitnami/mongodb --namespace mongodb --create-namespace -f mongodb-values.yaml --set auth.rootPassword=supersecretpassword --set auth.username=todos-user --set auth.password=todos-password
```

Comandi utili:

```bash
# Recuperare la password di root
export MONGODB_ROOT_PASSWORD=$(kubectl get secret --namespace mongodb mongo-secret -o jsonpath="{.data.mongodb-root-password}" | base64 -d)
# Recuperare la password di todos-user (la lista delle password di tutti gli utenti in realtà)
export MONGODB_PASSWORD=$(kubectl get secret --namespace mongodb my-example-mongo-mongodb -o jsonpath="{.data.mongodb-passwords}" | base64 -d | awk -F',' '{print $1}')
```

Creare la secret con la password di root nel namespace `my-example` perchè non si possono recuperare le secret da namespace differenti:

```shell
kubectl create secret generic my-example-mongodb --namespace my-example --from-literal=root-password=supersecretpassword
```

## Backend

L'applicazione di backend è quella nella cartella `devops/docker/my-example-image/backend` e si basa sull'immagine publicata `allecrotti/my-example-image-be`.

Peculiarità:

- è stata creata una secret col valore della password di root per gestire nel namespace `my-example` la connessione al db
  - `kubectl create secret generic my-example-mongodb --namespace my-example --from-literal=root-password=supersecretpassword`
- Tramite la secret, si è creata una variabile d'ambiente `MONGO_PASSWORD` al solo scopo di comporre l'url di connessione `MONGODB_URI` che viene effettivamente usato dall'applicazione
- L'url di connessione al db si basa sul DNS del service creato per mongodb
- Usando `Traefix` è stato fatto un `Ingress` per l'host `localhost.my-example.be` che è stato messo nel file hosts di windows associato a 127.0.0.1
- Non è stato gestito il certificato SSL, non era necessario

## Frontend

L'applicazione di frontend è quella nella cartella `devops/docker/my-example-image/frontend` e si basa sull'immagine publicata `allecrotti/my-example-image-fe`.

Peculiarità:

- Utilizza l'environment variable `API_URL` per settare l'url di backend definito dall'Ingress del backend
  - Questo valore serve alla creazione del container per sostituire il file `config.js` con una versione che valorizza `API_URL` con il valore della variabile d'ambiente
- Il container internamente lavora sulla porta 80, me nel cluster quella porta è già utilizzata da Traefik, per cui si è scelto di usare una porta diversa
