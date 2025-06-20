# Progetto di studio in Typescript

Progetto totalmente personale, utilizzato come appunti ed esecuzione di algoritmi basilari

## Installazione

Utilizza `pnpm`

```Bash
pnpm install
```

## Esecuzione

Lanciando il seguente comando, si avvia l'esecuzione dell'applicazione per il file `index.ts` e ad ogni salvataggio e modifica del file sorgente, l'applicazione viene rieseguita in tempo reale.

```Bash
pnpm dev
```

## Test

Se si vogliono eseguire dei test automatici, è installata la libreria `jest`

```Bash
# Esegui tutti i test automatici
pnpm test
# Esecuzione di un singolo test. Importante utilizzare "/" e non "\" perchè pnpm non lo interpreta correttamente
pnpm test ./path/to/file.test.ts
```
