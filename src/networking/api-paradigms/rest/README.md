# REST (Representational State Transef)

- [REST (Representational State Transef)](#rest-representational-state-transef)
  - [Descrizione](#descrizione)
  - [Struttura](#struttura)
    - [URL](#url)
    - [HTTP Methods](#http-methods)
  - [Principio HATEOAS](#principio-hateoas)
    - [JSON:API](#jsonapi)
  - [OpenAPI](#openapi)

## Descrizione

Un modo semplice e molto utilizzato per implementare API pubbliche e microservizi tramite chiamate HTTP. Non si tratta di un protocollo, ma delle linee guida. Quando questa struttura viene applicata secondo le linee guida, si ha una applicazione **RESTFul**.
Solitamente si utilizzano le REST per rappresentare ed operare su delle risorse presenti sul server. Queste operazioni sono chiamate CRUD (Create Retrieve Update Delete). Solitamente si usa JSON come body della comunicazione.

Principi:

- **Statelessness**: ogni richiesta è indipendente e il server non conserva lo stato del client
- **Client-Server**: separazione netta tra chi chiede e chi risponde
- **Cacheability**: le risposte devono indicare se possono essere cachate tramite headers
- **Uniform interface**: le chiamate per la stessa risorsa devono avere lo stesso aspetto e struttura
- **Layered System**: ci possono essere livelli intermedi come proxy o gateway o altre applicazioni che espongono API REST
- **Code on Demand**: OPZIONALE, il server può mandare codice eseguibile dal client

## Struttura

### URL

L'url deve essere significativo e preferibilmente scritto in **kebab-case**:

- OPZIONALE: si puù includere una versione delle API
  - `/v1`
- Ogni risorsa usa il nome PLURALE in quanto a quel nome si compiono le operazioni generiche su tutte le istanze di quella risorsa
  - `/utenti`
- Se si vuole accedere ad una singola istanza di quella risorsa, si mette l'ID di tale istanza dopo la risorsa stessa nel path
  - `/utenti/<id>`
- Le risorse possono essere innestate, avendo relazioni con le risorse superiori
  - `/utenti/<id>/ordini`
- Ci possono essere dei Query Params che permettono di personalizzare la risposta

Questa è una struttura generica: [Base URL]/[Versione]/[Risorsa]/[ID Risorsa]/[Sotto-risorsa]?[Parametri Query]

### HTTP Methods

Ogni HTTP Method ha uno scopo preciso nelle REST ed interagisce con la risorsa in un certo modo.

Proprietà dei metodi:

- IDEMPOTENZA: un metodo è idempotente se chiamandolo più volte, il risultato sul server non cambia. Può cambiare lo stato sul server. Questo non significa che il server non possa rispondere in modo diverso a 2 chiamate consecutive. Per esempio DELETE è idempotente, perchè una risorsa cancellata resta cancellata ad una seconda chiamata, ma il server risponderà in modo diverso se la risorsa non è più presente
- SICURO: non cambia lo stato o i dati sul server
- CACHABLE: la risposta può essere cachata

Funzionamento dei metodi:

- **GET**:
  - Scopo: recuperare i dati di una risorsa
  - IDEMPOTENTE: eseguendo più volte la request, non cambia lo stato sul server
  - SICURO: Non modifica i dati sul server
  - CACHABILE: Si può cachare
- **POST**:
  - Scopo: creare una nuova risorsa
  - NON è IDEMPOTENTE: eseguendo più volte la request si possono creare duplicati o avere errori
- **PUT**:
  - Scopo: aggiornare o sostituire completamente una risorsa. Quindi questo update rimuove i campi vuoti del body, visto che influenza tutte le proprietà della risorsa
  - IDEMPOTENTE: eseguendo più volte la request, non cambia lo stato sul server e la risorsa viene riaggiornata sempre con lo stesso valore
- **PATCH**:
  - Scopo: aggiornare parte delle proprietà di una risorsa. Quindi se faccio un update, i campi vuoti non vengono influenzati.
  - NON è RICHIESTO CHE SIA IDEMPOTENTE: le regole non impongono che questo metodo sia idempotente, ma per sua natura molto spesso lo è. Comunque il client non si può aspettare che lo sia, quindi lo deve considerare NON IDEMPOTENTE
- **DELETE**
  - Scopo: eliminare una risorsa
  - IDEMPOTENTE: eliminare più volte una risorsa non cambia il risultato, anche se il server comunque potrebbe rispondere in modo diverso se la risorsa prima c'era ed è stata cancellata e poi alla seconda chiamata non c'è più
- **OPTIONS**
  - Scopo: recupera le optioni disponibili per una risorsa, quindi quali metodi posso chiamare
  - IDEMPOTENTE
  - SICURO
  - CACHABILE
- **HEAD**
  - Scopo: simile a GET ma restituisce solo gli header della risposta. Utile per verificare l'esistenza di una risorsa o controllare i metadati
  - IDEMPOTENTE
  - SICURO
  - CACHABILE

## Principio HATEOAS

Si tratta di un principio che aiuta ad implementare le RESTFul al meglio.

> Un client deve poter navigare l’applicazione solo seguendo i link (hypermedia) forniti dal server nelle risposte.

Sostanzialmente, quando si ricevono i risultati di una risorsa, nel body si hanno anche i link alle operazioni che si possono fare su quella risorsa. In questo modo il client può basarsi su quello invece di dover conoscere a priori tutti gli endpoint.

Esempio:
GET /ordini/123

```JSON
{
  "id": 123,
  "stato": "in lavorazione",
  "link": {
    "annulla": "/ordini/123/annulla",
    "tracking": "/ordini/123/tracking"
  }
}
```

Nella sezione link, ci sono le operazion "annulla" e "tracking" che potrei compiere.

Vantaggi:

- Disaccoppiamento tra client e struttura delle API
- Il server può cambiare la sua struttura senza rompere il client, visto che si basa su dei campi ritornati e non su una struttura fissa
- Navigazione dinamica come se il client fosse un browser che segue i link delle pagine

Svantaggi:

- L'url non basta per sapere come chiamare il metodo, a volte serve anche il metodo, il body, eventuali header

Per ovviare al problema di avere ogni dettaglio sulla chiamata da eseguire, devono usare delle strutture standard di descrizione delle operazioni possibili come **HAL-FORMS**, **Siren** o **JSON:API**. Inoltre l'utilizzo di Swagger/OpenAPI per documentare le API aiuta notevolmente la comprensione.

**HAL-FORMS** e **Siren** strutturano i link per permettere di avere tutti i valori che servono per chiamare le operazioni.

**[JSON:API](https://jsonapi.org/)** è uno STANDARD REST che permette di strutturare tutte le chiamate con lo stesso tipo di struttura, rendendole più intuibili, ma non danno garanzia di sapere esattamente come strutturarle.
Questo tipo di struttura è molto comune nelle API REST

### JSON:API

**[JSON:API](https://jsonapi.org/)** ha una struttura standard per le REST che rende tutte le chiamate simili e quindi più chiare. Prendiamo un esempio:

```JSON
{
  "data": {
    "type": "articoli",
    "id": "42",
    "attributes": {
      "titolo": "Scoprire le API REST con JSON:API",
      "contenuto": "Le API RESTful ben strutturate semplificano la comunicazione client-server.",
      "data_pubblicazione": "2025-07-13"
    },
    "relationships": {
      "autore": {
        "links": {
          "self": "/articoli/42/relazioni/autore",
          "related": "/autori/7"
        },
        "data": { "type": "autori", "id": "7" }
      },
      "commenti": {
        "links": {
          "self": "/articoli/42/relazioni/commenti",
          "related": "/articoli/42/commenti"
        },
        "data": [
          { "type": "commenti", "id": "101" },
          { "type": "commenti", "id": "102" }
        ]
      }
    },
    "links": {
      "self": "/articoli/42"
    }
  },
  "included": [
    {
      "type": "autori",
      "id": "7",
      "attributes": {
        "nome": "Giulia Rossi",
        "email": "giulia@example.com"
      },
      "links": {
        "self": "/autori/7"
      }
    },
    {
      "type": "commenti",
      "id": "101",
      "attributes": {
        "testo": "Articolo molto utile!",
        "data": "2025-07-12"
      },
      "links": {
        "self": "/commenti/101"
      }
    },
    {
      "type": "commenti",
      "id": "102",
      "attributes": {
        "testo": "Finalmente un esempio chiaro!",
        "data": "2025-07-13"
      },
      "links": {
        "self": "/commenti/102"
      }
    }
  ]
}
```

- type, id e attributes descrivono i dati principali della risorsa
- relationships definisce i collegamenti ad altre risorse, con data e links
- included contiene le risorse correlate in modo “embedded” per ridurre le chiamate HTTP
- links aiuta il client a navigare tra le risorse, rendendo l'API scoperta dinamicamente

## OpenAPI

OpenAPI è lo standard per descrivere formalmente una API RESTFul in ogni sua forma.

Tramite OpenAPI si può avere un OpenAPI Schema che permette di definire una struttura per descrivere in modo chiaro e leggibile un API RESTFul utilizzando JSON o YAML. Può essere utile per:

- Generare documentazione automatica (SwaggerUI)
- Validare request e response
- Generare automaticamente client/server in vari linguaggi
- Testare l'API
