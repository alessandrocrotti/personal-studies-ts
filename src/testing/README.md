# Test Automatici

- [Test Automatici](#test-automatici)
  - [Descrizione](#descrizione)
  - [Unit Test](#unit-test)
  - [Integration Test](#integration-test)
  - [E2E (End to End) Test](#e2e-end-to-end-test)
  - [Performance Test](#performance-test)

## Descrizione

Ci sono numerosi tipi di test automatici che si possono implementare, ognuno con delle specificità. Anche se possono essere banali da scrivere, può non essere banale scriverli bene e che diano un vero valore aggiunto. Ci sono vari framework per creare i test che dipendono dal linguaggio di programmazione da testare e il tipo di test.

Esiste un concetto chiamato **Testing Pyramid** che più si sale più è richiesta integrazione e più si scende e più è un tipo di test isolato. Sostanzialmente è fatta così:

- Punta: End-to-End/UI Test: Sono i test di più alto livello e permettono di eseguire test direttamente dall'interfaccia dell'applicazione, comprendendo le interazioni con gli elementi esterni. Sono più complessi e costosi.
- Metà: Integration/Service Test: Permette di testare il tuo codice comprendendo le interazioni con gli elementi esterni alla tua applicazione. Per esempio si interagisce realmente con il database o API esterne
- Base: Unit Test. Coprono piccole unità di codice isolate, facendo i Mock degli elementi esterni a quella parte di codice che si vuole isolare. Sono veloci e facili da automatizzare perchè non hanno interazioni esterne e lavorano sul codice direttamente.

Questi test descritti dalla **Testing Pyramid** hanno lo scopo di verificare che il codice sia corretto e funzionante. Ci sono anche altri tipi di test, come i **Performance Test** che hanno lo scopo di verificare i limiti dell'infrastruttura e il comportamento dell'applicazione stotto stress.

## Unit Test

Lo scopo degli Unit Test sarebbe di:

- Documentare il codice: mostrando quali casistiche di input e output un certo metodo può gestire. Questo viene fatto leggendo i titoli dei singoli test.
- Validare le ipotesi: noi diamo per scontato certe cose dal mondo esterno, il test deve validarle
- Aumentare la sicurezza del codice: fare in modo di prevenire eventuali errori futuri

Ha senso fare uno Unit Test quando un metodo ha una logica interna e non semplicemente quando chiama un altro metodo restituendone il risultato. Inoltre è importante fare gli Unit Test per gestire il **branching**, cioè le ramificazioni di comportamento che il codice può avere a causa di "if statement" o analoghi.

La struttura di uno Unit Test dovrebbe seguire la struttura **AAA**:

- **Arange**: setup dei valori che ti servono per eseguire i test (come le costanti che servono come input o output)
- **Act**: eseguire il test che si vuole effettivamente testare
- **Assert**: mettere tutte le "expect" che sono le funzioni che controllano che quel comportamento dato dal test sia corretto. Solitamente si dovrebbe fare una assertion per test, quindi fare nomi di test specifici in modo che quando fallisce la singola assertion sai cos'è fallito.

## Integration Test

Gli integration test nel contesto del backend si sovrappongono spesso al concetto di E2E Test. Questo perchè negli integration test si cerca di non mockare elementi del backend: se non si mocka alcun elemento allora è sovrapposto all'e2e, altrimenti se si mocka qualche elemento mentre non si mocka quei componenti che devono interagire e che si vogliono testare, allora è più un integration test. Per esempio, se mocko il DB ma non le chiamate tra controller e service, allora questo è più un integration test mirato a quell'interazione.

Un esempio in NestJS è l'utilizzo del framework chiamato `supertest` che crea una applicazione al volo per eseguire il test stesso.

## E2E (End to End) Test

Come spiegato negli [Integration Test](#integration-test), gli E2E nel contesto di backend hanno lo scopo di effettuare dei test senza mockare nulla. Questo significa che si deve predisporre magari dei DB in memory o qualche componente dedicato ai test per gestire certe particolari interazioni, ma alla fine il risultato è un flusso completo che permette di verificare l'intero codice.

È importante menzionare anche gli E2E testing a livello di Frontend per web application, che possono essere fatti con applicazioni come `Cypress` che simulano la navigazione di un utente sul browser. Questo quindi solitamente si comporta esattamente come si comporterebbe un utente o un tester che esegue certi scenari.

## Performance Test

Al contrario degli altri test, questo tipo di test non verifica che il codice sia funzionante, ma lo carica per cercarne i limiti e vedere se può sopportare un traffico stimato che l'applicazione potrebbe ricevere. Ci sono strumenti classici come `JMeter`, ma anche più moderni come `K6` che permettono di eseguire numerose chiamate, tramite il concetto di VU (Virtual User), su delle API che l'applicazione espone. Grazie a questo test, si possono ottenere metriche in caso di Stress (carico prolungato), scoprire il punto di rottura, verificare il recovery al diminuire del carico, verificare che regga il carico pronosticato per l'applicazione, individuare colli di bottiglia nei flussi e sistemarli.
