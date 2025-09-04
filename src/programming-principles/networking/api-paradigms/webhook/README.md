# WebHook

- [WebHook](#webhook)
  - [Descrizione](#descrizione)
  - [Implementazione](#implementazione)

## Descrizione

Si tratta di un endpoint messo a disposizione da un server o un client che viene chiamato da un server per inviare una notifica quando avviene un evento.
Al contrario di una chiamata REST dove logicamente il client manda una request e il server elabora e risponde, nel WebHook il server che ha l'informazione dell'evento chiama direttamente l'altro server o il client su un webhook esposto per inviargli immediatamente l'informazione.

In questo contesto, il significato di server è da chiarire:

- Nel contesto della chiamata HTTP, il _Client_ è chi chiama e il _Server_ è chi risponde
- Ma nel contesto dei WebHook il _Server_ è chi ha l'informazione e il _Client_ che la deve ricevere
  - Quando il _Server_ ha l'informazione, la manda immediatamente al _Client_ senza che questo gli debba fare una richiesta. Per questo motivo è come se i ruoli fossero invertiti

## Implementazione

L'implementazione del client che riceve i dati del WebHook è analoga ad un qualsiasi endpoint HTTP. Considerando che si possono ricevere vari eventi, vale la pena fare questi passaggi:

- Validare il JSON ricevuto e rispondere con 400 se sbagliato
- Avere un ID nel JSON per verificare di non applicare più volte lo stesso messaggio
- Avere un APIKey che viene passato come header da chi chiama a chi riceve la chiamata per verificare che sia autorizzato, altrimenti rispondere con 403
- Avere un Type per distinguere come utilizzare il messaggo ricevuto
- Proteggere l'endpoint tramite un rate-limit per evitare eventuali DDoS attack
- Se l'elaborazione è complessa, si potrebbe mettere l'evento dal WebHook dentro una coda di RabbitMQ o in un worker separato di BullMQ per consumarla in maniera strutturata
- Volendo chi riceve il messaggio può anche rispondere 202 Accepted dopo le validationi ma prima dell'elaborazione del messaggio, in modo da gestire l'elaborazione in maniera asincrona
