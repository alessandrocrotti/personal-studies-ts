# MySql

Database relezionale gratuito

## Installazione

Si può installare tramite docker, sia col comando diretto che col docker-compose.

```shell
docker volume create mysql_data
docker run -d \
  --name mysql-8.4.5-lts \
  -p 3306:3306 \
  -v mysql_data:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  mysql:lts
```

Io preferisco il docker-compose perchè rimane il file e si può versionare e aggiornare:

```shell
cd src/database/mysql
docker-compose up -d
```

Nel caso fosse necessario cancellare sia il container che il relativo volume:

```shell
cd src/database/mysql
docker-compose down -v
```

## Funzionamento

Essendo un database relazionale, si possono usare varie librerie che gestiscono gli ORM nei vari linguaggi. Esistono sia per NodeJS (Typeorm) o per Java (Hibernates).
