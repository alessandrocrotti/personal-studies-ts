# Networking

- [Networking](#networking)
  - [Descrizione](#descrizione)
  - [Http Lifecycle](#http-lifecycle)
    - [Request](#request)
    - [Risoluzione DNS](#risoluzione-dns)
    - [Connessione TCP/TLS](#connessione-tcptls)
    - [Comunicazione](#comunicazione)
  - [Caching](#caching)
  - [HTTP versions](#http-versions)
    - [HTTP/0.9 (1991)](#http09-1991)
    - [HTTP/1.0 (1996)](#http10-1996)
    - [HTTP/1.1 (1997)](#http11-1997)
    - [HTTP/2 (2015)](#http2-2015)
    - [HTTP/3 (2022)](#http3-2022)

## Descrizione

Questo argomento tocca le modalità di comunicazione di rete tra applicazioni ed alcuni degli elementi coinvolti.

## Http Lifecycle

Si tratta di una classica comunicazione tra un client ed un server connessi ad una rete.

### Request

La request è composta da:

- **Method**: GET, POST, PUT, DELETE, HEAD...
- **URL**: indirizzo del server da chiamare. Può già includere nel path o nei query parameters i dati necessari per elaborare la request
- **HEADERS**: una mappa chiave valore che il server utilizza per elaborare la richiesta
- **BODY**: è opzionale e contiene i dati che il server utilizzerà per elaborare la request

### Risoluzione DNS

Quando un url ha un nome dominio invece di un IP, si deve capire quale IP è associato al dominio. Questo si fa tramite un DNS che conosce quali IP sono associati ai domini. Questo è il processo:

- Si controlla se nella cache locale c'è già in memoria l'associazione domain-IP, altrimenti
- Si chiede al resolver DNS (solitamente del tuo internet service provider o altri sistemi interni) se ha in cache quel valore, altrimenti
- Il resolver DNS chiede ai Server DNS Autorevoli l'associazione domain-IP
- Ottenuto il risultato, viene restituito e tenuto in cache sia del resolver DNS che locale

### Connessione TCP/TLS

Questa è l'effettiva connessione di rete tra client e server. TCP se il protocollo è HTTP, TLS se il protocollo è HTTPS.

**TCP** serve per instaurare una connessione:

- **SYN**: il client invia un messaggio per sincronizzarsi col server
- **SYN-ACK**: il server risponde con un acknoledge
- **ACK**: il client risponde a sua volta con un acknoledge

A questo punto la connessione è stata stabilita con successo e si possono trasmettere i dati.

**TLS** serve per di instaurare una connessione cifrata:

- Il client invia un messaggio che include:
  - La versione del TLS supportata
  - Le cifrature proposte
  - Un numero casuale per generare le chiavi
  - Eventuali altri parameti
- Il server risponde con:
  - La cifratura scelta
  - Il certificato (che contiene sia la chiave pubblica che il dominio e tutti i dati di validità)
  - Un numero casuale proprio
- Il client verifica il certificato del server (controlla sia quello giusto per il dominio, che sia firmato e valido)
- Entrambi si scambiano una chiave pubbliche (tramite il concetto di chiave pubblica/privata) e generano una chiave di sessione condivisa tramite le parti pubbliche ricevute e la loro parte privata
  - C'è una versione avanzata di questo concetto, si chiama Elliptic Curve, che genera chiavi più robuste, sono temporanee e valgono per sessione, il sever può firmare i suoi parametri tramite il certificaqto
- Ora tutti i dati vengono cifrati utilizzando la chiave condivisa

### Comunicazione

La richieste viene quindi inviata sulla connessione stabilita. Il server elabora la richiesta e costruisce la risposta. La risposta ha una struttura analoga, con Headers, Body e anche uno Status Code che permette al client di capire l'esito della request.

** Chiusura della connessione**:

- **Keep-Alive**: la connessione TCP/TLS rimane aperta dopo la risposta e viene riutilizzata
  - Il client/server possono usare un header `Connection: keep-alive` per indicarle di mantenere la connessione aperta
  - Vantaggi:
    - minor overhead per l'handshake che instaura la connesione
    - Quindi rende più veloce la comunicazione
  - Solitamnete è di default in _HTTP/1.1_
  - Si può comunque mettere un timeout o un numero massimo di request prima di chiuderla
- **Cloed**
  - Il server può usare un header `Connection: closed` per indicarle di aver chiuso la connessione dopo che ha risposto

## Caching

La cache serve per memorizzare le request e le response precedenti, in modo da non doverle richiedere nuovamente al server:

Le cache sono a livello di:

- Browser: quindi una cache privata
- Proxy: una cache condivisa tra tutti quelli che usano il proxy
- CDN e reverse proxy: è una cache gestita in un servizio esterno

La cache si può gestire tramite headers:

- `Cache-Control`: contiene le regole di gestione della cache separate da `,`
  - `max-age=3600`: la response è valida per 1 ora
  - `no-cache`: devi rivalidare la request con il server prima di usare la versione cachata. **NON** significa che non devi cachare.
  - `no-store`: non deve essere memorizzata in cache
  - `public` / `private`: indica se può essere condivisa tra tutti gli utenti `public` (quindi cachata a livello di proxy/CDN), oppure è specifica dell'utente corrente `private` nel caso di contenuto personalizzato (quindi cachata nel browser dell'utente)
  - Ci sono molti altri valori che si possono verificare su [Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control)
- `ETag`: identificarote univoco della versione della risorsa inviato dal server al client e usato per la validazione in combinazione con altri header come:
  - `If-None-Match: "<ETag>"`: lo invia il client al server per indicargli la risorsa, il server verifica se la risorsa ha ancora lo stesso identificativo. In questo caso risponde 304 Not Modified e quindi il client può usare la versione cachata. Questo risparmia bandwidth ed elaborazione lato server

## HTTP versions

### HTTP/0.9 (1991)

- Solo metodo GET
- Nessun header, nessun codice di stato
- Risposte solo in HTML puro
- Usato per recuperare semplici documenti
- Era un protocollo minimale, pensato per ambienti di laboratorio.

### HTTP/1.0 (1996)

- Introduzione degli header HTTP
- Supporto per POST e HEAD
- Codici di stato (200 OK, 404 Not Found)
- Supporto per contenuti diversi da HTML
- Connessione chiusa dopo ogni richiesta
- Ha reso il protocollo estensibile e più flessibile.

### HTTP/1.1 (1997)

- Connessioni persistenti (keep-alive)
- Pipelining: invio di più richieste senza aspettare le risposte
- Nuovi metodi: PUT, DELETE, OPTIONS, TRACE, PATCH
- Content negotiation (lingua, tipo, encoding)
- Miglior caching (Cache-Control, ETag)
- Problema: Head-of-Line Blocking (le richieste sono sequenziali, quindi una richiesta lenta blocca le altre)

### HTTP/2 (2015)

- Il protocollo passa da testuale a binario, quindi più compatto e veloce, meno soggetto ad errori
- Multiplexing: più richieste simultanee su una sola connessione
- Compressione header (HPACK)
- Priorità delle richieste: il client puù indicare quali risorse sono più importanti in modo che il server le elabori per prime
- Server Push: il server invia risorse prima che vengano richieste (poco usato e deprecato)
- Richiede TLS nella maggior parte dei casi (TLS), più sicuro
- Framing: i dati vengono suddivisi in frame che viaggiano negli stream logici. Ogni stream ha un ID ed è essere indipendente
- Problema: Head-of-Line Blocking (il multiplexing permette di ricevere risposte in qualsiasi ordine, ma a livello di TCP, la perdita di pacchetti blocca gli altri stream in attesa della ritrasmissione)

### HTTP/3 (2022)

- Basato su QUIC, un protocollo su UDP: migliore gestione del traffico e recupero degli errori
- Elimina il TCP: niente handshake lento
- Multiplexing migliorato: meno overhead e più parallelismo
- Stream indipendenti anche a livello di rete: sostituendo il TCP con QUIC su UDP ogni stream è totalmente indipendente
- Crittografia integrata (TLS 1.3): tutte le chiamate sono sempre in HTTPS
- Migliore supporto per reti mobili e instabili, se cambi rete da WiFi a 4G la connessione viene mantenuta
- Ideale per app moderne, streaming, giochi online e mobile-first
- Promblema RISOLTO: Head-of-Line Blocking (gli stream sono indipendenti a livello di rete e se un pacchetto si perde, solo quello stream è coinvolto mentre gli altri proseguono)
