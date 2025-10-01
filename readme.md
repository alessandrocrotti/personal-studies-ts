# Study Project in Typescript

Totally personal project with study purpose-only. This repo contains my notes, code, exercises and PoC of all technologies I've experimented.
All notes are in Italian just because they should be addressed to myself.

## Installation

Use `pnpm`

```Bash
pnpm install
```

## Execution

Running the following command, you can run the application for the file `/src/index.ts` with hot-reload on each saving.

```Bash
pnpm dev
```

In `package.json` there are many other scripts where you can run specific code.

## Test

You can run automatic test using `jest`.

```Bash
# Run all automatic test
pnpm test
# Run single test file. Important using "/" instead of "\"
pnpm test ./path/to/file.test.ts
```
