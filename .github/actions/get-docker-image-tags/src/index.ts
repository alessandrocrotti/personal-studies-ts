import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as semver from "semver";

import { readFileSync } from "fs";

async function run(): Promise<void> {
  try {
    // Leggi gli input dichiarati in action.yml
    const versionFile: string = core.getInput("version-file", { required: true });
    const dockerImage: string = core.getInput("docker-image", { required: true });

    // Leggi il contenuto attuale del file di versione
    const currentVersion = getVersion(versionFile, readFileSync(versionFile, "utf8"));

    // Recupera la versione precedente da git (commit HEAD~1)
    let prevVersionRaw = "";
    await exec.exec("git", ["show", `HEAD~1:${versionFile}`], {
      listeners: {
        stdout: (data: Buffer) => {
          prevVersionRaw += data.toString();
        },
        // Messaggio di warning in caso di errore
        stderr: (data: Buffer) => {
          core.warning(`Error occurred retrieving previous versionm: ${data.toString()}`);
        },
      },
      // se il file non esisteva prima, evita errore fatale
      ignoreReturnCode: true,
      // Evita di stampare in stdout a console il risultato del comando
      silent: true,
    });
    const previousVersion = getVersion(versionFile, prevVersionRaw);

    // Genera i tag Docker
    const tags: string[] = [];

    // Log utile
    core.info(`Current version: ${currentVersion}`);
    core.info(`Previous version: ${previousVersion || "(nothing)"}`);

    if (semver.gt(currentVersion, previousVersion)) {
      core.info("The version is changed");

      // Full
      tags.push(`${dockerImage}:${currentVersion}`);

      // Minor
      const minor = currentVersion.split(".").slice(0, 2).join(".");
      if (minor) tags.push(`${dockerImage}:${minor}`);

      // Major
      const major = currentVersion.split(".").slice(0, 1).join(".");
      if (major) tags.push(`${dockerImage}:${major}`);

      // Latest per i commit su main
      if (process.env.GITHUB_REF_NAME === "main") {
        tags.push(`${dockerImage}:latest`);
      }

      core.info(`Tags: ${tags.join(", ")}`);

      // Imposta l'output
      core.setOutput("tags", tags.join(","));
    } else if (semver.eq(currentVersion, previousVersion)) {
      core.info("Same version");
    } else {
      core.error(`Version comparison error: ${currentVersion} is neither greater nor equal to ${previousVersion}`);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    core.setFailed(message);
  }
}

/**
 * Estrae la versione dal contenuto del file.
 * Se è un JSON (es. package.json), legge l'attributo "version".
 */
function getVersion(fileName: string, fileContent: string): string {
  // Trim fileContent and set empty string in case fileContent is not defined
  const fileContentTrimmed = (fileContent ?? "").trim();
  if (fileName.endsWith(".json")) {
    // package.json
    try {
      const jsonFile = JSON.parse(fileContentTrimmed) as { version?: string };
      return (jsonFile.version ?? "").trim();
    } catch {
      return "";
    }
  } else {
    // VERSION
    return fileContentTrimmed;
  }
}

run();
