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
  - [Configurazioni di sicurezza](#configurazioni-di-sicurezza)
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

Il singolo pod non è raggiungibile dall'esterno perchè è isolato, analogamento come accade per i container su Docker. Per cui si deve esporre una porta dalla rete del pod alla rete locale e questo si fa attraverso il comando `port-forward`. Si utilizza il seguente pattern:

- `kubectl port-forward <nome_pod> <porta_locale>:<porta_pod>`
  - `<porta_locale>` è la porta che uso io dalla mia rete locale per accedere al pod
  - `<porta_pod>` è la porta che il container sul pod utilizza per la sua applicazione

```shell
# comando port-forward <nome_pod> <porta_locale>:<porta_pod> dove nginx lavora sul pod utilizzando la porta 80, mentre noi vogliamo accedere tramite http://localhost:8080
kubectl port-forward nginx-pod 8080:80
```

## Custom Resource Definition (CRD)

Oltre alle risorse standard, su kubernetes si possono creare delle risorse custom. Una CRD e la definizione di un nuovo tipo di risorsa su Kubernetes. Questo tipo di risorsa si aggiunge a quelle standard e può essere usato nel parametro "kind" degli YAML. Questa risorsa è cluster-wide e la si può vedere tra le configurazioni del cluster. Questo ti permette di estendere con nuove risorse Kubernetes.

Quindi una **Custom Resource (CR)** è una istanza concreta di una CRD, come quando lancio un Pod e quel pod creato è una istanza di un kind Pod di default. Questa istanza invece può essere creata in un namespace o cluster-wide.

Solitamente queste vengono creati tramite tool che autogenerano il codice YAML, come `kubebuilder`.

## Controller

I controller sono dei componenti di K8S che ricevuto un file manifest YAML, si attivano e rimangono in costante controllo dello stato del cluster ed intervengono per modificarlo e renderlo come il file YAML richiede. Creano un loop costante dove controllano lo stato e agiscono per correggere le differenze.

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
kubectl exec -it mongo-sfs-2 -n my-namespace -- mongosh
```

### DaemonSet

Utile quando si vuole eseguire un pod su **ogni nodo** del cluster (Logging, Monitoring). Il pod sul nodo è come un agent che agisce sul nodo per una applicazione, come fa per esempio Fluend Prometheus per monitorare lo stato del cluster cl suo Prometheus Node Exporter. Questo significa che quando si aggiunge un nuovo nodo al cluster, automaticamente il DaemonSet crea un pod su quel nodo.

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

- **completions**: quante volte esegue il jopb, cioè quanti pod esegue
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
- Se stai facendo un Rollig update o scaling, guardare gli endpoint ti permette di verificare la transizione
- Se stai facendo delle regole di Network Policies o Firewall, puoi verificare gli effettivi IP dei vari pod

### Ingress

L'ingress è un risorsa di kubernetes che permette di gestire il traffico HTTP/HTTPS in entrata tramite delle regole di configurazione. Tramite questo routing del traffico, permette tramite un solo componente di gestire come esporre le proprie applicazioni nel cluster.

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

Invece di usare l'Helm Repo che è il metodo tradizionale, per Cert-Manager consigliano di usare OCI Registry che è un registro standard per i package, anche quelli di K9S. Questo non richiede di fare `add repo` e `update`, ma si può usare direttamente questo comando:

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

Definisce come creareun PersistentVolume per K8S in modo dinamico. Si possono creare delle storage class personalizzate oppure utilizzare quelle di default e solitamente ce n'è una marcata come "default".

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

### Persistent Volume

## Configuration

### ConfigMap

### Secret

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
  - Punterai alla chart tramite "<nome repo al momento di helm repo add>/<chartname dentro il repo, visibile su Chart.yaml>"

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

Puoi disistallare un componente tramite helm, rimuovendolo completamente:

```shell
helm uninstall traefik --namespace=traefik
```

Se vuoi vedere i manifest prima di installare il componente, puoi lanciare questo comando che non fa alcuna installazione e mostra solo i file risultanti:

```shell
helm template traefik traefik/traefik -f traefik-values.yaml
```
