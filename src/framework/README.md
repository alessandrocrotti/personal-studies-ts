# Framework

Descrizione dei framework utilizzati in contesti NodeJS e Typescript

## Backend

- **NestJS**:
  - Adatto a applicazioni enterprise di un'alta complessità che richiedono una architettura complessa
  - Simile a SpringBoot di JAVA
  - Architettura modulare
  - Supporto per GraphQL, WebSocket, testing e altri API paradigms tramite plugin
  - Scalabile
  - Complesso con una curva di apprendimento ripida
- **Fastify**
  - Adatto ad applicazioni che espongono un layer di API che richiedono alte prestazioni
  - Abbastanza strutturato, con validazioni e plugin
  - Più semplice di NestJS ma comunque con un suo livello di complessità
- **Express**
  - Molto utilizzato per applicazioni semplici che espongono API
  - Struttura minimale e molto semplice, lo rende adatto per cose semplici
  - Facile per iniziare ma poco strutturato
  - Si può inizializzare un progetto complesso tramite il comando
    - JS: `npx express-generator`
    - TS: `npx express-generator-typescript`

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
