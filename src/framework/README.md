# Framework

Descrizione dei framework utilizzati in contesti NodeJS e Typescript

## Backend

- **NestJS**:
  - Adatto a applicazioni enterprise di un'alta complessità che richiedono una architettura complessa
  - Simile a SpringBoot di JAVA
  - Architettura modulare
  - Supporto per GraphQL, WebSocket, testing e altri API paradigms tramite plugin
  - Scalabile
  - Si può basare o su Express o su Fastify
  - Complesso con una curva di apprendimento ripida
  - Si può inizializzare un progetto complesso tramite il comando:
    - prima installare la cli `npm install -g @nestjs/cli`
    - poi eseguire il comando `nest new example-app`
- **Fastify**
  - Adatto ad applicazioni che espongono un layer di API che richiedono alte prestazioni
  - Abbastanza strutturato, con validazioni e plugin
  - Più semplice di NestJS ma comunque con un suo livello di complessità
  - Si può inizializzare un progetto complesso tramite il comando:
    - JS: `npx fastify-cli generate example-app`
    - TS: `npx fastify-cli generate example-app --lang=ts`
- **Express**
  - Molto utilizzato per applicazioni semplici che espongono API
  - Struttura minimale e molto semplice, lo rende adatto per cose semplici
  - Facile per iniziare ma poco strutturato
  - Si può inizializzare un progetto complesso tramite il comando:
    - JS: `npx express-generator`
    - TS: `npx express-generator-typescript`

### From Scratch

Quando si vuole fare un progetto partendo da zero, si devono scegliere 2 strade, se usare CommonJS o ES-Module:

- **CommonJS** è la gestione più vecchia, ma anche più stabile del codice JS. Ci sono diversi tool che lavorano bene e spesso non si hanno problemi nelle configurazioni. Per i progetti backend solitamente va benissimo, mentre i frontend utilizzano ES-Module. Normalmente tutti i backend usano questo attualmente
- **ES-Module** è la gestione più moderna a moduli ES, dove si possono usare import/export invece di required, ci sono più restrizioni e più specificità nelle configurazioni, ma anche le funzionalità aggiuntive. Solitamente utilizzato per i progetti frontend, ma attraverso dei builder che trasformano il codice in modo che sia compatibile coi browser. Forse in futuro si potrebbe passare a questo, ma per questione di retrocompatibilità non è ancora in atto questo processo

Configurazioni importanti:

- **CommonJS**
  - se in `package.json` non è presente nessun attributo `type` oppure è `"type": "commonjs",` allora si sta usando CommonJS
    - I progetti frontend solitamente non mettono questo attributo perchè sono i builder dei framework che manipolano il codice per renderlo ottimizzato per i browser, quindi questo attributo viene ignorato
  - se in `tsconfig.json` si possono usare diverse combinazioni
    - `"module": "commonjs",` e `"moduleResolution": "node10",`, si esplicita che si sta usando CommonJS, ma si possono utilizzare altre properties per usare gli import/export come `"esModuleInterop" = "true",` e `"allowSyntheticDefaultImports": true,`.
    - `"module": "node16",` e `"moduleResolution": "node16",`, introduce le alcune funzionalità ES-Modules
    - `"module": "NodeNext",` e `"moduleResolution": "nodenext",`, è compatibile con ES-Modules. **Sarebbe la configurazione preferibile**
  - Se si vuole esplicitare che un file è da interpretare come CommonJS devi mettere l'estensione `.cjs` o `.cts`, altrimenti i `.js` o `.ts` vengono intepretati secondo le relative configurazione di `type` e `module` in `package.json` e `tsconfig.json`
- **ES-Module**
  - e in `package.json` è `"type": "module",` allora si sta usando ES-Module
  - la compilazione potrebbe avere dei problemi tramite `tsc` perchè gli import risultanti non hanno l'estensione esplicita e questo crea problemi. Si deve quindi passare per dei builder come `esbuild`.
    - Quando si configura il `tsconfig.json` con `"module": "NodeNext",` e `"moduleResolution": "nodenext",` e si mette nel `package.json` `"type": "module",`, gli import sono automaticamente con l'estensione e anche `tsc` compila correttamente
  - in `tsconfig.json` vale la pena mettere `"module": "NodeNext",` se si vuole usare ES-Module
  - se si vuole utilizzare un motore di esecuzione per typescript bypassando la compilazione, conviene installare e usare `tsx` che è compatibile per ES-Module, anche se non ha il type checker (che puoi fare a parte usando `tsc --noEmit`).
  - Se si vuole esplicitare che un file è da interpretare come CommonJS devi mettere l'estensione `.mjs` o `.mts`, altrimenti i `.js` o `.ts` vengono intepretati secondo le relative configurazione di `type` e `module` in `package.json` e `tsconfig.json`

Riassumento, la migliore configurazione è:

- nel `tsconfig.json`: `"module": "NodeNext",` e `"moduleResolution": "nodenext",`
- nel `package.json`:
  - senza `type` per il CommonJS
  - con `"type": "module",` per ES-Module

Con questa configurazione si gestiscono bene sia gli import/export che l'eventuale migrazione da un type all'altro e la scrittura del codice rispecchia comunque il formato ES-Module.

## Frontend

- **Angular**
  - Framework completo
  - Architettura solida
  - Complesso da imparare
- **React**
  - Basato su componenti riutilizzabili e modulari
  - Richiede configurazioni iniziali
  - Si possono aggiungere plugin ulteriori
- **NextJS**
  - Un'evoluzione di React che aggiunge funzionalità
  - Semplifica la gestione di React
  - Aggiunge complessità
- **Vue**
  - Leggero e facile da imparare
  - Meno strutturato
