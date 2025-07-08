# RabbitMQ

- [RabbitMQ](#rabbitmq)
- [Descrizione](#descrizione)
- [Installazione](#installazione)
- [Utilizzo](#utilizzo)

# Descrizione

Si tratta di un Broker di messaggi su protocollo AMQP. Gestiste la connessione con _producer_ e _consumer_ per gestire integrazioni asyncrone tra sistemi diversi.

# Installazione

Tramite il file `docker-compose.yml` si può configurare l'installazione di RabbitMQ come container docker, con un relativo volume per poter conservare i messaggi.

Creazione del container tramite docker compose:

```shell
cd src/tools/rabbit-mq
docker-compose up -d
```

Nel caso fosse necessario cancellare sia il container che il relativo volume:

```shell
cd src/tools/rabbit-mq
docker-compose down -v
```

# Utilizzo
