# Kubernetes

- [Kubernetes](#kubernetes)
  - [Descrizione](#descrizione)
  - [Cluster locali](#cluster-locali)
    - [Minikube](#minikube)
    - [Docker Desktop - Opzione Kubernetes](#docker-desktop---opzione-kubernetes)
  - [CLI](#cli)
  - [Control Plane](#control-plane)
  - [Node](#node)
  - [Namespace](#namespace)
  - [Workflows](#workflows)
    - [Pod](#pod)
      - [Port-Forwarding](#port-forwarding)
    - [Deployment](#deployment)
      - [ReplicaSet](#replicaset)
      - [Strategy/Rollout](#strategyrollout)
    - [StatefulSet](#statefulset)
    - [DaemonSet](#daemonset)
    - [Job](#job)
    - [CronJob](#cronjob)
  - [Operator (Custom Workload)](#operator-custom-workload)
  - [Service](#service)
  - [Meccanismi di scheduling](#meccanismi-di-scheduling)
  - [Configurazioni di sicurezza](#configurazioni-di-sicurezza)

## Descrizione

K8S è un orchestratore di container, composto un cluster di nodi che contengono pod che a loro volta contengono container.

## Cluster locali

### Minikube

Per poter sperimentare localmente con K8S, si può installare tramite `choco`, Minikube che rappresenta una istanza di kubernate eseguita in locale con un solo nodo. Installando `kubectl` si può interagire col cluster ed eseguire i comandi come un vero cluster kubernetes.

### Docker Desktop - Opzione Kubernetes

Nella sezione Settings > Kubernetes si può attivare Kubernetes come servizio aggiuntivo che permette di creare un cluster Kubernetes locale.

## CLI

Ci sono diverse cli importanti da usare:

- `kubectx`: permette di gestire facilmente l'accesso a cluster diversi. Puoi definire qual è l'attuale in utilizzo e passare ad un altro
- `kubens`: permette di definire qual è il namespace in utilizzo attualmente e cambiarlo
- `kubectl`: esegue tutti i comandi verso il cluster in utilizzo e se non definisci il namespace, utilizza quello definito come in uso

## Control Plane

Layer di controllo dell'intero cluster, ed è composto da nodi master perchè ognuno gestisce il cluster con caratteristiche speciali e non esegue i container.
I nodi master insieme creano un Control Plane distribuito ed ogni nodo master è composto da vari componenti:

- **Control Manager**: è come se fosse un loop infinito che controlla costantemente che lo stato del cluster sia corretto, se non lo fosse prende decisioni correttive per ripristinare lo stato voluto
- **API Server**: è il gateway del cluster che espone le API REST con cui si comunica dall'esterno verso l'interno (per esempio facendo comandi `kubectl` si comunuca con questo componente). Anche i componenti interni lo usano, come etcd, da cui legge e scrive lo stato. Punto di ingresso del cluster.
- **etcd**: è un database distribuito key-value altamente affidabile dove vengono salvate le configurazioni del cluster. Quando si da un comando al API Server per cambiare lo stato, il cambio di stato viene salvato dentro etcd. Viene consultato da API Server quando si vogliono recuperare informazioni del cluster
- **scheduler**: si occupa di scegliere su quale nodo assegnare i pod sulla base di vincoli e risorse. I vincoli pososno essere di Risorse (CPU, RAM), Affinity/Anti-affinity, Taints/Tolerations, Priority
- **Cloud-control-manager**: (opzionale) interagisce col cloud provider su cui è installato (AWS, GCP, Azure). Per esempio, creare un nuovo nodo scatena la creazione di una nuova VM nel cloud provider

Esempio di interazione:

- Tramite il comando `kubectl apply -f <file>` inviamo al API-Server il nostro `yaml` in formato Desired State Configuration le istruzioni in cui descriviamo lo stato che vogliamo raggiungere, ma non in che modo (quello lo farà in autonomia il cluster)
- L'API-Server valida il comando e poi salva il nuovo stato sul etcd
- L'API-server indicherà allo scheduler la necessità eseguire nuovi pod
- Lo scheduler valuterà dove e come eseguire i pod, su quali nodi e se è necessario creare nuovi nodi
- Su ogni nodo scelto dallo scheduler, il kubelet del nodo si occuperà di verificare l'esecuzione effettiva dei pod richiesti

## Node

Un nodo è sostanzialmente una macchina (fisica o virtuale) che esegue i container tramite i Pod. Anche chiamato Nodo Worker perchè si occupa di eseguire container. I container non sono mai maneggiati direttamente, ma solo attraverso i pod. Viene gestito dal Control Plane che decide cosa far girare su un certo nodo

- Kubelet: agent/deamon che gira sul singolo nodo e riceve le istruzioni dal Control Plane (attraverso API Server) e gestisce i pod sul nodo. Controlla che lo stato dei container sia attivo e funzionante e riporta lo stato del nodo al Control Plane
- Container runtime: esegue i veri e propri container (come Docker che è quello di default, anche Containerd è molto usato)
- Kube-proxy: gestisce le regole di rete all'interno del nodo, permettendo ai pod di comunicare tra loro e con l'esterno. Bilancia il traffico tra i pod.

## Namespace

Il namespace in kubernets è un modo per organizzare e isolare le risorse in gruppi logici. Paragonabile ad una cartella virtuale in cui metto le mie risorse. Si usano per isolare le risporse per team, ambiente, scope applicativi.

Inoltre puoi usare i namespace per creare:

- **Role**: quindi tramite il `RBAC` creare ruoli definiti a livello di namespace che si possono assegnare a User/Group/ServiceAccount che possono accedere alle risorse di quel namespace
- **Limiti di risorse**: definire dei `ResourceQuota` che assegnano dei limiti massimi di CPU/Memory/Pod in un certo Namespace

Di default esistono già 4 namespace:

- **default**: dove finiscono le risorse quando non definisci un namespace specifico. Normalmente non si usa, se non per test veloci e temporanei
- **kube-system**: contiene componenti interni di kubernetes del Control Plane, DNS, altri plugin di kubernetes. Viene gestito dal Control Plane stesso e non si dovrebbe usare ne modificare
- **kube-public**: componenti leggibili da tutti, anche da utenti non autenticati, per condividere configurazioni pubbliche. Raramente utilizzato in ambienti reali
- **kube-node-lease**: contiene gli oggetti `Lease` presenti nei nodi che vengono usati dal `kubelet` del nodo per effettuare heartbeat col `Control Plane` e monitorare lo stato per capire se un nodo è disponibile e funzionte

I namespace si possono chiedere da riga di comando o da manifest yaml:

```shell
kubectl create namespace my-namespase
```

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: my-namaspace
```

Utilizzando `kubens` si può definire il namaspace in uso quando utilizzi i comandi `kubectl` per accedere alle risorse. Se non si usa `kubens`, il comando sarebbe

```shell
kubectl config set-context --current --namespace=my-namespace
```

altrimenti puoi mettere l'option `-n my-namespace` per accedere ad uno specifico namespace indipendentemente da quello in uso oppure `-A` o `--all-namespaces` per accedere alle risorse di tutti i namespaces.

## Workflows

### Pod

I pod sono l'elemento più piccolo che si può far girare su un cluster per eseguire dei container. Un pod può contenere uno o più container; spesso un pod ha un solo container, ma ci sono casi in cui ci sono container accessori a quello principale all'interno dello stesso pod.
All'interno di un nodo, ogni pod ha:

- un suo IP e accesso di rete tramite porte
- Accesso allo storage (Volume, configmap)
- CPU
- RAM

I pod possono essere creati tramite deploy di file yaml, ma si possono anche eseguire in maniera più semplice e diretta indicando un'immagine. Questa modalità raramente si utilizza, ma questo è il comando:

```shell
# Indica di creare un pod con nome "nginx-pod" utilizzando l'immagine `nginx` e evitare che si riavvii automaticamente quando si spegne
kubectl run nginx-pod --image=nginx --restart=Never
```

Invece per ottenere il relativo yaml da quel pod (anche senza eseguirlo), si può usare il seguente comando

```shell
# --dry-run=client non esegue effettivamente il comando ma lo simula, -o yaml restituisce in output il risultato in formato yaml
kubectl run nginx-pod --image=nginx --restart=Never --dry-run=client -o yaml
```

Ottenuto l'output e ripulendolo un po, si può avere un file yaml (chiamandolo per esempio `nginx-pod.yaml`) che si può deployare:

```shell
kubectl apply -f nginx-pod.yaml
```

Tramite il comand delete si possono cancellare i pod

```shell
# delete pod <pod_name>
kubectl delete pod nginx-pod
# delete di tutte le risorse dentro il file yaml
kubectl delete -f nginx-pod.yaml
```

#### Port-Forwarding

Il singolo pod non è raggiungibile dall'esterno perchè è isolato, analogamento come accade per i container su Docker. Per cui si deve esporre una porta dalla rete del pod alla rete locale e questo si fa attraverso il comando `port-forward`. Si utilizza il seguente pattern:

- `kubectl port-forward <nome_pod> <porta_locale>:<porta_pod>`
  - `<porta_locale>` è la porta che uso io dalla mia rete locale per accedere al pod
  - `<porta_pod>` è la porta che il container sul pod utilizza per la sua applicazione

```shell
# comando port-forward <nome_pod> <porta_locale>:<porta_pod> dove nginx lavora sul pod utilizzando la porta 80, mentre noi vogliamo accedere tramite http://localhost:8080
kubectl port-forward nginx-pod 8080:80
```

### Deployment

Deployment è un oggetto più complesso rispetto al singolo pod per gestire una applicazione e i relativi pod, gestendo il ciclo di vita e il numero di istanze. Si occupa di applicazioni **stateless** con aggiornamenti frequenti (WebApp, API, microservizi), dove i pod sono intercambiabili. Suppota il rolling update e rollback.
Per esempio il deployment può definire il numero di istanze della mia applicazione, gestendo quello che succede se una di queste istante crasha. Le istanze sono chiamate `replica` ed incrementare il numero di repliche si chiama operazione di `scale`.

Si può creare un deployment manualmente in maniera analoga a quello che si fa con la creazione del pod, ma questa volta si da il nome al deployment e quest'ultimo poi si occuperà di creare il relativo pod:

```shell
# Indica di creare un deplyment con nome "nginx-pod" utilizzando l'immagine `nginx`, lui si occuperà di creare a sua volta 1 pod con un container per quell'immagine
kubectl create deployment nginx-deployment --image=nginx
# Si aumentano le repliche del deployment a 3, in questo modo devono essere sempre presenti 3 pod in esecuzione. Se cancelli uno di questi 3 pod, automaticamente ne verrà creato un altro a sostituirlo
kubectl scale deployment nginx-deployment --replicas=3
# Si diminuiscono le repliche del deployment a 1, i pod vengono cancellati laciandone solamente uno attivo
kubectl scale deployment nginx-deployment --replicas=1
# Si cancella il deployment e quindi si cancellano anche i relativi pod
kubectl delete deployment nginx-deployment
```

Caratteristiche del deployment:

- Si appoggia al ReplicaSet per gestire i pod
- I pod sono intercambiabili e vengono creati e terminati in parallelo
- Si può utilizzare un PersistentVolumeClaim condiviso tra tutti i pod

#### ReplicaSet

I `Deployment` non gestiscono direttamente i pod, ma passano da un componente interno. Per ogni `Deployment` viene creato un `ReplicaSet` che si occupa di gestire le regole per gestire i pod/replica. Si potrebbero anche creare direttamente le ReplicaSet, ma non di fa mai nella pratica perchè il Deployment è la sovrastruttura che gestisce al meglio le modifiche e gli aggiornamenti/rollback dell'applicazione. Le regole scritte nel file `yaml` del Deployment a livello del primo `spec` servono per definire il ReplicaSet.

Nel nostro caso, il Deployment ha generato questi output:

```shell
kubectl get all
NAME                                   READY   STATUS    RESTARTS   AGE
pod/nginx-deployment-747c6d555-8s544   1/1     Running   0          124m

NAME                    TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)                      AGE
service/nginx-service   LoadBalancer   10.101.152.129   127.0.0.1     80:30285/TCP,443:32755/TCP   124m

NAME                               READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/nginx-deployment   1/1     1            1           124m

NAME                                         DESIRED   CURRENT   READY   AGE
replicaset.apps/nginx-deployment-747c6d555   1         1         1       124m
```

#### Strategy/Rollout

Ogni volta che fai `kubectl apply` di uno yaml, questo va ad aggiornare lo stato di quella risorsa. Questo potrebbe causare il riavvio dei pod tramite la ricreazione di un nuovo ReplicaSet. Per evitare che l'applicazione non sia raggiungibile, si può fare un "RollingUpdate", cioè i pod vengono riavviati secondo delle regole in modo che non si abbia discontinuità. Questa è chiamata **Strategy** del deployment.
Quando aggiorni un deployment nella sezione `spec.template`, stai creando un nuovo ReplicaSet e quindi un riavvio dei pod. Il vecchio ReplicaSet non viene cancellato, ma viene impostato a zero ed è mantenuto per avere una history dei deployment revision (di default 10). Cancellare questi vecchi ReplicaSet o diminuire il numero di quelli che vuoi mantenere nell'history fa perdere la possibilità di fare rollout per quella revision.

```shell
# Permette di visualizzare l'history
kubectl rollout history deployment nginx-deployment
# Visualizza il pod template della revision=1
kubectl rollout history deployment nginx-deployment --revision=1
# Rollback ad una versione specifica
kubectl rollout undo deployment nginx-deployment --to-revision=1
```

Il rollback sostanzialmente crea un nuovo ReplicaSet con le regole della revision scelta (non riattiva il vecchio ReplicaSet) e scala a zero il ReplicaSet in corso.

### StatefulSet

Simile a `Deployment` ma per applicazioni che conservano lo stato (Database, Broker). Ogni pod ha un nome stabile e uno storage dedicato. Supporta lo scaling ordinato e il DNS persistente.

Caratteristiche:

- I pod vengono avviati in ordine crescente e terminati in ordine decrescente, questo permette anche di prendere decisioni su cosa fare prima o dopo l'avvio di tutti
- I pod hanno sempre lo stesso nome e vengono dinamicamente associati allo stesso PersistentVolume senza bisogno di generarli manualmente, utilizzando il `volumeClaimTemplates`
- Si può comunque fare il Rolling Update
- Si utilizzano Service Headless per permettere ai pod di comunicare tra loro, in modo che ogni pod abbia un DNS persistente dato dalla composizione dei nomi di vari componenti. Questo permette di configurare l'applicazione per comunicare tra i nodi direttamente (come nel caso del database distribuito)

Nel caso di esempio di `mongo-statefulset.yaml` è stato fatto un `StatefulSet` con 3 repliche di mongodb e un `Service` headless. Alla fine dell'avvio del terzo pod si esegue un comando che inizializza il "ReplicaSet" di mongo che mette in comunicazione i 3 nodi. Questa configurazione contiene il puntamento tramite DNS persistente ad ognuno dei 3 nodi.
Una volta avviato applicato il file si può verificare che tutto funziona tramite il comando:

```shell
kubectl exec -it mongo-sfs-2 -n my-namaspace -- mongosh
```

### DaemonSet

Utile quando si vuole eseguire un pod su **ogni nodo** del cluster (Logging, Monitoring). Il pod sul nodo è come un agent che agisce sul nodo per una applicazione, come fa per esempio Prometheus per monitorare lo stato del cluster cl suo Prometheus Node Exporter.

### Job

Ha lo scopo di eseguire un singolo task fino al compimento, senza dover rimanere perennemente running (Migrazione DB, elaborazioni batch). Può essere eseguito in parallelo o sequenzialmente.

### CronJob

Analogo al Job ma con una schedulazione regolare dell'esecuzione di quel task (Backup, Report, Sincronizzazioni)

## Operator (Custom Workload)

Workload personalizzati per app complesse

## Service

I service sono dei componenti che permettono di configurare delle regole di networking e di esporre una applicazione all'esterno del cluster, analogamente al port-forward ma in maniera più strutturata, o all'interno del cluster verso altri pod.

- Load Balancer

## Meccanismi di scheduling

- Labels e NodeScheduler
- Taints & Tolerantions
- Affinity/Anti-affinity
- Resource Requests & Limits
- Priority & Preemption
- Topology Spread Constraints
- PodDisruptionBudget (PDB)

## Configurazioni di sicurezza

- NetworkPolicy
- RBAC
- Service Mesh

https://www.youtube.com/watch?v=5B77Rm9kudI&list=PLU2FPKLp7ojIeEueIrjvL4d0zWw_NwWKH&index=2
