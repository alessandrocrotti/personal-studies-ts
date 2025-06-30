# Behavioral patterns

I behavioral pattern si concentrano su come gli oggetti interagiscono tra di loro e si distribuiscono le responsabilità

## Template

**Si definisce una struttura comune di algoritmo ad alto livello composta da metodi abstract che verranno poi implementati dalle sottoclassi.**

Questo permette di avere una struttura comune che funziona uguale per tutti gli oggetti che derivano da questo oggetto standard, ma determinare logiche differenti e specifiche nelle sottoclassi.
Si considera un template, perchè hai dei metodi astratti che fanno da placeholder nell'algoritmo e che vengono popolati dalle sottoclassi.

Esempio di una preparazione di una bevanda:

- tutte le bevande hanno in comune il metodo `prepare()` composto da metodi differenti, alcuni astratti
- quando estendo la classe astratta per creare una specifica bevanda, implemento i metodi astratti
- a questo punto tutte bevande potranno chiamare `prepare()` senza dover duplicare il codice

## Mediator

**Quando molti oggetti devono interagire tra loro, invece di interagire direttamente, si creà una classe intermedia che si occupa della comunicazione tra gli oggetti**

In questo modo si sposta la complessità dai singoli oggetti, delegandola ad un oggetto il cui scopo è specifico.

Esempio classico, la chat:

- Posso avere tanti user che si scambiano messaggi
- Invece di mettere le logiche di invio messaggi sui singoli User, il singolo user chiama solamente il mediator
- Il mediator contiene le logiche per la comunicazione e interazione tra gli oggetti user

## Chain of responsability

**Si crea una catena di oggetti che devono gestire una richiesta, ad ogni elemento della catena si verifica se la richiesta è di sua competenza oppure se è da passare al successivo elemento della catena, fino a che non si trova chi se ne occupa**

Si implementa come una sorta di linked list dove ogni elemento della catena ha un riferimento al prossimo e un metodo `handle()`. Se il metodo `handle()` soddisfa la richiesta, si ritorna il valore o si compie l'azione, altrimenti si chiama `handle()` del nodo successivo fino a raggiungere l'ultimo.

Catena di approvazione:

- si hanno tanti ruoli e ognuno ha un metodo `handle()` con delle condizioni di applicazione
- La request viene mandata ad un elemento della catena, solitamente il primo
- Se la request non soddisfa le condizioni per quel livello, si fa escalation al nodo superiore
- L'ultimo nodo dovrà gestire la mancata escalation se anche lui non riesce a soddisfare la condizione

Un altro contesto in cui si può utilizzare sono i messaggi di log:

- Ogni logscope è un nodo della catena con un valore
- Quando si chiede di scrivere il log con un certo scopo, si manda il messaggio e lo scope alla catena
- Quando lo scope è lo stesso del nodo della catena, questo scriverà il messaggio nel contesto corretto, altrimenti manderà il messaggio al livello successivo

## Observer

**Permette di legare tanti oggetti ad un singolo oggetto, in modo che quando questo singolo oggetto viene modificato, gli altri oggetti legati vengono notificati della modifica e possono agire di conseguenza.**

Struttura:

- **Subject**: il singolo oggetto che accetta di raccogliere gli observer e contiene il valore che viene modificato
- **Observers**: classi che implementano l'interfaccia Observer, legata al Subject. In questo modo quando il Subject viene modificato, chiama per tutti gli observer raccolti il metodo update() per nofificare la modifica

Vantaggi:

- disaccoppiamento tra subject e observers
- si possono aggiungere o rimuovere observer runtime
- reattività in tempo reale alle modifiche

## Strategy

**Permette di disaccoppiare il comportamento di un oggetto dal suo contesto, dichiarando nel contesto che strategy usare, il contesto la richiamerà senza preoccuparsi della logica.**

Puoi quindi definire gli oggetti strategy che definiscono una logica e applicare runtime la strategy che ti serve all'oggetto contenitore.

