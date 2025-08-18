# GitHub Action

- [GitHub Action](#github-action)

## Descrizione

GitHub Action è un sistema che permette di eseguire dei workflow `yaml` definiti nella cartella `.github/workflows` del tuo repository che vengono eseguiti sulla base di certi eventi (on push di un commit per esempio).
L'esecuzione viene fatta su una macchina virtuale, chiamata runnner, solitamente fornita da GitHub, ma potrebbe essere anche Self-Hosted.

Lo scopo è quello di automatizzare processi legati al ciclo di vita del software (come versionamento, testing, deploy...), ma anche eseguire azioni su sistemi esterni con cui ci si può integrare.

ALcuni casi d'uso:

- CI/CD classico: Build, test e deploy automatico di un’app ogni volta che si fa push su main
- Release automation: Alla creazione di un tag vX.Y.Z, build e pubblicazione di pacchetti o immagini Docker
- Code quality: Linting, formattazione, analisi statica, scansioni di sicurezza
- Gestione repo: Auto‑labeling di issue/PR, assegnazione reviewer, chiusura ticket obsoleti
- Infra as Code: Deploy su AWS/Azure/GCP tramite Pulumi
- Operazioni programmate: Backup, sync di dati, generazione report giornalieri

## Struttura di un Workflow

- Evento:
  - condizioni che scatenano l'esecuzione del flusso, possono anche essere limitate (come on push, ma solamente se si modificano certe risorse
- Job:
  - è l'insieme di processi che si innescano, in maniera parallela se non ci sono particolari dipendenze.
  - ogni job viene eseguito su un runner, che viene definito e solitamente è una macchina virtuale linux
- Step:
  - sono le singole unità che vengono compiute, una dopo l'altra, nel job.
  - gli step possono produrre output ed utilizzare gli output degli step precedenti
  - si possono fare condizioni di esecuzione sulla base dei risultati degli step precedenti (solo se uno step specifico è completato con un successo eseguo il seguente step)
  - gli step si possono basare su delle action o delle istruzioni "run" come se fossi nella shell del runner
- Action:
  - Le action possono essere sviluppate e pubblicate da terze parti oppure internamente

### Esecuzione in locale

I workflow possono essere eseguiti anche localmente utilizzando Docker e installato `act-cli` anche tramite `choco`. Al primo avvio chiede che macchina virtuale utilizzare, vale la pena una macchina `medium`.

Comandi:

```shell
# act <event> -W <workflow-file-path> -j <job-name> -s MYSECRET=<SECRETVALUE>
act push -W .github/workflows/my-example-image-docker.yml
act push -j build-frontend
```

### Action

Le action sono la struttura più importante per comporre un Workflow. Sono importanti sia quelle di terze parti che quelle che sono implementate internamente per i nostri repo.

#### Custom Action

Per creare una action, si deve definire un `action.yaml` dove sono definiti gli input e gli output e l'esecuzione che viene fatta e come viene eseguita. Si possono creare diversi tipo di custom action:

- Javascript: comode, utilizzano node e possono essere fatte tramite TypeScript.
  - Che siano in JS o TS, devono essere compilate tramite il comando `ncc build src/index.ts --license licenses.txt` che genera un file unico con le dipendenze nella cartella `dist`. L'action quindi chiamerà `dist/index.js` senza bisogno di installare le dipendenze, ma questo richiede di escludere dal `.gitignore` tutte le cartelle `dist` delle action tramite l'istruzione `!.github/actions/**/dist`
- Docker: puoi utilizzare una immagine pubblicata o generare una immagine al volo di una tua applicazione che GitHub userà nell'action. Se vuoi generare una immagine, nella cartella della tua action devi avere il codice della tua action, eventualmente `entrypoint.ph` e il `Dockerfile` con le istruzioni per creare una immagine usando il tuo codice. A questo punto, GitHub genera il codice dell'action costruendo l'immagine ed utilizzandola nell'esecuzione
- Composite: combinano più step di workflow e si possono usare per eseguire anche dei file `.sh` dedicati.
  - IMPORTANTE: se usi dei file `.sh` dedicati devi dichiararli come eseguibili al momento del commit, altrimenti il runner non potrà utilizzarli correttamente, per farlo su windows

```shell
# In linux per rendere eseguibile un file
chmod +x your-script.sh
# In windows per rendere eseguibile un file
commit your-script.sh
git update-index --chmod=+x your-script.sh
git commit -m "Made file.ext executable"
git push
# Per verificare i file eseguibili
git ls-files --stage
```

Esempi:

```yaml
# Javascript
runs:
  using: "node20"
  main: "dist/index.js"

# Docker
runs:
  using: "docker"
  # Genera l'immagine senza doverla pubblicare
  image: "Dockerfile"
  # Prende una immagine pubblicata
  # image: "ghcr.io/tuo-utente/nome-immagine:tag"

# Composite
runs:
  using: composite
  steps:
    - name: K6 test result
      id: k6-test-result
      shell: bash
      run: ${{ github.action_path }}/k6-test-result.sh "${{ inputs.K8S_YAML_METADATA_NAME }}"
```
