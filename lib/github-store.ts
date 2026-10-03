import type { FillData, FillEntry } from "./types";

function env(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(
      `Missing required environment variable ${name}. Set it in your Vercel project settings (see .env.example).`
    );
  }
  return v;
}

function config() {
  return {
    token: env("GITHUB_TOKEN"),
    owner: env("GITHUB_OWNER"),
    repo: env("GITHUB_REPO"),
    branch: process.env.GITHUB_BRANCH || "main",
    path: process.env.GITHUB_DATA_PATH || "data/fill-data.json",
  };
}

function apiUrl(owner: string, repo: string, path: string) {
  return `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
}

function b64EncodeUtf8(str: string): string {
  return Buffer.from(str, "utf-8").toString("base64");
}

function b64DecodeUtf8(b64: string): string {
  return Buffer.from(b64, "base64").toString("utf-8");
}

type GhContentsResponse = {
  content: string;
  sha: string;
  encoding: string;
};

/**
 * Fetches the current data file from the repo.
 * Returns both the parsed data and the file's current sha (needed to write back safely).
 * If the file doesn't exist yet, returns an empty object with sha = null.
 */
async function fetchCurrent(): Promise<{ data: FillData; sha: string | null }> {
  const { token, owner, repo, branch, path } = config();

  const res = await fetch(`${apiUrl(owner, repo, path)}?ref=${encodeURIComponent(branch)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    // Always hit GitHub directly; never cache stale data between submissions.
    cache: "no-store",
  });

  if (res.status === 404) {
    return { data: {}, sha: null };
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GitHub read failed (${res.status}): ${body}`);
  }

  const json = (await res.json()) as GhContentsResponse;
  const text = b64DecodeUtf8(json.content.replace(/\n/g, ""));
  let data: FillData = {};
  try {
    data = text.trim() ? (JSON.parse(text) as FillData) : {};
  } catch {
    throw new Error("Data file in the repo is not valid JSON.");
  }
  return { data, sha: json.sha };
}

/** Reads the current fill data. Used by GET /api/data. */
export async function getFillData(): Promise<FillData> {
  const { data } = await fetchCurrent();
  return data;
}

/**
 * Merges one parish's entry into the data file and commits it back to GitHub.
 * Retries a few times on write conflicts (two people saving at the same moment).
 */
export async function saveEntry(parishId: string, entry: FillEntry): Promise<FillData> {
  const { token, owner, repo, branch, path } = config();
  const maxAttempts = 4;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const { data, sha } = await fetchCurrent();
    const updated: FillData = { ...data, [parishId]: entry };
    const content = b64EncodeUtf8(JSON.stringify(updated, null, 2));

    const res = await fetch(apiUrl(owner, repo, path), {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Update ${parishId} (${entry.filledBy || "anonymous"})`,
        content,
        branch,
        ...(sha ? { sha } : {}),
      }),
    });

    if (res.ok) {
      return updated;
    }

    // 409 = someone else wrote to the file since we fetched it. Retry with a fresh sha.
    if (res.status === 409 || res.status === 422) {
      if (attempt < maxAttempts) {
        await new Promise((r) => setTimeout(r, 250 * attempt));
        continue;
      }
    }

    const body = await res.text().catch(() => "");
    throw new Error(`GitHub write failed (${res.status}): ${body}`);
  }

  throw new Error("Could not save after multiple attempts — please try again.");
}
