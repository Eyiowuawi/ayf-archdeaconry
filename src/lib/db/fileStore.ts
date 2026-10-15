import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { dataStore, upgrade, type Data } from "@/lib/db/dataStore";
import { DEVOTIONALS } from "@/mocks/devotionals";
import { demoEvents } from "@/mocks/demo";

// A JSON file on disk, for trying the admin area locally. Not for the live site:
// Vercel's file system is read-only and resets, and the file is not private enough for member data.

const FILE = path.join(/* turbopackIgnore: true */ process.cwd(), process.env.CMS_LOCAL_FILE || ".data/cms.json");

function seed(): Data {
  const now = new Date().toISOString();
  return upgrade({
    events: demoEvents().map((e) => ({ ...e, updatedAt: now })),
    devotionals: DEVOTIONALS.map((d) => ({ ...d, published: true, updatedAt: now })),
  });
}

async function load(): Promise<Data> {
  try {
    return upgrade(JSON.parse(await readFile(FILE, "utf8")) as Partial<Data>);
  } catch {
    return seed();
  }
}

// Serialise writes so two quick saves don't overwrite each other.
let queue: Promise<unknown> = Promise.resolve();
function update(fn: (d: Data) => void): Promise<void> {
  const run = queue.then(async () => {
    const d = await load();
    fn(d);
    await mkdir(path.dirname(FILE), { recursive: true });
    const tmp = `${FILE}.tmp`;
    await writeFile(tmp, JSON.stringify(d, null, 2));
    await rename(tmp, FILE);
  });
  queue = run.catch(() => {});
  return run;
}

export const fileStore = dataStore({ label: "Local test data", read: load, write: update });
