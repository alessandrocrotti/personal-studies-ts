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
  - [Pod](#pod)
    - [Port-Forwarding](#port-forwarding)
  - [Custom Resource Definition (CRD)](#custom-resource-definition-crd)
  - [Controller](#controller)
    - [Deployment](#deployment)
      - [ReplicaSet](#replicaset)
      - [Strategy/Rollout](#strategyrollout)
    - [StatefulSet](#statefulset)
    - [DaemonSet](#daemonset)
    - [Job](#job)
    - [CronJob](#cronjob)
  - [Operator](#operator)
  - [Network](#network)
    - [Service](#service)
    - [Endpoint](#endpoint)
    - [Ingress](#ingress)
      - [Cert-Manager](#cert-manager)
  - [Storage](#storage)
    - [Storage Class](#storage-class)
      - [Configurazione nel minikube](#configurazione-nel-minikube)
    - [Persistent Volume Claim](#persistent-volume-claim)
    - [Persistent Volume](#persistent-volume)
  - [Configuration](#configuration)
    - [ConfigMap](#configmap)
    - [Secret](#secret)
  - [Meccanismi di scheduling](#meccanismi-di-scheduling)
    - [NodeName](#nodename)
    - [Label a NodeSelector](#label-a-nodeselector)
    - [Node Affinity](#node-affinity)
    - [Pod Affinity/Anti-Affinity](#pod-affinityanti-affinity)
    - [Taints \& Tolerantions](#taints--tolerantions)
    - [Resource Requests \& Limits](#resource-requests--limits)
      - [Autoscaling](#autoscaling)
    - [Priority \& Preemption](#priority--preemption)
    - [Topology Spread Constraints](#topology-spread-constraints)
    - [PodDisruptionBudget (PDB)](#poddisruptionbudget-pdb)
  - [Configurazioni di sicurezza](#configurazioni-di-sicurezza)
    - [NetworkPolicy](#networkpolicy)
    - [Autenticazione e Autorizzazione](#autenticazione-e-autorizzazione)
      - [Creare un nuovo utente su minikube](#creare-un-nuovo-utente-su-minikube)
      - [Service Account](#service-account)
    - [Service Mesh](#service-mesh)
  - [Helm](#helm)

## Descrizione

K8S è un orchestratore di container, composto un cluster di nodi che contengono pod che a loro volta contengono container.

## Cluster locali

### Minikube

Per poter sperimentare localmente con K8S, si può installare tramite `choco`, Minikube che rappresenta una istanza di kubernate eseguita in locale con un solo nodo. Installando `kubectl` si può interagire col cluster ed eseguire i comandi come un vero cluster kubernetes.

Dopo aver avviato Docker Desktop, puoi avviare il minikube utilizzando il comando: `minikube start`

Se usi dei service di tipo Load Balancer, devi lanciare il seguente comando e lasciarlo in esecuzione sulla shell: `minikube tunnel`. Questo permette di generare l'external ip che sarà comunque per il minikube 127.0.0.1 (localhost)

### Docker Desktop - Opzione Kubernetes

Nella sezione Settings > Kubernetes si può attivare Kubernetes come servizio aggiuntivo che permette di creare un cluster Kubernetes locale.

## CLI

Ci sono diverse cli importanti da usare (e installabili tramite Choco):

- `kubectx`: permette di gestire facilmente l'accesso a cluster diversi. Puoi definire qual è l'attuale in utilizzo e passare ad un altro
- `kubens`: permette di definire qual è il namespace in utilizzo attualmente e cambiarlo
- `kubectl`: esegue tutti i comandi verso il cluster in utilizzo e se non definisci il namespace, utilizza quello definito come in uso

## Control Plane

Layer di controllo dell'intero cluster, ed è composto da nodi master perchè ognuno gestisce il cluster con caratteristiche speciali e non esegue i container.
I nodi master insieme creano un Control Plane distribuito ed ogni nodo master è composto da vari componenti:

- **Control Manager**: è come se fosse un loop infinito che controlla costantemente che lo stato del cluster sia corretto, se non lo fosse prende decisioni correttive per ripristinare lo stato voluto
- **API Server**: è il gateway del cluster che espone le API REST con cui si comunica dall'esterno verso l'interno (per esempio facendo comandi `kubectl` si comunuca con questo componente). Anche i componenti interni lo usano, come etcd, da cui legge e scrive lo stato. Punto di ingresso del cluster.
- **etcd**: è un database distribuito key-value altamente affidabile dove vengono salvate le configurazioni del cluster. Quando si da un comando al API Server per cambiare lo stato, il cambio di stato viene salvato dentro etcd. Viene consultato da API Server quando si vogliono recuperare informazioni del cluster
- **scheduler**: si occupa di scegliere su quale nodo assegnare i pod sulla base di vincoli e risorse. I vincoli possono essere di Risorse (CPU, RAM), Affinity/Anti-affinity, Taints/Tolerations, Priority
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

Il namespace in kubernets è un modo per organizzare e isolare le risorse in gruppi logici. Paragonabile ad una cartella virtuale in cui metto le mie risorse. Si usano per isolare le risorse per team, ambiente, scope applicativi.

Inoltre puoi usare i namespace per creare:

- **Role**: quindi tramite il `RBAC` creare ruoli definiti a livello di namespace che si possono assegnare a User/Group/ServiceAccount che possono accedere alle risorse di quel namespace
- **Limiti di risorse**: definire dei `ResourceQuota` che assegnano dei limiti massimi di CPU/Memory/Pod in un certo Namespace

Di default esistono già 4 namespace:

- **default**: dove finiscono le risorse quando non definisci un namespace specifico. Normalmente non si usa, se non per test veloci e temporanei
- **kube-system**: contiene componenti interni di kubernetes del Control Plane, DNS, altri plugin di kubernetes. Viene gestito dal Control Plane stesso e non si dovrebbe usare ne modificare
- **kube-public**: componenti leggibili da tutti, anche da utenti non autenticati, per condividere configurazioni pubbliche. Raramente utilizzato in ambienti reali
- **kube-node-lease**: contiene gli oggetti `Lease` presenti nei nodi che vengono usati dal `kubelet` del nodo per effettuare heartbeat col `Control Plane` e monitorare lo stato per capire se un nodo è disponibile e funzionte

I namespace si possono creare da riga di comando o da manifest yaml:

```shell
kubectl create namespace my-namespase
```

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: my-namespace
```

Utilizzando `kubens` si può definire il namaspace in uso quando utilizzi i comandi `kubectl` per accedere alle risorse. Se non si usa `kubens`, il comando sarebbe

```shell
kubectl config set-context --current --namespace=my-namespace
```

altrimenti puoi mettere l'option `-n my-namespace` per accedere ad uno specifico namespace indipendentemente da quello in uso oppure `-A` o `--all-namespaces` per accedere alle risorse di tutti i namespaces.

## Pod

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

### Port-Forwarding

Il singolo pod non è raggiungibile dall'esterno perchè è isolato, analogamente ai container su Docker. Per cui si deve esporre una porta dalla rete del pod alla rete locale e questo si fa attraverso il comando `port-forward`. Si utilizza il seguente pattern:

- `kubectl port-forward <nome_pod> <porta_locale>:<porta_pod>`
  - `<porta_locale>` è la porta che uso io dalla mia rete locale per accedere al pod
  - `<porta_pod>` è la porta che il container sul pod utilizza per la sua applicazione

```shell
# comando port-forward <nome_pod> <porta_locale>:<porta_pod> dove nginx lavora sul pod utilizzando la porta 80,
# mentre noi vogliamo accedere tramite http://localhost:8080
kubectl port-forward nginx-pod 8080:80
```

## Custom Resource Definition (CRD)

Oltre alle risorse standard, su kubernetes si possono creare delle risorse custom. Una CRD è la definizione di un nuovo tipo di risorsa su Kubernetes. Questo tipo di risorsa si aggiunge a quelle standard e può essere usato nel parametro "kind" degli YAML. Questa risorsa è cluster-wide e la si può vedere tra le configurazioni del cluster. Questo ti permette di estendere Kubernetes con nuove risorse.

Quindi una **Custom Resource (CR)** è una istanza concreta di una CRD, come quando lancio lo YAML di un Pod con `kind: Pod`. Questa istanza (CR) invece può essere creata in un namespace o cluster-wide, al contrario della CRD.

Solitamente queste vengono creati tramite tool che autogenerano il codice YAML, come `kubebuilder`.

## Controller

I controller sono dei componenti di K8S che ricevuto un file manifest YAML, si attivano e rimangono in costante controllo dello stato del cluster ed intervengono per modificarlo e renderlo come il file YAML richiede. Creano un loop costante dove controllano lo stato e agiscono per correggere le differenze.

### Deployment

Deployment è un oggetto più complesso rispetto al singolo pod per gestire una applicazione e i relativi pod, gestendo il ciclo di vita e il numero di istanze. Si occupa di applicazioni **stateless** con aggiornamenti frequenti (WebApp, API, microservizi), dove i pod sono intercambiabili. Suppota il rolling update e rollback.
Per esempio il deployment può definire il numero di istanze della mia applicazione, gestendo quello che succede se una di queste istanze crasha. Le istanze sono chiamate `replica` ed incrementare il numero di repliche si chiama operazione di `scale`.

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
kubectl exec -it mongo-sfs-2 -n my-namespace -- mongosh
```

### DaemonSet

Utile quando si vuole eseguire un pod su **ogni nodo** del cluster (Logging, Monitoring). Il pod sul nodo è come un agent che agisce sul nodo per una applicazione, come fa per esempio Fluend o Prometheus, per monitorare lo stato del cluster col suo Prometheus Node Exporter. Questo significa che quando si aggiunge un nuovo nodo al cluster, automaticamente il DaemonSet crea un pod su quel nodo.

Caratteristiche:

- Non si scala, è sempre un pod per nodo
- Si possono usare i meccanismi di scheduling come nodeSelector, affinity, tolerations per controllare su quali nodi viene creato il pod
- Supporta il rolling updates

Un esempio può essere l'utilizzo di `Fluentd`, un applicazione che monitora i log delle applicazioni installate e li invia ad altre applicazioni.

### Job

Ha lo scopo di eseguire un singolo task fino al compimento, senza dover rimanere perennemente running (Migrazione DB, elaborazioni batch). Può essere eseguito in parallelo o sequenzialmente:

- Crea uno o più Pod temporanei.
- Esegue un compito specifico fino al completamento
- Si assicura che il numero desiderato di esecuzioni abbia successo
- Può rilanciare automaticamente i pod falliti

Ci sono alcune configurazioni interessanti:

- **completions**: quante volte esegue il job, cioè quanti pod esegue
  - **default**: 1. Dopo una esecuzione riuscita si considera il job completato
- **parallelism**: quanti pod in parallelo può eseguire
  - **default**: 1. Si esegue un pod alla volta
- **backoffLimit**: se un pod fallisce, quante volte ritenta di rilanciare quel pod prima di considerarlo effettivamente fallito
  - **default**: 6. Si ritenta fino a 6 volte
- **ttlSecondsAfterFinished**: dopo quanti secondi dalla fine del job, il job viene cancellato e quindi i pod creati dal job vengono rimossi
  - **default**: nessuno. Il job rimane nel cluster finchè non è eliminato manualmente
- **activeDeadlineSeconds**: entro quanti secondi il job deve completarsi altrimenti è considerato fallito
  - **default**: nessuno. Non ci sono limiti di tempo per l'esecuzione dek job
- **restartPolicy**: Never : i pod non vengono riavviati in caso di errore, lasci il compito al job e alla configurazione backoffLimit
  - **default**: Never

### CronJob

Si tratta di una struttura che esegue dei Job con una schedulazione regolare. Il Job a sua volta esegue quel task come farebbe se fosse stato configurato come Job singolo. Utile in contesti come di azioni ripetitive (Backup, Report, Sincronizzazioni).

Ci sono alcune configurazioni interessanti:

- **schedule**: quando viene eseguito secondo il pattern "min ora giorno mese giorno-settimana"
  - **default**: è obbligatorio definirlo, non c'è un default
- **timeZone**: fuso orario per intepretare lo schedule
  - **default**: se non definito usa il fuso orario del kube-control-manager
- **startingDeadlineSeconds**: tempo massimo di ritardo accettabile prima di lanciare il job rispetto allo schedule. Se si supera questo tempo, quel lancio viene saltato. Può ritardare per vari motivi, come la sovrapposizione con altri, mancanza di risorse, problemi al cluster o all'immagine
  - **default**: null. Rimane sempre in attesa fino a che può essere lanciato
- **concurrencyPolicy**: gestione delle esecuzioni sovrapposte dello stesso CronJob, se possono oppure no essere lanciati sovrapposti 2 job dello stesso CronJob. Rispetto agli altri CronJob è sempre indipendente e può andare in parallelo
  - **default**: Allow. Più Job dello stesso CronJob possono essere eseguiti insieme
- **suspend**: se true il job viene sospeso e allo schedule non viene eseguito
  - **default**: false
- **successfulJobsHistoryLimit**: quanti job completati vengono mantenuti nel cluster
  - **default**: 3
- **failedJobsHistoryLimit**: quanti job falliti vengono mantenuti nel cluster
  - **default**: 1
- **jobTemplate**: come il template di un job, dove sono definite le caratteristiche dell'esecuzione del pod
  - **default**: è obbligatorio definirlo, non c'è un default
- **restartPolicy**: OnFailure : i pod vengono riavviati in caso di errore
  - **default**: Never

## Operator

Sono dei particolari controller personalizzati che estendono le API di K8S tramite le Custom Resource Definition (**CRD**). Gestisce il ciclo di vita delle risorse e non si occupa solo di attivare e rimuovere i pod, a volte servono per fare backup o configurazioni.
Gli operator servono per gestire le applicazioni e i loro componenti come un singolo oggetto anzichè un insieme di oggetti primitivi. In questo modo puoi creare regole e comportamenti specifici per quell'applicazione. Quindi sono sostanzialmente dei controller per il packaging, la gestione e il deploying delle applicazioni su Kubernetes.

Tramite le **Custom Resource (CR)** si definisce lo stato voluto di una specifica applicazione. Tramite le **Custom Resource Definition (CDR)** si determina lo stato voluto che l'operator deve raggiungere.

Solitamente gli operator vengono creati tramite tool che autogenerano il codice YAML, come `kubebuilder`.

## Network

### Service

I service sono dei componenti che permettono di configurare delle regole di networking e di esporre una applicazione all'esterno del cluster, analogamente al port-forward ma in maniera più strutturata, o all'interno del cluster verso altri pod. Un service più valere per un insieme di pod ed utilizzando il `selector` ti permette di definire su quali pod agisce il service. Kubernetes agisce internamente come un bilanciatore che, di default, assegna la chiamata al pod più scarico, ma ci sono anche configurazioni in cui si possono forzare che le chiamate che arrivano dallo stesso IP raggiungano lo stesso pod. Solitamente per le applicazione stateless questo non serve e va bene la logica Round Robin di assegnamento di default al pod più scarico.

Il pattern del DNS di un service è:

- `<service-name>.<namespace>.svc.cluster.local` quindi si può accedere internamente tramite `http://backend-service.my-app.svc.cluster.local`
- se il pod che chiama il service è nello stesso namespace si può usare solo il `<service-name>` quindi `http://backend-service`
- se il pod che chiama il service è in un namespase diverso, si deve usare almeno `<service-name>.<namespace>` quindi `http://backend-service.my-app`

Questi sono i vari service che si usano:

- **ClusterIP**: service di default se non viene definito un `type` nella definizione del service. Si usa per l'accesso tra pod interni dello stesso cluster, come un backend che deve essere raggiungibile dal frontend
  - **Headless Service**: è un ClusterIP che non assegna alcun IP al service ma direttamente ai singoli pod tramite la configurazione `clusterIP: None`. Questi IP sono poi gestiti anche tramite un DNS che permette di puntare direttamente ai pod. Utile per gli StatefulSet dove il bilanciamento è gestito dall'applicazione stessa (Vedi esempio `controller/mongo-statefulset.yaml`)
- **Node Port**: serve per esporre all'esterno una porta statica su ogni nodo, senza utilizzare il Load Balancer. Solitamente usato per accedere dall'esterno ad ambienti di DEV e TEST
  - Permette di accedere ai pod di uno specifico nodo tramite selector, esponendo una porta raggiungibile dall'esterno nella configurazione `nodePort` che deve essere tra 30000 e 32767.
- **Load Balancer**: richiede di aver installato il cluster su un cloud provider che supporta i bilanciatori e permette di esporre tramite un IP esterno l'applicazione, gestendo il traffico sui vari pod dell'applicazione. Usato per le applicazioni di produzione che sono esposte su internet
  - Nonostante funzioni solo sul cloud provider, Minikube riesce a simulare un load balancer per gestire questo tipo di service. Per poterlo fare si deve lanciare su una shell il comando `minikube tunnel` in modo da poter assegnare l'external ip al service
- **External Name**: serve per mappare il nome di un servizio ad un DNS esterno, in modo da accedere a servizi esterni. In pratica puoi creare un alias del DNS esterno nel DNS interno del cluster col pattern del service, in modo che internamente puoi chiamare quel servizio esterno con il classico pattern di DNS interno. Non fa da proxy, è un semplice redirect. La `port` che si definisce in questo service è sia quella usata per contattare il service internamente al cluster dai pod, sia quella usata per contattare il DNS esterno tramite il redirect

Puoi vedere la lista dei service tramite il comando:

```shell
# shortname
kubectl get svc
# nome completo
kubectl get services
```

### Endpoint

è un oggetto di kubernetes che viene creato automaticamente tramite i `service` e permette di creare una lista di IP e Port dei pod che sono associati tramite i selector. Se per un service ho 3 pod, vedrò 3 endpoints coi relativi IP interni e dettagli.

Puoi vedere la lista dei endpoint tramite il comando:

```shell
# comando vecchio
kubectl get endpoints
# comando vecchio recuperando gli endpoint di uno specifico service
kubectl get endpoints "<nome-service>" -o wide
# comando più recente e più leggero, meglio usare questo
kubectl get endpointslice
# Gli endpointslice di uno specifico service
kubectl get endpointslice -l kubernetes.io/service-name="<mio-service-name>"
# Dettagli del endpointslice
kubectl describe endpointslice "endpointslice-name"
```

Essendo dei componenti automaticamente creati, ha senso controllarli quando:

- Un service è stato creato ma i pod non ricevono traffico. Potrebbe esserci un problema nel selector o un problema nell'esecuzione del service, per cui vale la pena eseguirlo nuovamente
- Puoi vedere quanti pod sono registrati come endpoint e verificare se sono tutti in salute (stato `Ready: true`)
- Se stai facendo un Rolling update o scaling, guardare gli endpoint ti permette di verificare la transizione
- Se stai facendo delle regole di Network Policies o Firewall, puoi verificare gli effettivi IP dei vari pod

### Ingress

L'ingress è un risorsa di kubernetes che permette di gestire il traffico HTTP/HTTPS in entrata tramite delle regole di configurazione. Questo routing del traffico permette di gestire come esporre tutte le proprie applicazioni nel cluster tramite un solo componente.

Richiede un Ingress controller come NGINX o Traefik. Questo è un componente attivo che legge le risorse Ingress e le implementa, gestendo routing, TLS, redirect, load balancing. Questo tipo di componente deve essere installato sul cluster, non è presente di default.

Quindi, l'ingress controller può essere unico per tutte le risorse Ingress. L'ingress controller è la porta di accesso al cluster e le Ingress sono le regole utilizzate per raggiungere ogni applicazione all'interno del cluster

Avendo l'Ingress Controller che è un componente interno che gestisce il traffico dall'esterno verso l'interno del cluster, questo si può andare a sostituire al service di tipo `load balancer`. Il service che servirà quindi per comunicare tra l'Ingress Controller e le applicazioni sarà di tipo `ClusterIP`.
Sostanzialmente:

- Usare il load balancer se hai solo una applicazione ed è una configurazione semplice
- Usare l'ingress controller se hai più applicazioni da gestire nel tuo cluster (più economico di un load balancer per applicazione) e vuoi automatizzare alcunce configurazioni come il TLS/HTTPS

Se si vogliono utilizzare i certificato SSL per le chiamate HTTPS, il modo migliore è quello di appoggiarsi al componento `Cert-Manager`

#### Cert-Manager

Si tratta di un componente che permette di gestire i certificati, la scadenza, il rinnovo tutto in maniera automatica. Si crea un `Issuer` o `ClusterIssuer` che gestisce il certificato e lo salva nelle secret, poi in combinazione con l'ingress, questo certificato viene utilizzato per le chiamate HTTPS/TLS.

L'issuer è sostanzalmente la configurazione di chi si occuperà di creare il certificato, ma non lo crea direttamente, anzi, l'issuer può essere utilizzato per diversi Ingress. Inoltre, utilizzando nell'ingress l'annotation `cert-manager.io/cluster-issuer: <nome-del-mio-issuer>` oppure `cert-manager.io/issuer: <nome-del-mio-issuer>`, Cert-Manager in automatico prenderà dalla configurazione di quell'ingress i valori di `tls.hosts` e `tls.secretName` e li userà per creare automaticamente il certificato, senza che tu debba scrivere il relativo yaml a mano.

Invece di usare l'Helm Repo che è il metodo tradizionale, per Cert-Manager consigliano di usare OCI Registry che è un registro standard per i package, anche quelli di Kubernetes. Questo non richiede di fare `add repo` e `update`, ma si può usare direttamente questo comando:

```shell
helm install cert-manager oci://quay.io/jetstack/charts/cert-manager --version v1.18.2 --namespace cert-manager --create-namespace --set crds.enabled=true
```

Cert-Manager permette inoltre di usare **Let's Encrypt** che ti permette di creare certificate SSL gratuitamente per domini pubblici.

## Storage

Il principio che guida gli storage è:

- Le storage class sono la definizione che kubernetes usa per poter generare un Persistent Volume. Quindi sono le regole per creare automaticamente un PV
- I pod (anche attraverso il relativo controller) hanno un `volume` che è una astrazione di uno storage montato. Qui non c'è un effettivo storage, ma solo l'associazione al punto del file system in cui è necessario avere una persistenza dei dati se il pod dovesse riavviarsi. A questo volume non si associa direttamente un Persistent Volume, ma un Persistent Volume Claim
- Il Persistent Volume Claim è un componente che gestisce la richiesta di un Persistent Volume. Qui ci sono le caratteristiche necessarie su cui K8S si baserà per creare il reale Persistent Volume, come il tipo di StorageClass, lo spazio necessario e l'access mode
- Tramite il Persistent Volume Claim, K8S crea il relativo Persistent Volume e lo associa al Persistent Volume Claim che a sua volta lo monta sul pod a cui è associato

Quello descritto è il processo automatico di creazione di PV, si possono anche creare PV e PVC manualmente, ma solitamente quello è l'approccio corretto.

### Storage Class

Definisce come creare un PersistentVolume per K8S in modo dinamico. Si possono creare delle storage class personalizzate oppure utilizzare quelle di default e solitamente ce n'è una marcata come "default".

Le configurazioni più importanti sono:

- **provisioner**: Specifica il CSI driver (plugin che collega Kubernetes ad uno storage estero di un Cloud). Dipende da dov'è installato il cluster
- **parameters**: dipendono dal CSI driver scelto
- **reclaimPolicy**: gestisce cosa accade quando il PVC viene cancellato
  - **Delete**: il volume viene eliminato
  - **Retain**: il volume viene conservato, utile per backup o analisi
- **volumeBindingMode**: gestisce quando il volume viene effettivamente creato
  - **Immedate**: il volume viene creato suvito
  - **WaitForFirstConsumer**: viene creato quanto il pod lo usa (utile in contesti in cui potrebbe non essere mai utilizzato anche se montato)
- **allowVolumeExpansion**: se `true`, il volume può aumentare di dimensione oltre la configurazione iniziale. Attenzione che il PV si può sempre espandere ma non si può ridurre facilmente, servono procedure complesse

#### Configurazione nel minikube

Esiste uno storage di default, ma su minikube puoi attivare anche l'hostpath CSI usando questi comandi:

```shell
minikube addons enable volumesnapshots
minikube addons enable csi-hostpath-driver
```

In questo modo si può usare `provisioner: hostpath.csi.k8s.io` altrimenti si deve usare `provisioner: k8s.io/minikube-hostpath`

### Persistent Volume Claim

Questo componente ha lo scopo di richiedere dello storage con certe caratteristiche per poterlo montare su un Pod. Infatti un PVC da solo non fa nulla, potrebbe generare il relativo PV se la configurazione della StorageClass è `volumeBindingMode: Immediate`, ma il PV creato non sarebbe utilizzato da nessuno se quel PVC non fosse utilizzato da un Pod.

Le configurazioni più importanti sono:

- **accessMode**: come si accede allo storage
  - **ReadWriteOnce**: montabile su un solo NODO in lettura e scrittura
  - **ReadOnlyMany**: montabile da più NODI in sola lettura
  - **ReadWriteMany**: montabile di più NODI in lettura e scrittura
- **resources.requests.storage**: quantità di spazio richiesto
- **storageClassName**: la storage class usata per creare il volume

All'interno di un pod si può mettere l'accesso al PVC utilizzando

- **volumes**: per indicare quali PVC sono utilizzati dal Pod e dichiarandone un nome nel contesto del POD
- **volumeMounts**: associa un PVC, utilizzando il nome precedentemente dichiarato, ad un path del file system dentro al pod

### Persistent Volume

Si tratta di un reale storage all'interno del cluster di kubernetes. Può essere fatto in vari modi:

- Disco fisico o virtuale
- Un file system NFS
- Un volume cloud
- Un path locale (come nel caso di minikube)

Importante è che un PV può persistere rispetto ai pod: anche se i pod vengono riavviati o cancellati, il PV rimane persistente con i dati al suo interno, in modo che i pod li possano recuperare.

Solitamente i PV vengono creati dinamicamente, ma possono anche esere creati manualmente tramite manifest YAML. I PV creati manualmente, cioè statici, sono raramente utilizzati e solo per ambienti e situazioni particolari, va sempre preferita una configurazione dinamica.

## Configuration

### ConfigMap

Permette di salvare dati di configurazione che siano considerati NON SENSIBILI. Può anche contenere file, variabili d'ambiente o comandi ed è utile per separare la configurazione dell'applicazione dal suo codice. Il type di default è `generic` e va bene nella maggior parte dei casi, ma ci sono anche altri type, come `docker-registry` per le credenziali di docker privati o `tls` per i certificati SSL/TLS.

Possono essere create da riga di comando oppure da manifest YAML: se si vogliono creare classiche coppie chiave/valore allora è meglio lo YAML, ma se si vuole caricare un file/directory in una ConfigMap è meglio da riga di comando (anche se si potrebbe copiare il contenuto del file dentro il manifest YAML, ma risulterebbe scomodo da mantenere).

```shell
# Il file script.js sara dentro la CM "js-config" con chiave "script.js" e valore il contenuto del file
kubectl create configmap js-config --from-file=script.js
# Tutti i file dentro la cartella verranno messi come chiave/valore della CM "js-config" con lo stesso pattern <nome-file>/<contenuto-file>
kubectl create configmap js-config --from-file=./scripts/
```

Hanno il limite di massimo **1 Mib** per ConfigMap, se si necessita di montare file più grandi si deve usare i PersistentVolume. Volendo le si possono creare con il valore `immutable: true` per evitare che possano essere modificate.

Le ConfigMap possono essere montate sui pod per essere utilizzate o montate su delle CRD di specifici Operator.

### Secret

Serve per salvare i dati SENSIBILI, come password, token, certificati. I dati nelle secret sono codificati in **base64** e possono essere criptati a livello di storage. Questo significa che se crei una secret via YAML, devi mettere il valore già codificato tramite base64, invece se vuoi creare una secret via riga di comando puoi farlo così:

```shell
kubectl create secret generic example-secret --from-literal=username=admin --from-literal=password=s3cr3t
```

Essendo valori segreti, metterli in un file YAML non è consigliabile, quindi è solitamente preferibile usare la riga di comando.

Si possono usare come variabili d'ambiente usando il `env.#.valueFrom.secretKeyRef` o come volume dentro `volumes.#.secret.secretName`

## Meccanismi di scheduling

Lo scheduling è il meccanismo per cui kubernetes associa un pod ad un nodo tramite il `kube-scheduler`. Ovviamente cerca i pod non assegnati, i nodi disponibili e poi esegue il binding per assegnarli.

Il processo ha 2 fasi principali:

- **Filtering**: esclude i nodi che non soddisfano i requisiti del pod
- **Scoring**: assegna un punteggio ai nodi rimanenti per poi scegliere il nodo col punteggio più alto

### NodeName

Puoi assegnare direttamente in un pod il nome del nodo sul quale vuoi che quel pod giri, bypassando il kube-scheduler. Si usa per test o situazioni particolari.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  # Assegnazione diretta al nodo con name "node-1"
  nodeName: node-1
  containers:
    - name: nginx
      image: nginx
```

### Label a NodeSelector

I nodi posso avere delle label che servono per raggrupparli o distinguerli da altri. Sul pod si può indicare un `nodeSelector` con una label ed il suo valore che indica che questo pod deve essere assegnato ad un nodo che abbia quella label. Consente solamente match esatti e non regole complesse

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  nodeSelector:
    # Assegnazione ai soli nodi con label "disktype=ssd"
    disktype: ssd
  containers:
    - name: nginx
      image: nginx
```

### Node Affinity

Questa condizione è più avanzata del `nodeSelector`. Si basa sempre sulle label dei nodi, ma permette espressioni logiche e condizioni "required" o "preferred". Si definisce sul pod.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  affinity:
    # Definisce l'affinity a livello di nodo
    nodeAffinity:
      # Questo valore indica che la condizione è richiesta, mentre se fosse preferibile si deve usare "preferredDuringSchedulingIgnoredDuringExecution"
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
          - matchExpressions:
              - key: disktype
                # Gli operatori validi sono In, NotIn, Exists, DoesNotExist, Gt, Lt
                operator: In
                # Questo array di valori dipende dall'operatore, per In/NotIn deve essere definito, per Exists/DoesNotExist non deve essere definito, per Gt/Lt deve contenere un singolo elemento
                values:
                  - ssd
  containers:
    - name: nginx
      image: nginx
```

### Pod Affinity/Anti-Affinity

Analogo al Node Affinity, ma questa condizione permette di influenzare lo scheduling sulla base della presenza o assenza di altri pod su un nodo. Pod Affinity colloca un pod dove ce n'è già un altro affine, mentre Pod Anti-Affinity lo evita. Importante sottolineare che se ho un nodo senza alcun pod e ho una condizione di podAffinity con "requiredDuringSchedulingIgnoredDuringExecution", quel pod NON potrà essere schedulato su quel nodo perchè non è presente il pod affine.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  affinity:
    # Definisce l'affinity a livello di pod. Con "podAffinity" il pod viene creato dove esistono altri pod con label "app=frontend". Se fosse "podAntiAffinity" verrebbe evitato di creare il podo dove ne esistono altri con label "app=frontend"
    podAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        - labelSelector:
            matchExpressions:
              - key: app
                operator: In
                values:
                  - frontend
          # Proprietà specifica del podAffinity che indica che la regola di affinità tra pod è valida all'interno dello stesso nodo, se il valore fosse "topology.kubernetes.io/zone" la regola varrebbe per la stessa zona
          topologyKey: "kubernetes.io/hostname"
  containers:
    - name: nginx
      image: nginx
```

### Taints & Tolerantions

Questa è una condizione che serve ad impedire che certi pod vengano schedulati su certi nodi, con delle condizioni di esclusione. Lo scopo è quello di marcare dei nodi come se fossero esclusivi per certi pod: "non puoi usare questo nodo a meno che non hai una certa proprietà". Al contrario dell'affinity che ha il concetto inclusivo, questo ha un concetto esclusivo.
Ci sono due proprietà che hanno due obiettivi diversi e collaborano per ottenere il risultato:

- **Taint**: è una proprietà da mettere sul nodo ed è come una spacie di label con `<chiave>=<valore>:<effetto>`. Per esempio `dedicated=support:NoSchedule`, dove l'effetto si applica sempre al nodo, a meno che su un pod ci sia la Toleration per quella `<chiave>=<valore>`. Per la stessa chiave/valore si potrebbero avere sia l'effetto `NoSchedule` che `NoExecute`, ma sarebbe ridondante quindi è meglio evitarlo.
- L'effetto può essere:
  - **NoSchedule**: non viene schedulato alcun pod che non abbia il giusto valore di Toleration
  - **PreferNoSchedule**: lo schedule cercherà di non usare il nodo per i pod che non hanno il giusto valore di Toleration, ma non è un vincolo stretto che deve essere garantito
  - **NoExecute**: se esistono pod già in esecuzione che non rispettano il giusto valore di Toleration, vengono chiusi e non verranno schedulati nuovi pod sul nodo senza la corretta Toleration. Quindi è come NoSchedule ed inoltre chiude i pod che attualmente stanno girando
- **Toleration**: è una proprietà del pod che permette di evitare l'effetto del Taint presente su un certo nodo. Tramite delle regole di toleration si definiscono i tre valori `<chiave>=<valore>:<effetto>` che il pod può aggirare

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  # Questo pod può essere schedulato su un nodo marcato con Taint "dedicated=support:NoSchedule" al contrario degli altri pod che verrebbero esclusi dallo scheduling su nodi con quel Taint
  tolerations:
    - key: "dedicated"
      # Gli operator sono "Equal" a cui si deve mettere un valore oppure "Exists" dove il value non è necessario
      operator: "Equal"
      value: "support"
      # Effetto che si vuole aggirare tramite questa toleration, deve essere lo stesso presente nel Taint del nodo
      effect: "NoSchedule"
  containers:
    - name: nginx
      image: nginx
```

### Resource Requests & Limits

Ogni pod dovrebbe essere calibrato per avere un limite e una richiesta di risorse. Questa è una best practise per ogni pod, ma è anche una maniera implicita per indicare allo scheduler come può schedulare i pod rispetto ai nodi disponibili. Le risorse che vengono gestite sono sempre "memory" intesa come RAM del nodo e "cpu" inteso come core del nodo. Se non sono presenti le proprerties di resources, i pod potrebbero comportarsi in maniera incontrollata e consumare più risorse del dovuto, compromettendo il funzionamento di tutti gli altri pod su quel nodo.

- **Requests**: sono le risorse minime che servono per far girare il pod. Lo scheduler usa questa configurazione per capire se può combinare il pod che deve schedulare su un nodo con i pod che già girano su quel nodo. Importante sapere che non usa mai il consumo reale per fare questa valutazione, ma solo questa configurazione dichiarativa in Request: se la somma di request degli attuali pod più il nuovo pod è minore o uguale alle risorse del nodo, allora il pod può essere assegnato. Importante anche sapere che le risorse richieste non sono assegnate ad uso esclusivo del pod, il consumo effettivo potrebbe essere anche minore, lasciando risore effettive per altri
- **Limits**: queste sono le risorse massime che il pod può consumare. Non viene considerato per lo scheduling, ma serve solo per bilanciare il nodo e i suoi pod. Quando la CPU del pod supera il limit, Kubernetes rallenta il pod (throttling), mentre quando la memory del pod supera il limit, il pod viene ucciso (OOMKilled)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
    - name: nginx
      image: nginx
      resources:
        requests:
          memory: "64Mi"
          cpu: "250m"
        limits:
          memory: "128Mi"
          cpu: "500m"
```

#### Autoscaling

Quando le risorse scarseggiano e non si trovano nodi disponibili che soddisfano le condizioni di risorse necessarie, se il cluster è configurato su un Cloud Service, si può attivare l'autoscaling orizzontale, cioè automaticamente viene creato un nuovo nodo per poter assegnare il pod che è stato richiesto in quel momento. Questo è molto utile per automatizzare e minimizzare l'utilizzo di nodi, avendo in esecuzione solamente i nodi attivi effettivamente necessari.

### Priority & Preemption

Queste configurazioni permettono di dare una priorità ai pod che devono essere terminati quando le risorse disponibili non sono sufficienti durante lo scheduling: la richiesta di esecuzione di un pod con più alta priorità può forzare la chiusura di quelli con più bassa priorità. Al contrario, se in fase di esecuzione le risorse scarseggiano, i pod con bassa priorità non verranno terminati automaticamente. Questo perchè, come sempre in Kubernetes, le regole sono dichiarative e valgono solo al momento in cui vengono eseguite, non in seguito runtime.

Questo comportamento viene gestito tramite le `PriorityClass` che hanno un valore: più il valore è alto più la classe è "importante". Queste PriorityClass vengono assegnate ai Pod per creare questa scala di priorità. Ogni PriorityClass ha una "Preemption Policy" che è la logica con cui una classe con alta priorità forza la chiusura di pod con classi di bassa priorità per liberare risorse quando necessario.

I pod che non definiscono una priorityClass sono considerati a priorità 0, quindi la più bassa e possono sempre essere preemptied da pod con una priorità definita più alta. Si può creare una PriorityClass di default (`globalDefault: true`) per quelli che non l'hanno definita. Sulla PriorityClass si può anche mettere la configurazion `preemptionPolicy: Never` per evitare che di terminare i pod con minore priorità quando un pod con questa classe viene schedulato (invece di `preemptionPolicy: PreemptLowerPriority` che è quella di default).

```shell
# Lista delle priorityClass esistenti
kubectl get priorityClass
```

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: high-priority
value: 1000000
globalDefault: false
description: "Pod critici per il business"
---
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  priorityClassName: high-priority
  containers:
    - name: nginx
      image: nginx
      resources:
        requests:
          memory: "64Mi"
          cpu: "250m"
        limits:
          memory: "128Mi"
          cpu: "500m"
```

### Topology Spread Constraints

Si tratta di una configurazione che permette di regolare la distribuzione dei pod nei nodi in maniera più distribuita ed equilibrata. Puoi definire che un deployment distribuisca i suoi pod in vari nodi o in varie zone invece che tutti nello stesso nodo. Senza questa configurazione, kubernetes non ha una regola e potrebbe eseguire tutti i pod sullo stesso nodo.

Le zone sono solitamente definite dal Cloud provider che marca i nodi con l'etichetta "topology.kubernetes.io/zone" le zone geografiche in cui i nodi risiedono effettivamente.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 6
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: nginx
          image: nginx
      topologySpreadConstraints:
        # Che differenza di numero di pod viene eseguito tra ciascuna zona
        - maxSkew: 1
          # Distribuire nelle zone, si potrebbe anche mettere la distribuzione tra nodi con kubernetes.io/hostname
          topologyKey: topology.kubernetes.io/zone
          # Cosa fare quando non ci sono le caratteristiche per eseguire il pod seguendo le condizioni del topologySpreadConstraints, in questo caso non lo esegue, ma si potrebbe forzare l'esecuzione con la configurazione "ScheduleAnyway"
          whenUnsatisfiable: DoNotSchedule
          labelSelector:
            matchLabels:
              app: web
```

### PodDisruptionBudget (PDB)

Questa è una risorsa specifica di kubernetes che permette di definire delle regole su quanti pod possono essere interrotti contemporaneamente durante un "Disruption" volontario, come un aggiornamento del nodo, autoscaling o manutenzione. Permette di definere una soglia minima di disponibilità per un gruppo, in questo modo se tutti i pod di un nodo devono essere terminati, non vengono terminati insieme ma si aspetta sempre di averne un certo numero in esecuzione prima di terminarne altri: quindi ne termino alcuni che si riavviano su un altro nodo e una volta avviati posso terminarne altri fino a completare il processo.

Tramite un selettore a livello di label si definisce su quale gruppo il PDB lavora, poi si definisce se si vogliono avere un `minAvailable` numero di pod oppure un `maxUnavailable`, ma non puoi configurare entrambi.

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: web-pdb
spec:
  # Tra tutti i pod con label web=app, almeno 2 devono essere sempre disponibili. Se si ha un Deploy con 3 repliche, verranno interrotti e riavviati uno alla volta.
  # Alternativamente si potrebbe avere "maxUnavailable: 1"
  minAvailable: 2
  selector:
    matchLabels:
      app: web
```

## Configurazioni di sicurezza

### NetworkPolicy

Le NetworkPolicy sono risorse di kuberentes che limitano il traffico di rete all'interno del cluster, indicando delle regole di Ingress o Egress tra applicazioni usando i pod selector tramite label.
Una volta messa una NetworkPolicy, tutto quello che non la rispetta viene considerato denied.

Importante: per utilizzare le network policy si deve installare un CNI plugin (Container Network Interface) compatibile con le Network Policies. Sostanzialmente un componente che gestisce la rete tra i pod. Un esempio è il software **Calico**.

```yaml
# Questa risorsa forza la applicazione di backend (con label app=backend) a ricevere in ingresso il traffico solo dall'applicazione di frontend (app=frontend)
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend
  namespace: my-app
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: frontend
```

### Autenticazione e Autorizzazione

Kubernetes non gestisce l'autenticazione diretta degli utenti, ma la delega a meccanismi esterni. Kubernetes verifica l'identità, ma non ha un database di utenti interno. Una volta autenticato, verifica l'autorizzazione per capire cosa puoi fare, usando RBAC (Role-Based Access Control).

L'autenticazione può essere tramite:

- Certificati client: vengono scritti sul file `kubeconfig` e ti permettono di essere autenticato
- Service Account: è una sorta di user interno al cluster usato dai pod
- OIDC: tramite un servizio esterno di autenticazione. Si può usare il plugin `kubelogin` per loggarsi usanzo Azure AD. Il risultato viene comunque salvato sul `kubeconfig`

L'autorizzazione viene invece gestita tramite:

- **Role**: componenti che definiscono le risorse a cui puoi accedere e che operazioni puoi fare su quelle risorse (`verbs`)
  - Il `Role` è ristretto al relativo namespace, mentre se si vuole che quella regola valga per tutto il cluster si deve creare un `ClusterRole`. Le risorse Cluster-wide come "nodes", "persistentvolumes", "namespaces" possono essere gestite solamente da un `ClusterRole`
- **RoleBinding**: associa un ruolo ad uno User o ServiceAccount assegnandogli effettivamente dei permessi specifici
  - Il `RoleBinding` può essere usato per associare sia un `Role` che un `ClusterRole`. Precisazione: anche se si associa un `ClusterRole` (quindi Cluster-wide), ma usando `RoleBinding` allora se ne limiteranno i permessi al namespace del `RoleBinding`. Se altrimenti si vuole dare i permessi Cluster-wide si deve usare `ClusterRoleBinding`

Ogni role ha tre campi fondamentali: apiGroups, resources, verbs

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
  namespace: default
rules:
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["get", "list", "watch"]
```

- **apiGroups**: il/i gruppo/i a cui tutte le risorse nel campo "resources" appartengono. Alcune resource non hanno alcun apiGroup (""), altre hanno altri valori (come "apps"). Non vengono fatti controlli incrociati tra la lista in apiGroup e resources, per cui è buona norma fare regole specifiche per ogni apiGroup. In alternativa si può usare "\*" che indica un qualsiasi apiGroup va bene e rende la regola indipendente dall'apiGroup
- **resources**: sono le resource di kubernetes, comprese le `CustomResourceDefinition`. Le CRD hanno anche un loro apiGroup. Anche in questo caso si può usare "\*" per indicare che questa Rule vale per qualsiasi resource
- **verbs**: le azioni consentite su quelle risorse. I verbs sono fissi e non si possono creare nuovi verbs. Si può usare anche qui il "\*" ma spesso è sconsigliato perchè darebbe accesso totale, a meno che non sia quello che si vuole fare. Una lista dei verbs che si usano solitamente:
  - Lettura: "get", "list", "watch",
  - Scrittura: "create", "update", "patch", "delete"

#### Creare un nuovo utente su minikube

Per simulare un utente che non sia l'utente basi di minikube, che si chiama "minikube", è necessario aggiungere un nuovo utente al `kubeconfig` e un relativo nuovo context. In questo modo passando da un contesto all'altro si può simulare utenti diversi connessi al minikube.

Step:

- Creazione del certificato nella cartella `certificates/alessandro`

```shell
openssl genrsa -out alessandro.key 2048
openssl req -new -key alessandro.key -out alessandro.csr -subj "/CN=alessandro"
openssl x509 -req -in alessandro.csr -CA C:\Users\allec\.minikube\ca.crt -CAkey C:\Users\allec\.minikube\ca.key -CAcreateserial -out alessandro.crt -days 365
```

- Aggiungere l'utente al kubeconfig

```shell
# Creazione dell'utente
kubectl config set-credentials alessandro --client-certificate=alessandro.crt --client-key=alessandro.key
# Creazione del context
kubectl config set-context alessandro-context --cluster=minikube --user=alessandro
# Accesso al namespace di default
kubectl create rolebinding alessandro-read-pods --clusterrole=view --user=alessandro --namespace=default
```

#### Service Account

Il service account è una identità che si da ad un pod per permettergli di interagire con l'API server. Ogni pod può avere associato un ServiceAccount che a sua volta può avere un Role associato con RoleBinding.
Quando noi usiamo kubectl, interagiamo direttamente con API server. Se un pod ha bisogno di listare i nodi, pod, creare configmap o fare altre operazioni sul cluster stesso, ha bisogno di un Role che glielo permetta. In questi casi si usa il ServiceAccount che permette di chiamare l'API server con successo.
Normalmente le chiamate all'API server sono (ma non solo) chiamate HTTP con un Authorization header utilizzando il JWT montato automaticamente da Kubernetes sul pod. Poi l'API Server verifica il Role e risponde di conseguenza.

### Service Mesh

Il Service Mesh è una infrastruttura software dentro Kubernetes per gestire i microservizi che permette di astrarre a livello di Kubernetes le complessità di comunicazione come:

- Retry, timeout, circuit breaker
- Logging e tracing
- Load balancing interno
- Sicurezza tra servizi

Ha senso vedere il dettaglio in contesti con molti microservizi che comunicano tra loro, altrimenti sarebbe esagerato.

## Helm

Helm è un gestore di pacchetti di Kubernetes che ti permette di installare, aggiornare e gestire applicazioni complesse nel tuo cluster.
I pacchetti vengono chiamati **Helm Chart** e contengono tutti i file necessari per l'installazione e i valori configurabili dentro il `values.yaml`.

I file principali di una chart:

- `Chart.yaml` cointiene la versione della chart e i vari metadata che la rappresentano
- `values.yaml` contiene i parametri configurabili con i valori di default, che possono anche essere personalizzati durante la tua installazione
- `/templates/` contiene i file di installazione con le relative variabili che poi helm utilizzerà per generare i manifest YAML veri e propri da applicare al cluster

I passaggi per installare una chart sono i seguenti:

- Aggiungere il repo di helm al tuo client helm locale
  - I repo possono essere cercati su [Artifact Hub](https://artifacthub.io/)
- Aggiornare i repo all'ultima versione sul tuo client helm
- Installare il componente tramite quella chart
  - Darai un nome alla Release, cioè all'installazione
  - Punterai alla chart tramite `<nome repo al momento di helm repo add>/<chartname dentro il repo, visibile su Chart.yaml>`

Per esempio questa è l'installazione di Traefik:

```shell
# Aggiunge al client helm questo repository che contiene delle chart
# qui traefik è un alias locale per riferirti a questo repo remoto
# Il comando solitamente viene trovato https://artifacthub.io/ dove ci sono tutte le chart
helm repo add traefik https://traefik.github.io/charts
# Aggiorna i repo presenti sul tuo client helm all'ultima versione
helm repo update
# Installa la chart. Il primo traefik è il nome della release cioè dell'installazione che stai facendo
# traefik/traefik è il
helm install traefik traefik/traefik --namespace=traefik
# Oppure se si vuole passare un proprio set di values per personalizzare le configurazioni di default si può creare il file traefik-values.yaml e passarlo all'installazione
helm install traefik traefik/traefik --namespace=traefik -f traefik-values.yaml
```

Comandi aggiuntivi del client helm che possono essere utili:

```shell
# Mostra la lista dei repo presenti nel mio client
helm repo list
# Mostra le chart disponibili del repo aggiunto
helm search repo traefik
```

Se vuoi aggiornare il tuo componente perchè hai cambiato qualcosa al tuo file di values, puoi fare:

```shell
helm upgrade traefik traefik/traefik --namespace=traefik -f traefik-values.yaml
```

Puoi disinstallare un componente tramite helm, rimuovendolo completamente (alcune chart non disinstallano le CRD, ma ti indicano le istruzioni per disinstallarle manualmente nel caso servisse):

```shell
helm uninstall traefik --namespace=traefik
```

Se vuoi vedere i manifest prima di installare il componente, puoi lanciare questo comando che non fa alcuna installazione e mostra solo i file risultanti:

```shell
helm template traefik traefik/traefik -f traefik-values.yaml
```