Un esempio può essere che strategia di pagamento utilizzare:

- Ho un oggetto contenitore che è il mio basket su cui è definito il payment method scelto
- L'oggetto del basket che si occupa del pagamento è generico, ma accetta che gli venga settata una strategy con una interfaccia `pay()`
- Per ogni payment method, si implementa l'interfaccia strategy e quindi il metodo `pay()`
- Sulla base del payment method, si istanzia la strategy relativa che si usa per pagare

Questo ha il vantaggio di aggiungere nuove strategie senza toccare il codice esistente, come da principi SOLID.

## Command

**Si tratta di una struttura che incapsula certe classi che rappresentano i comandi, questi vengono concretamente eseguiti da un oggetto che li riceve e il tutto viene gestito da un oggetto che invoca i comandi.**

Questa struttura disaccoppia le parti in cui:

- Receiver: si occupa solamente di avere le logiche generiche di esecuzione a basso livello
- Invoker: si occupa di gestire/raccogliere ed eseguire i comandi, senza sapere cosa faranno di specifico
- Command: hanno un metodo `execute()` che appoggiandosi al Receiver definisce le logiche specifiche di esecuzione si un comando

Quindi si struttura in questo modo:

- Creo un command che ha il receiver come parametro. Il command usa il receiver per definire il metodo `execute()`
- Creo l'invoker e lo uso per eseguire un command. Nel momento che chiamo `execute()` dell'invoker, questo chiamerà in cascata `execute()` del comando

## State

**Permette di ridefinire runtime il comportamento di una classe contesto, sulla base della sua classe stato corrente**

Permette di gestire una classe contesto come una macchina a stati finiti:

- Ogni stato definisce come funzioneranno i metodi del contesto
- Il contesto inizia con un certo stato
- Chiamando determinati metodi del contesto con un certo stato, vengono eseguite delle logiche e lo stato avanza cambiando anche il comportamento stesso del contesto

Si può anche evitare di gestire l'avanzamento di stato del contesto e gestirlo manualmente da fuori. In tal caso gli stati non averbbero bisogno del contesto stesso come parametro perchè sarebbero semplicemente delle ridefinizioni dei metodi del contesto senza interazioni con esse (come era invece l'avanzamento di stato nel contesto dopo l'esecuzione di un certo metodo)

In questo modo si ha un comportamento modulare, estendibile con nuovi stati.

## Interpreter

**Permette di strutturare in classi che eseguono delle espressioni, il passaggio di alcuni valori da un "linguaggio" ad un altro. Per questo motivo è un interprete: prende dentro dei dati e li trasforma in altri**

Struttura:

- si creano una interfaccia `Interpreter` con il metodo `interpret` da utilizzare in tutte le espressioni
- Le espressioni sono classi che prendono il dato iniziale e tramite la funzione `interpret` lo trasformano
- Le espressioni si possono comporre e richiamare l'una con l'altra, se servisse
- Una volta eseguita l'espressione, si ottiene un valore che si può utilizzare come si vuole

Può essere utile per trasformare un linguaggio composto da condizioni semplici in un altro. Se il linguaggio fosse troppo complesso, meglio usare un parser.
IL vantaggio è che è facilmente estendibile con nuove expression.

## Iterator

**Crea una struttura per iterare un oggetto indipendentemente dal suo tipo, definendo semplicemente come scorrerlo.**

Struttura:

- Si crea una interfaccia con i metodi `next()` e `hasNext()`
- Si applica all'oggetto che si vuole rendere iteratore. Questo oggetto conterrà i dati su cui scorrere, la posizione corrente e su questi potrà eseguire i metodi `next()` e `hasNext()`

Vantaggi:

- si può rendere un oggetto scorrevole senza saperne la sua struttura interna
- Potresti renderla più avanzata per scorrerlo in maniera più complessa avanti e indietro

https://www.w3schools.blog/java-behavioral-design-patterns
