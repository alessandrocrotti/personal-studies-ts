# Behavioral patterns

- [Behavioral patterns](#behavioral-patterns)
  - [Descrizione](#descrizione)
  - [Template](#template)
  - [Mediator](#mediator)
  - [Chain of responsability](#chain-of-responsability)
  - [Observer](#observer)
  - [Strategy](#strategy)
  - [Command](#command)
  - [State](#state)
  - [Interpreter](#interpreter)
  - [Iterator](#iterator)

## Descrizione

I behavioral pattern si concentrano su come gli oggetti interagiscono e comunicano tra di loro e si distribuiscono le responsabilità.

## Template

**In una classe, solitamente astratta, si definisce una lo scheletro di un algoritmo ad alto livello composta da vari metodi, di cui alcuni abstract o vuoti, che verranno poi implementati dalle sottoclassi per permettere una personalizzazione controllata.**

Questo permette di avere una struttura comune che funziona uguale per tutti gli oggetti che derivano da questo oggetto standard, ma determinare logiche differenti e specifiche nelle sottoclassi.
Si considera un template, perchè hai dei metodi astratti che fanno da placeholder/hook nell'algoritmo e che vengono popolati dalle sottoclassi.

Esempio di una preparazione di una bevanda:

- tutte le bevande hanno in comune il metodo `prepare()` composto da diversi metodi, alcuni astratti
- quando estendo la classe astratta per creare una specifica bevanda, implemento i metodi astratti
- a questo punto tutte bevande potranno chiamare `prepare()` senza dover duplicare il codice
- il metodo `prepare()` è invariable e non viene sovrascritto, in quanto esso stesso è lo scheletro dell'algoritmo

## Mediator

**Quando molti oggetti devono interagire tra loro, invece di interagire direttamente, si creà una classe intermedia che si occupa della comunicazione tra gli oggetti**

In questo modo si sposta la complessità dai singoli oggetti, delegandola ad un oggetto il cui scopo è specifico. Si riducono le dipendenze dirette tra gli oggetti, centralizzando e disaccoppiando le logiche di comunicazione nell'oggetto mediatore che ha il ruolo di orchestratore.

Esempio classico, la chat:

- Posso avere tanti user che si scambiano messaggi
- Invece di mettere le logiche di invio messaggi sui singoli User, il singolo user chiama solamente il mediator
- Il mediator contiene le logiche per la comunicazione e interazione tra gli oggetti user

## Chain of responsability

**Si definisce una catena di oggetti handler in cui ognuno deve decidere se gestire la richiesta o delegarla al successivo oggetto nella catena, fino a che non si trova chi se ne occupa**

Si implementa come una sorta di linked list dove ogni elemento della catena ha un riferimento all'elemento successivo, rendendo la catena dinamica e modificabile, e un metodo `handle()`. Se il metodo `handle()` soddisfa la richiesta, si compie l'azione e si ritorna il valore, altrimenti si chiama `handle()` del nodo successivo fino a raggiungere l'ultimo. Questo permette di disaccoppiare chi fa la richiesta e chi la riceve.

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

**Permette di legare tanti oggetti ad un singolo oggetto, in modo che quando questo singolo oggetto (Subject) viene modificato, gli altri oggetti legati (Observer) vengono notificati della modifica e possono agire di conseguenza.**

Struttura:

- **Subject**: il singolo oggetto che accetta di raccogliere gli observer e contiene il valore che viene modificato
- **Observers**: classi che implementano l'interfaccia Observer, legata al Subject. In questo modo, quando il Subject viene modificato, chiama per tutti gli observer raccolti il metodo update() per nofificare la modifica

Vantaggi:

- disaccoppiamento tra subject e observers, dove il subject non conosce i dettagli degli observer
- si possono aggiungere o rimuovere observer runtime
- reattività in tempo reale alle modifiche, utilizzato in sistemi ad eventi e architetture reattive

## Strategy

**Permette di disaccoppiare l'algoritmo di un oggetto dal suo contesto. Si creano una delle classi strategi intercambiabili, che implementano la stessa interfaccia, e il contesto riceve esternamente che strategy usare in un certo momento. In questo modo il contesto eseguirà l'algoritmo della stragegy ricevuta senza preoccuparsi della logica contenuta.**

Puoi quindi definire gli oggetti strategy che definiscono una logica e applicare runtime la strategy che ti serve all'oggetto di contesto. Questo ha il vantaggio di aggiungere nuove strategie senza toccare il codice esistente, come da principi SOLID.

Un esempio può essere che strategia di pagamento utilizzare:

- Ho un oggetto basket su cui è definito il payment method scelto
- L'oggetto del basket ha un oggetto di contesto che si occupa del pagamento, che accetta una strategy con una interfaccia che dichiara il metodo `pay()`
- Per ogni payment method, si crea una classe che implementa l'interfaccia strategy e quindi il metodo `pay()`
- Sulla base del payment method, si istanzia la strategy relativa che si usa per pagare

## Command

**Si tratta di una struttura che incapsula certe classi che rappresentano i comandi, questi vengono concretamente eseguiti da un oggetto che li riceve e il tutto viene gestito da un oggetto che invoca i comandi.**

Questa struttura disaccoppia le parti in cui:

- **Receiver**: contiene le logiche generiche di esecuzione a basso livello che verranno richiamate dai command
- **Command**: ogni command riceve il receiver, in quanto vero contenitore delle logiche; hanno un metodo `execute()` che usando il Receiver con opportuni parametri esegue le logiche specifiche di un comando
- **Invoker**: si occupa di gestire/raccogliere e richiedere di eseguire i comandi, senza sapere cosa faranno di specifico. Questo puù gestire anche la lista di command, fare l'undo, metterli in coda
- **Client**: crea i comandi, li configura e li passa all'invoker, chiedendo di eseguirli o di fare undo

Quindi si struttura in questo modo:

- Creo un command che ha il receiver come parametro.
- Ogni command usa il receiver per definire cosa fa il metodo `execute()`
- Creo l'invoker e lo uso per ricevere e richiedo di eseguire un command: nel momento che chiamo `execute()` dell'invoker, questo chiamerà in cascata `execute()` del comando che a sua volta chiamerà il metodo del receiver con gli opportuni parametri

## State

**Permette di delegare il comportamento di una classe contesto alla sua classe stato interno corrente. Cambiando lo stato interno cambi il comportamento dell'oggetto contesto.**

Permette di gestire una classe contesto come una macchina a stati finiti:

- Ogni stato definisce come funzioneranno i metodi del contesto
- Il contesto inizia con un certo stato interno
- I metodi del contesto che ha assunto un certo stato interno possono eseguire le logiche specifiche determinate dallo stato interno stesso. Il metodo che si esegue può anche cambiare lo stato interno ad uno stato successivo, cambiando automaticamente anche il comportamento stesso del contesto
  - Non è detto che ogni stato possa eseguire ogni metodo del contesto, anzi, è possibile che solo un sottoinsieme di metodi siano accettabili a seconda dello stato e gli altri restituiscano un errore o un informazione che quel metodo non è utilizzabile per lo stato corrente
- In questo modo si evitano eventuali catene di ifelse o switch che gestiscono le casistiche

Normalmente il cambio di stato interno è determinato dai metodi stessi di ogni stato, ma volendo è possibile gestirlo gestirlo manualmente da fuori. In tal caso gli stati non avrebbero bisogno del contesto stesso come parametro perchè sarebbero semplicemente delle ridefinizioni dei metodi del contesto senza interazioni con esse (come era invece l'avanzamento di stato nel contesto dopo l'esecuzione di un certo metodo)

In questo modo si ha un comportamento modulare, estendibile con nuovi stati.

## Interpreter

**Permette di definire una rappresentazione grammaticale di un linguaggio e di fornire un interprete per valutare frasi scritte in quel linguaggio. Ogni regola grammaticale è rappresentata da una classe, e le espressioni possono essere composte gerarchicamente per interpretare strutture complesse.**

Struttura:

- si creano una interfaccia `Interpreter` con il metodo `interpret` da utilizzare in tutte le espressioni
- Ci sono le TerminalExpression che rappresentano un simbolo atomico della grammatica che non può essere scomposto, come un carattere, un numero o un booleano
- Ci sono le NonTerminalExpression che sono combinazioni di TerminalExpression, come gli operatori logici "AND", "OR", ma anche delle operazioni come "ADD" o "SUB"
- Le TerminalExpression sono le foglie dell'albero sintattico, mentre le NonTerminalExpression sono i nodi interni di quell'albero
- Componendo le expression si può ottenere un risultato come se fosse un linguaggio

Può essere utile per definire un linguaggio semplice da utilizzare tramite composizione di classi. Se il linguaggio fosse troppo complesso, meglio usare un parser.
Il vantaggio è che è facilmente estendibile con nuove expression.

## Iterator

**Consente di accedere sequenzialmente agli elementi di una collezione (lista, albero, set, ecc.) senza esporne la struttura interna. Il pattern definisce un oggetto iteratore separato che incapsula la logica di attraversamento, permettendo di iterare su collezioni diverse in modo uniforme e indipendente dalla loro implementazione.**

Struttura:

- Si crea una interfaccia con i metodi `next()` e `hasNext()`
- Si applica alla classe che gestirà la collezione come iteratore. Questo oggetto conterrà i dati su cui scorrere, la posizione corrente e su questi potrà eseguire i metodi `next()` e `hasNext()`
- Per redere più avanzato e disaccoppiato il contenuto dell'iterator dalla sua costruzione, si crea una interfaccia con metodo `createIterator()` che possa implementare la logica per restituire da una collezione un iteratore
- Questa interfaccia si applica ad una classe separata dall'iteratore

Vantaggi:

- si può rendere un oggetto scorrevole senza saperne la sua struttura interna
- permette iterazioni simultanee
- Potresti renderla più avanzata per scorrerlo in maniera più complessa avanti e indietro
- Utilizzando la collection con l'interfaccia `createIterator()` si soddisfano i principi SOLID di disaccoppiamento
