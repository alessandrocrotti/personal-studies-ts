# My Example Image

è un piccolo esempio di applicazione con frontend e backend dove entrambe sono due applicazioni separate. Il frontend chiama il backend attraverso chiamate rest. Il backend salva i dati su mongodb. Mongo Express è un componente per avere una interfaccia su mongodb.

Ogni progetto ha il suo Dockerfile, ma esiste un `docker-compose.yaml` che ha lo scopo di eseguire tutti i container insieme con le relative configurazioni corrette.

## Backend

Creata una applicazione con Express minimale in typescript.

Può essere eseguita:

- In locale tramite il comando `npm run dev` che non necessita di buildare i file typescript.
- In produzione è sempre meglio usare i compilati e questa applicazione viene buildata tramite `esbuild` generando la cartella `dist` tramite il comando `npm run esbuild`. Successivamente si può usare il comando `npm run start`.

Anche a scopo di sperimentazione, ci sono due Dockerfile:

- Dockerfile: a livelli classico
- Dockerfile.multistage: utilizza gli stage per creare una immagine più contenuta per i soli file che servono, evitando sorgenti e altro

### Publish

L'immagine è stata pubblicata sul mio account di DockerHub per poterla usare comodamente su kubernete. Questi sono i comandi:

```shell
docker build -t my-example-image-be -f ./backend/Dockerfile.multistage backend
docker tag my-example-image-be allecrotti/my-example-image-be:latest
docker push allecrotti/my-example-image-be:latest
```

#### Automation

Per automatizzare il publishing dell'immagine, è stata fatta una GitHub Action che verifica il file `package.json` e se cambia la versione, automaticamente pubblica nuove immagini per quella versione e per la latest

## Frontend

Il frontend è un semplice nginx con un file `index.html` minimale che gestisce la form di todo-list. Questa form interagisce col backend tramite le chiamate REST che esso espone.

Il frontend ha bisogno di sapere l'url a cui chiamare il backend. Per evitare di avere API_URL hard-coded nell'immagine stessa, è stato uno script `entrypoint.sh` e un file `config.js` che gestiscono la possibilità di sovrascrivere API_URL alla creazione stessa del container.

- `config.js` semplicemente valorizza la variabile `window.API_URL` che poi verrà usata nel `index.html`
- `entrypoint.sh` esegue uno script che, al momento della creazione del container, sovrascrive `config.js` con una sua versione dove `window.API_URL` viene valorizzata tramite una variabile d'ambiente `API_URL`

In questo modo, tramite la variabile d'ambiente `API_URL`, si può ridefinire l'endpoint di backoffice, cosa indispensabile al passaggio in produzione sul cluster kubernetes.

Questa tecnica è chiamata **Runtime Configuration Injection** ed è usata solitamente nelle applicazioni di frontend.

### Publish

L'immagine è stata pubblicata sul mio account di DockerHub per poterla usare comodamente su kubernete. Questi sono i comandi:

```shell
docker build -t my-example-image-fe frontend
docker tag my-example-image-fe allecrotti/my-example-image-fe:latest
docker push allecrotti/my-example-image-fe:latest
```

#### Automation

Per automatizzare il publishing dell'immagine, è stata fatta una GitHub Action che verifica il file `VERSION` e se cambia la versione, automaticamente pubblica nuove immagini per quella versione e per la latest

## Frontend2

è un progetto analogo al progetto Frontend, ma più complesso perchè utilizza `Vite` come framework. è una prova per vedere soluzioni alternative, ma il progetto Frontend è più che sufficiente allo scopo.
