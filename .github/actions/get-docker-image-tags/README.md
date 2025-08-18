# Get Docker image tags

Questa è una GitHub action custom di tipo JS con un piccolo progetto Node in TS per verificare se la versione dei un progetto è cambiata e generare i tag delle immagini docker da pubblicare.

## Build

La cartella `dist` deve essere committata per questa action, in quanto viene usato il compilato. Per questa ragione, dopo ogni modifica all'`index.ts` si deve eseguire il comando:

```shell
npm run build
```

## Test Locale

Per eseguire un test locale si deve utilizzare il seguente comando:

```shell
act push -W .github/workflows/my-example-image-docker.yml -s DOCKERHUB_USERNAME=[VALUE] -s DOCKERHUB_TOKEN=[VALUE]
```
