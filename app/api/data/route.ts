import { NextRequest, NextResponse } from "next/server";
import { getFillData, saveEntry } from "@/lib/github-store";
import type { FillEntry } from "@/lib/types";
import { ARCHDEACONRIES } from "@/lib/parishes";

export const dynamic = "force-dynamic";

const VALID_PARISH_IDS = new Set(
  ARCHDEACONRIES.flatMap((a) => a.parishes.map((p) => p.id))
);

function isPerson(v: unknown): v is { name: string; phone: string } {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return typeof o.name === "string" && o.name.trim().length > 0 && typeof o.phone === "string" && o.phone.trim().length > 0;
}

function validateEntry(body: unknown): { parishId: string; entry: FillEntry } {
  if (!body || typeof body !== "object") throw new Error("Invalid request body.");
  const b = body as Record<string, unknown>;

  const parishId = b.parishId;
  if (typeof parishId !== "string" || !VALID_PARISH_IDS.has(parishId)) {
    throw new Error("Unknown parish id.");
  }

  const mode = b.mode;
  if (mode !== "officers" && mode !== "members") {
    throw new Error("mode must be 'officers' or 'members'.");
  }

  const filledBy = typeof b.filledBy === "string" ? b.filledBy.trim().slice(0, 200) : "";

  if (mode === "officers") {
    if (!isPerson(b.president) || !isPerson(b.secretary)) {
      throw new Error("President and Secretary each need a name and phone number.");
    }
    const entry: FillEntry = {
      mode: "officers",
      president: { name: (b.president as any).name.trim(), phone: (b.president as any).phone.trim() },
      secretary: { name: (b.secretary as any).name.trim(), phone: (b.secretary as any).phone.trim() },
      filledBy,
      updatedAt: new Date().toISOString(),
    };
    return { parishId, entry };
  }

  const members = b.members;
  if (!Array.isArray(members) || members.length !== 2 || !isPerson(members[0]) || !isPerson(members[1])) {
    throw new Error("Provide exactly 2 members, each with a name and phone number.");
  }
  const entry: FillEntry = {
    mode: "members",
    members: [
      { name: members[0].name.trim(), phone: members[0].phone.trim() },
      { name: members[1].name.trim(), phone: members[1].phone.trim() },
    ],
    filledBy,
    updatedAt: new Date().toISOString(),
  };
  return { parishId, entry };
}

export async function GET() {
  try {
    const data = await getFillData();
    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message || "Failed to load data." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let parishId: string;
  let entry: FillEntry;
  try {
    const body = await req.json();
    ({ parishId, entry } = validateEntry(body));
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Invalid request." }, { status: 400 });
  }

  try {
    const data = await saveEntry(parishId, entry);
    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Failed to save." }, { status: 500 });
  }
}
