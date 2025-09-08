# Pulumi

- [Pulumi](#pulumi)
  - [Descrizione](#descrizione)
  - [Pulumi IaC](#pulumi-iac)
    - [Monorepo VS Mini-Stacks](#monorepo-vs-mini-stacks)
      - [Monorepo](#monorepo)
      - [Micro-Stacks](#micro-stacks)
    - [Pulumi Minikube](#pulumi-minikube)
    - [Pulumi Secrets](#pulumi-secrets)
    - [Cert Manager](#cert-manager)
    - [MongoDB](#mongodb)
    - [Traefik](#traefik)

## Descrizione

Pulumi è una applicazione open source per gestire l'Infrastructure as Code (IaC) attraverso diversi linguaggi, tipicamente Typescript. Può gestire diverse strutture cloud o direttamente un cluster kubernetes. Per ogni Cloud Provider fornisce delle librerie per interfacciarsi. Grazie a queste API specifiche del Cloud Provider, ti permette di gestire via programmatica ogni aspetto del Cloud e non solamente la parte di container tramiter Kubernetes.

Al contrario di altri sistemi IaC che hanno linguaggi dichiarativi, come Terraform, questo permette di utilizzare un linguaggio di programmazione. Nonostante questo, applica un modello dichiarativo, cioè si dichiara tramite il codice lo stato che si vuole raggiungere e Pulumi si occupa di raggiungerlo. Le esecuzioni dei comandi di pulumi si legano ad una interfaccia web che mantiene lo storico e lo stato della tua infrastruttura.
L'esecuzione dei comandi avviene attraverso la CLI che lo rende utile per l'integrazione nella CI/CD.

Inoltre attraverso Pulumi si possono creare dei portali di "self-service" per i team interni che permettono loro di creare risorse e ambienti sul clould standardizzati, in autonomia, tramite una interfaccia comune. Questa viene chiamata **Internal Development Platform (IDP)**.

Pulumi ha deversi progetti interni:

- **IaC**: quello descritto sopra che permette di gestire una piattagorma cloud tramite codice. Questa è la base di pulumi
- **ESC**: Environments, Secrets, Configuration. Sostituisce la gestione dei file YAML di gestione dello stack `Pulumi.<stack>.yaml` e si integra con i sistemi di gestione di secret del Cloud Provider.
- **IDP**: Internal Development Platform. Una piattaforma costruita tramite Pulumi IaC per creare ambienti cloud in poco per agevolare i team interni.
- **Insights**: Sistema di verifica dello stato degli account cloud, verifica dei costi, observability e analisi
- **Automation API**: Permette di usare pulumi come libreria invece che da CLI, utile per integrarlo in portali self-service, CI/CD, contesti automatizzati
- **Registry**: pacchetti di componenti riutilizzabili attraverso pulumi

## Pulumi IaC

Essendo la funzione base di Pulumi che ti permette di creare codice in maniera automatica sul cloud, è anche quella più importante da conosce. Ci sono diversi comandi utili, ma vale la pena vedere solo quelli principalmente usati.

Il principio alla base di questo componente è quello di evitare di creare o gestire elementi tramite interfaccia, per rendere il tutto più automatizzato possibile. Questo si va a combinare anche con IDP, ma nel caso più semplice, vale anche solo la pena verificare come creare un cluster Kubernetes totalmente gestito da Pulumi. Ci sono altre funzioni e componenti cloud che possono essere automatizzati, vale la pena valutarli progetto per progetto.

Ogni progetto di pulumi può avere uno o più stack. Gli stack solitamente rappresentano un progetto su un certo ambiente (dev, prod) con le relative configurazioni. Ogni stack è indipendente e permette di gestire le risorse di quel progetto basandosi sulle specifiche configurazioni di quello stack.

Step:

- Installazione: pulumi può essere installato tramite `choco`
- Login: fondamentale è avere un login di Pulumi e loggare il proprio client locale a pulumi, in questo modo pulumi eseguirà il codice e riporterà lo stato sul portale
  - `pulumi login`
- Creare un progetto: ogni progetto ha un template con cui Pulumi stesso crea la base di tale progetto, il progetto più semplice da gestire localmente è quello di kubernetes in typescript. Durante l'inizializzazione ti chiede anche lo stack che vuoi, solitamente "dev". Successivamente si possono creare anche altri Stack se necessari. Il progetto potrebbe richiedere configurazioni addizionali sul tsconfig.json nel caso si gestisse il progetto su più file e cartelle
  - `pulumi new kubernetes-typescript` (senza il parametro "kubernetes-typescript", pulumi ti permette di sceglierne uno dalla sua lista durante la creazione)
- Aggiungere qualche risorsa al tuo progetto: questo dipende dal tuo scopo
- Eseguire il progetto sullo stack che vuoi: pulumi ha una configurazione che ricorda lo stack di default che stai usando se non definisci esplicitamente l'option `-s`. Eseguire lo stack significa indicare a pulumi che deve portare lo stato attuale allo stato dichiarato dal tuo codice. Ti presenterà un riassunto delle modifiche che saranno apportate e tu potrai confermare se procedere
  - `pulumi up`
- Rimuovere le risorse del tuo progetto: se vuoi rimuovere le risorse dal cloud, come per esempio cancellare il tuo cluster kubernetes o le risorse su esso (dipende dal codice del tuo progetto Pulumi), puoi distruggerle. Questo non cancella lo stack stesso che può quindi essere ricreato e, inoltre, mantiene tutta la sua history.
  - `pulumi destroy`
- Cancellare uno stack: se invece si vuole cancellare definitivamente uno stack, in modo che venga anche rimosso interamente del portale web.
  - `pulumi stack rm`
- Aggiungere configurazioni allo stack: si possono aggiungere configurazioni, al proprio stack per gestirne il comportamento. Queste vengono aggiunge al file `Pulumi.<stack>.yaml`. Aggiungendo l'option `--secret` quella configurazione sarà criptata
  - `pulumi config set <key> <value>`

### Monorepo VS Mini-Stacks

La struttura di un progetto pulumi è la seguente: `<org>/<project>/<stack>` dove l'organization è omessa per gli account singoli. Le best practise indicano che `stack` deve rappresentare l'ambiente (dev/staging/prod...) quindi il project rappresenta il contesto.

#### Monorepo

Se io voglio creare il mio cluster kubernetes posso creare il project "my-cluster" con le relative stack "dev" e "prod". Dentro "my-cluster" posso creare tutti i componenti che vanno a comporre il mio cluster, come l'installazione (anche tramite Helm) di IngressController, CertManager, Database, Applicazioni. Questo significa che al `pulumi up` tutto deve essere ben gestito tramite dipendenze per inizializzare tutto in ordine. Ovviamente, quando esegui `pulumi destroy` rimuovi interamente tutti componenti installati, anche quelli più a basso livello come IngressController, CertManager. Alcuni di questi non possono essere cancellati interamente, perchè contengono delle risorse protette o condivise che non vengono volutamente rimosse: per esempio Cert-Manager può creare delle CRD al `pulumi up` che non vengono rimosse al `pulumi destroy` e causano un conflitto al seguente `pulumi up` se non sono rimosse manualmente o gestite manualmente alla creazione.

Il vantaggio di questo approccio è che si ha un solo progetto che contiene tutto ed è più facile gestire le interazioni tra i componenti, visto che sono tutti insieme, ma può creare problemi col `pulumi destroy`, soprattutto se si volesse eliminare solo una parte di ciò che è stato installato. Ovviamente si potrebbe intervenire sul codice ed eliminarla da li ed un `pulumi up` aggionerebbe lo stato, ma è un approccio differente. Inoltre chiunque avesse accesso al project, avrebbe accesso a tutti i componenti del project, mentre in certi contesti si preferisce dividere anche gli accessi.

Per utilizzare il minikube relativo a pulumi monorepo avviare:

```shell
minikube start -p pulumi-monorepo
minikube tunnel -p pulumi-monorepo
```

#### Micro-Stacks

Una alternativa che risolve i problemi del Monorepo è la struttura a Micro-Stack. Io potrei dividere in moduli il mio progetto in modo da raggruppare per competenza i componenti e poterli gestire indipendentemente. Questo aumenta la complessità perchè quando si vuole interagire tra componenti di diversi stack, si deve interagire tra stack differenti utilizzando reference e output. Il vantaggio è l'indipendenza dei moduli che possono essere gestiti da team diversi, aggiornati/rimossi indipendentemente dagli altri, riutilizzati in vari contesti.
Comunque Pulumi permette di gestire un solo livello di "project" e gli stack devono rimanere logicamente gli ambienti di esecuzione, quindi se vogliamo fare dei Micro-stack di un Monorepo, dobbiamo usare una naming convention sul project. Per esempio dovremmo creare diversi progetti con un pattern `<project>.<subproject>`: "my-cluster.infra", "my-cluster.apps.fe", "my-cluster.apps.be".

Una buona strategia di suddivisione in micro-stacks di un cluster è:

- infra: infrastruttura base con namespace, ingress controller e componenti fondamentali
- apps: deployment, service, configmap, secret delle applicazioni
  - si possono fare anche stack separati per applicazioni
- monitoring: Prometheus, Grafana, alerting
- networking: Ingress, LoadBalancer, DNS, certificati TLS

Per esempio il "my-cluster" potrebbe essere suddiviso in questi componenti per gestire in maniera indipendente l'aggiunta o rimozione e lo sviluppo di essi.

Per utilizzare il minikube relativo a pulumi monorepo avviare:

```shell
minikube start -p pulumi-microstacks
minikube tunnel -p pulumi-microstacks
```

### Pulumi Minikube

Localmente si può utilizzare Pulumi per gestire il proprio minikube. Pulumi stesso gestisce il cluster basandosi sul file `kubeconfig` locale, permettendo quindi di gestire tutte le risorse agevolmente. Un cluster gestito da pulumi non dovrebbe essere mai mischiato con una gestione manuale delle risorse, perlomeno si deve cercare di evitarlo il più possibile, perchè questo può creare conflitti i gestioni mancate nello state dei pulumi. Per questa ragione, è meglio gestire un cluster dedicato a pulumi su minikube tramite un profile specifico:

```shell
# Avviare il cluster utilizzando un profile specifico in modo da avere un cluster indipendente
minikube start -p minikube-pulumi
```

IMPORTANTE: se si volesse aggiungere risorse già esistenti a pulumi, non si devono creare ma importare. Tramite CLI si possono definire nello state di Pulumi delle risorse esistenti e quindi gestirle nel codice del proprio progetto come se fossero state create da Pulumi stesso. Questo permette di adattare un progetto esistente, anche se è preferibile partire con un progetto pulito.

Il progetto creato per pulumi ha lo scopo di gestire le risorse del `devops/kubernetes/my-example-cluster` interamente tramite pulumi, inclusa l'installazione dei componenti tramite Helm.

Creare un progetto tramite Typescript significa anche scegliere se svilupparlo usando le classi oppure lo script classico. Il suggerimento è sempre di passare ad una gestione tramite classi, che permette di strutturare il codice meglio nel caso di progetti grandi. Quindi ogni classe deve estendere la `pulumi.ComponentResource` che gestisce il componente su pulumi.

### Pulumi Secrets

Per gestire le secret necessarie nel cluster, sono state create delle secret sul Pulumi Stack tramite i seguenti comandi:

```shell
pulumi config set --secret mongoRootPassword supersecretpassword
pulumi config set --secret mongoTodosUserPassword todos-password
```

### Cert Manager

Per installare CertManager si può usare il componente che offre pulumi, che va installato tramite node.

```shell
npm install @pulumi/kubernetes-cert-manager
```

Nel caso si facesse destroy dello stack, bisogna lanciare successivamente la cancellazione dell CRD manualmente, altrimenti il pulumi up darà errore

```shell
kubectl delete crd -l app.kubernetes.io/name=cert-manager
```

### MongoDB

Si può utilizzare l'Helm Chart come `k8s.helm.v3.Release` in modo da considerare l'intera installazione come un unico componente a livello di pulumi. Questo significa che si deve intervenire sui `values` della chart per modificarlo e non si può accedere puntualmente nel codice di Pulumi ai singoli componenti generati dalla chart.
L'alternativa sarebbe crearla come `k8s.helm.v3.Chart` che permette a Pulumi di collegare ad ogni componente generato da Helm ad un componente di Pulumi, ma vale la pena farlo solamente se effettivamente devi accedere a quei componenti nel codice.

### Traefik

Come per MongoDB, installato utilizzando l'Helm Chart come `k8s.helm.v3.Release`.
