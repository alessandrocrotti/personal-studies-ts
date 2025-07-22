# Docker

## Descrizione

Docker è un sistema per eseguire dei programmi in the _container_. I _container_ sono degli ambienti esecutivi isolati con il loro file system, dipendenze e applicazioni necessarie per eseguire il tuo codice.

Differenza tra Docker Container e Virtual Machine:

- la virtual machine emula anche il kernel del sistema operativo, cioè la parte che gestisce la comunicazione tra software e hardware
  - Più lento nell'avvio e nelle performance
  - Utilizza molta più memoria e spazio sul disco
- il Docker Container usano il kernel della macchina su cui sono installati
  - tutto molto più veloce e vicino alle performance della macchina su cui è installato
  - Utilizza molta meno memoria e spazio su disco

## Docker Desktop

Docker gira su Linux e molti container girano su Linux, quindi Docker Desktop utilizza _Hypervisor_ per emulare una macchina Linux in modo da poter utilizzare container per Linux anche su Windows o Mac.

Una volta installato, girerà un servizio Docker Deamon che permette di eseguire i container.

## Containers VS Images

Le Images sono come dei template per i container dove sono specificate le configurazioni con cui creare il container (come file system, users, comandi, variabili d'ambiente...). Sono come la ricetta per creare un container e sono ciò che devi scaricare e condividere per poter utilizzare la tua applicazione su altre macchine.

```shell
# Lista delle images scaricate
docker image ls
```

I Containers sono l'effettivo gruppo di processi eseguiti grazie alle istruzioni della relativa image. Quindi posso avere più contaiener generati sulla base della stessa image.

```shell
# Lista dei container in esecuzione
docker ps
# Lista di tutti i container
docker ps -a
```

### Tipi di Images

Una stessa applicazione può essere installata su una immagine che implementa diverse versioni di Linux. Alcune di queste versioni contengono numerose librerie e comandi, proprio per questo occupano solitamente molto spazio. Se non è necessario avere delle verioni corpose di Linux per il tuo container, in quanto non utilizzi le loro funzioni nel tuo container, è utile scaricare la versione dell'immagine più leggera:

- La versione base solitamente è su una distro Debian o analoga, completa di varie librerie e quindi più pesante
- Ci sono alcune immagini che hanno il tag con la desinenza `-slim` che si basano su distro più contenute
- Solitamente le immagini più leggere utilizzano la distro Alpine che è basata sull'essere minimale, utilizzando al desinenza `-alpine`

SUggerimenti su quale usare:

- Se presente la versione `-slim` questa solitamente è un buon compromesso, contiene Debian ma alleggerito
- `-alpine` anch'essa valida. Al contrario di Debian, alcuni command non sono li stessi
  - utilizza `ash` invece di `bash` come default shell
  - utilizza `apk` invece di `apt` per installare i package
  - potrebbe essere necessario conoscere i dettagli di alpine a differenza di debian per evitare errori

# Port Mapping

Quando esegui un container, questo è isolato verso l'esterno, per cui anche se esegui un container sulla base di una immagine di un web server come NGINX, non potrai accede alla sua pagina di default tramite "localhost"

Per esempio:

```shell
# Scarica l'immagine di nginx con l'ultima versione (visto che non è specificata) e crea un container che esegue l'applicazione in foreground
docker run nginx
```

Se ora visiti http://localhost non raggiungi la pagina di NGINX, perchè il container non pubblica nessuna porta su cui è in ascolto

```shell
# CTRL+C per interropere l'esecuzione del container precedente e lanciamolo nuovamente esponendo la porta 80. Verrà creato un nuovo container in questo modo. Se i volesse esporre sulla porta 5000 invece che 80, si deve fare -p 5000:80.
docker run -p 80:80 nginx
```

Ora, invece, si può raggiungere la pagina di NGINX tramite http://localhost e caricandola sul browser, si vedono i log nel container sulla shell in cui abbiamo eseguito il container.

Il formato è `-p <PORTA_LOCALE>:<PORTA_CONTAINER>`, dove PORTA_LOCALE è quella su cui puoi accedere al container, PORTA_COINTAINER è la porta che l'applicazione interna al container utilizza.

## Esecuzione container in background

Se si vuole eseguire in background un container, si deve lanciare in modalità detached con il parametro `-d`.

```shell
# -d = detached
docker run -p 80:80 -d nginx
# Questo comando restituisce il containerId
```

Se non si specifica un nome di container, questo verrà generato automaticamente, altrimente si puo utilizzare il paramero `--name <nome_container>`. Non puoi creare più volte un container con lo stesso nome; anche se è fermo, `docker run` fallirà se usi lo stesso nome e non rieseguirà lo stesso container

```shell
docker run -p 80:80 -d --name my-nginx nginx
```

Avendo definito un nome, possiamo anche utilizzarlo per riferirci al container, per esempio si possono vedere i log del container

```shell
docker logs my-nginx
```

Tutti questi container eseguiti e poi fermati si accumulano e possono essere rimossi in vari modi:

- manualmente tramite Docker Desktop
- aggiungere l'opzione `--rm` per indicare di cancellare il docker container quando viene fatto stop: `docker run -p 80:80 -d --name my-nginx --rm nginx`
- usera il comando `docker container prune` e elimina tutti i container non in esecuzione

Il principio è che un container può essere sempre ricreato dall'immagine e quindi che venga cancellato non è un problema.

## Tags/Versions e Digests

I tag sono dei link simbolici alle immagini pubblicate. Una immagine ha un _digest_ che è un identificativo in sha256 che si può utilizzare per far riferimento all'immagine specifica.

```shell
# Selezione image tramite tag
docker run nginx:1.29.0
# Selezione image tramite digest
docker run nginx@sha256:f5c017fb33c6db484545793ffb67db51cdd7daebee472104612f73a85063f889
```

Essendo i tag puntamenti ad immagini che possono essere modificati, mentre i digest sono identificativi specifici di una immagine, per contesti di produzione la cosa migliore sarebbe utilizzare i digest che sono più stabili. Questo suggerimento vale anche in altri contesti dove sono presenti tag/version e digest. Ovviamente usando immagini private, questa precauzione non è necessaria.

Se vuoi creare un tag per la tua immagine, puoi usare il comando docker tag:

```shell
# PATTERN: docker tag SOURCE_IMAGE[:TAG] TARGET_IMAGE[:TAG]
docker tag my-image my-image:latest
```

## Debug sui Container

Si può utilizzare Docker Desktop e, dentro un container, c'è la sezione "Exec" dove utilizzare una shell all'interno del container.
Alternativamente si possono lanciare i comandi dentro il container utilizzando;

```shell
# Aprire una bash del terminale dentro il container
# Le option "i" servervono per poter avere input e output, quindi poter interagire con la shell, t server per "TTY" cioè utilizzare l'autocompletamente e l'history della shell dentro il container
docker exec -it my-nginx /bin/bash
```

## Persistence

Visto che i container vengono creati e distrutti regolarmente, per permettere di conservare dei dati necessari alle applicazioni dentro il container, si devono creare delle aree di persistenza. Queste sono chiamate **Mount** e sono aree del file system che persistono oltre il container stesso.

Esistono due tipi:

- **Volumes**
  - Moderni
  - Gestiti dal Docker daemon e quindi visibili in Docker Desktop
  - Creano un file system dedicato
  - sintassi: `-v mydata:/path/in/container` dove mydata è il nome del volume
  - Meglio per i sistemi in produzione
    - Non dipendono dal file system su cui è hostato il container, ma non puoi accedere/modificare facilmente al contenuto tramite il file system dell'host
    - Si possono condividere tra più container
    - Si possono usare i cloud storage
- **Bind-mounts**
  - Più vecchi e semplici
  - Condividono una cartella del file system dentro il container
  - sintassi: `-v ./my/folder:/path/in/container` dove ./my/folder è il percorso assoluto o relativo della cartella sul tuo file system
  - Comodo in development perchè vedi facilmente i file e li puoi gestire dal tuo file system

## Custom Images

Tramite il `Dockerfile` si possono definire delle custom image, solitamente partendo da immagini già esistenti.

```shell
# Crea una nuova image
cd ./src/devops/docker/my-example-image
# Options:
# -t tag con cui marchiamo questa immagine
# -f posizione del Dockerfile, può essere omesso e in quel caso dalla cartella corrente risale fino a che non trova il primo Dockerfile
# . prende i file nella cartella corrente per creare l'immagine
docker build -t my-example-image -f ./Dockerfile .
```

### Sintassi Dockerfile

Il docker file è composto da una serie di comandi, alcuni utili da sapere:

- `FROM`: immagine iniziale da cui partire
- `WORKDIR`: configura una cartella come contesto per i comandi seguenti
- `COPY`: copia dei file dal file system dell'host a quello dell'immagine
- `ADD`: più complesso di `COPY`, permette di estrarre file compressi o utilizzare URL per recuperare dei file. Da utilizzare solamente se servono queste caratteristiche
- `RUN`: permette di eseguire dei comandi come se fossi nella shell
- `ENV`: definisci una variabile di ambiente
- `USER`: definisce un nuovo utente per i comandi seguenti. All'inizio si utilizza root, ma per motivi di sicurezza, può valer la pena cambiare in un utente dedicato all'applicazione che verrà eseguita
- `VOLUME`: permette di creare un volume persistente anonimo per una certa cartella. Serve anche ad indicare a chi utilizza l'immagine che una certa cartella è predisposta ad un VOLUME e comunque questo può essere sovrascritto utilizzando il parametro `-v myvolume:/app/data` con un volume specifico
- `EXPOSE`: definisce la porta sulla quale il container è in ascolto in runtime, con le versioni moderne è più considerata una forma di documentazione dell'immagine, perchè non espone realmente la porta. Questo viene fatto tramite l'option `-p 80:80` quando esegui il container
- `CMD`: una stringa o un array di stringhe che vengono eseguite come comando finale di esecuzione del contentuto dell'immagine quando viene eseguito il container. Questo è come se fosse il default, ma può essere sostituito nel momento che si mettono parametri nel comando `docker run my-img params`: questi si sostituiranno interamente ai valori presenti nel `CMD`. Può esserci solo un `CMD`, se ce ne sono più di uno, viene considerato solo l'ultimo
  - Meglio usare sempre il formato array, perchè più sicuro ed esegue direttamente il comando, mentre la stringa apre una shell e lancia quella stringa sulla shell. Però, se si volessero concatenare comandi, l'unico modo sarebbe come stringa e mettere "|" o "&&"
- `ENTRYPOINT`: una funzione analoga a quella di `CMD`, ma queste istruzioni non possono essere sovrascritte dai parametri dell'esecuzione del container. Sono forzatamente utilizzati.
  - Si possono combinare `CMD` e `ENTRYPOINT` avendo una parte fissa data dal `ENTRYPOINT` e una parte sovrascrivibile data da `CMD`. Per esempio `ENTRYPOINT ["npm", "run"]` e `CMD ["start"]` per lasciare la possibilità di eseguire altri script nel package.json

### Layers

Quando crei delle Custom Images, dentro il Dockerfile esegui diversi comandi. Ognuno di questi comandi genera un Layer per docker che somma ai Layer precendenti creando alla fine l'immagine definitiva.

Questi Layer sono immutabili e non si influenzano l'un l'altro: se io eseguo un comando di cancellazione, questa cancellazione sarà applicata al suo layer, ma il precedente layer che conteneva quei dati rimane immutato.

I vantaggi dei layer:

- Caching intelligente: se un layer non è stato modificato, non viene rieseguito. Essendo layer sovrapposti, se un layer sottostante cambia, i layer sovrastanti devono essere rieseguiti
  - se un comando interagisce col tuo file system host, come `COPY . /app`, Docker è in grado di rieseguire il comando solo se cambia qualcosa dentro `.`. Facendo il checksum della cartella e confrontandolo per verificare se è cambiato qualcosa
- Risparmio dello spazio: i layer in comune tra più image vengono condivisi

Best practices:

- Minimizza i layer: se un comando RUN può eseguire più istruzioni, è meglio farlo in quell'unico RUN piuttosto che eseguire più RUN singoli
- Ordina le istruzioni: metti prima le istruzioni che raramente cambiano e solo successivamente quelle che cambiano spesso, per evitare delle riesecuzioni inutili
- `.dockerignore` permette di escludere dei file tra quelli considerati da Docker, in questo modo la Cache rimane valida anche se tali file sono modificati

## Docker Compose

Dockerfile sono dedicati a singole immagini e comunque componenti singoli. Le applicazioni solitamente sono più complesse, fatte da un insieme di componenti.

Tramite il `docker-compose.yml` si possono creare una serie di service, che sono i componenti della nostra applicazione, e tramite i comandi di docker composi si possono gestire tutti insieme (ovviamente ogni comando può essere fatto in background usando l'option `-d`):

```shell
# Build delle immagini di ogni service
docker compose build
# Creare e avviare i container legati alle immagini dei service
docker compose up
# Stoppare e rimuovere i container legati elle immagini dei service
docker compose down
```

## Registry

Le immagini che crei, possono essere pubblicate su un registry pubblico o privato aziendale, in modo che siano facilmente accessibili. Quando pubblichi un'immagine sul registry, gli devi dare un tag. Una stessa immagine può essere associata a più tag.

### Docker Hub

Ci vuole un account su Docker Hub per poter pubblicare le immagini. Su Docker Hub esiste il concetto di Repository che rappresenta una immagine. Dentro un repository ci possono essere tanti tag della stessa immagine, per avere varie versioni di essa.

Pubblicare sul registri richiede che:

- L'immagine venga buildata in locale, puoi farlo sia con Dockerfile che con DockerCompose
- Taggare l'immagine utilizzando il pattern `<your_docker_id>/<image_name>:<tag>`

```shell
docker tag my-example-image-be allecrotti/my-example-image-be:latest
docker tag my-example-image-fe allecrotti/my-example-image-fe:latest
```

- Puoi vedere la lista delle immagini con i relativi tag usando:

```shell
docker image ls
```

- Pubblicare l'immagine taggata sul repository di DockerHub come repository pubblico

```shell
docker push allecrotti/my-example-image-be:latest
docker push allecrotti/my-example-image-fe:latest
```

- Se si vuole utilizzare un repository privato, lo si può creare prima come privato o modificare la visibilità di uno esistente in privato (ma ogni utente base ha un solo repository privato)

A questo punto è possibilie utilizzare l'immagine pubblicata al posto di quella buildata localmente:

```yaml
backend:
  image: allecrotti/my-example-image-be:latest
  ports:
    - 8000:8000
  env_file:
    - ./backend/.env
  depends_on:
    - mongodb

frontend:
  image: allecrotti/my-example-image-fe:latest
  ports:
    - 80:80
```
