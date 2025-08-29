# MySql

Database relezionale gratuito

## Installazione

Si può installare tramite docker, sia col comando diretto che col docker-compose.

```shell
docker volume create personal-studies-mysql-data
docker run -d \
  --name mysql-8.4.5-lts \
  -p 3306:3306 \
  -v personal-studies-mysql-data:/var/lib/mysql \
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

### Creazione Database dedicato

Collegarsi alla shell di mysql come `root`: `docker exec -it mysql-8.4.5-lts mysql -u root -p`

Eseguire il comando per creare il tuo database:

```sql
-- CREATE DATABASE nome_database;
CREATE DATABASE personal_studies_prisma;
```

Eseguire il comando per creare un utente dedicato (si può usare anche root per accedere al db creato, ma è meglio avere un utente dedicato):

```sql
-- CREATE USER 'nome_user'@'%' IDENTIFIED BY 'password_sicura';
-- GRANT ALL PRIVILEGES ON nome_database.* TO 'nome_user'@'%';
-- FLUSH PRIVILEGES;
CREATE USER 'personal_studies_prisma_user'@'%' IDENTIFIED BY 'personal_studies_prisma_password';
GRANT ALL PRIVILEGES ON personal_studies_prisma.* TO 'personal_studies_prisma_user'@'%';
FLUSH PRIVILEGES;
```

NOTA: con Prisma è necessario l'account di root perchè utilizza delle istruzioni per creare uno shadow db temporaneo. L'alternativa e dare i permessi di creazione e distruzione db all'utente dedicato

## Funzionamento

Essendo un database relazionale, si possono usare varie librerie che gestiscono gli ORM nei vari linguaggi. Esistono sia per NodeJS (Typeorm o Prisma) o per Java (Hibernates).

## Progetto Prisma

- Installare prisma: `pnpm add prisma --save-dev`
- Installare prisma client e mysql: `pnpm add @prisma/client mysql2`
- Inizializzare il progetto (può anche essere fatto manualmente) per generare .env e schema.prisma: `pnpm prisma init` (spostare le risorse nella cartella voluta se non va bene root)
- Modificare lo schema aggiungendo il model in modo da autogenerare le classi
- Eseguire `pnpm prisma:generate`
  - genera le classi e il "PrismaClient" da importare a livello di codice, ma non fa nulla a database
- `pnpm prisma:migrate --name init`
  - applica le modifica secondo lo schema al database con le opportune istruzioni SQL. In name init è un nome descrittivo di questa "migrate" lanciata per tenere uno storico sul database
- COMANDO AGGIUNTIVO `pnpm prisma:studio`
  - lancia una interfaccia grafica per vedere e gestire tabelle

Il progetto è molto semplice e basilare, crea un paio di table e fa le operazioni CRUD minimali. Ci sono altre operazioni più avanzate, ma non vale la pena analizzarle se non è il tool che si usa regolarmente.
