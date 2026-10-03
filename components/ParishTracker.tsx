"use client";

import { useMemo, useState } from "react";
import type { Archdeaconry } from "@/lib/parishes";
import type { FillData, FillEntry } from "@/lib/types";

type Props = {
  archdeaconries: Archdeaconry[];
  initialData: FillData;
  initialError: string | null;
};

function isFilled(entry: FillEntry | undefined): boolean {
  if (!entry) return false;
  if (entry.mode === "members") return !!entry.members?.[0]?.name;
  return !!entry.president?.name;
}

function fmtDate(iso?: string): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return "";
  }
}

export default function ParishTracker({ archdeaconries, initialData, initialError }: Props) {
  const [data, setData] = useState<FillData>(initialData);
  const [loadError, setLoadError] = useState<string | null>(initialError);
  const [query, setQuery] = useState("");
  const [openArch, setOpenArch] = useState<Record<number, boolean>>({});
  const [openFormId, setOpenFormId] = useState<string | null>(null);
  const [mode, setMode] = useState<"officers" | "members">("officers");
  const [presName, setPresName] = useState("");
  const [presPhone, setPresPhone] = useState("");
  const [secName, setSecName] = useState("");
  const [secPhone, setSecPhone] = useState("");
  const [mem0Name, setMem0Name] = useState("");
  const [mem0Phone, setMem0Phone] = useState("");
  const [mem1Name, setMem1Name] = useState("");
  const [mem1Phone, setMem1Phone] = useState("");
  const [filledBy, setFilledBy] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const totals = useMemo(() => {
    let total = 0, filled = 0;
    for (const a of archdeaconries) {
      for (const p of a.parishes) {
        total++;
        if (isFilled(data[p.id])) filled++;
      }
    }
    return { total, filled };
  }, [archdeaconries, data]);

  function archIndexForParish(parishId: string): number {
    return archdeaconries.findIndex((a) => a.parishes.some((p) => p.id === parishId));
  }

  function openForm(parishId: string) {
    if (openFormId === parishId) {
      setOpenFormId(null);
      return;
    }
    const existing = data[parishId];
    setMode(existing?.mode === "members" ? "members" : "officers");
    setPresName(existing?.president?.name || "");
    setPresPhone(existing?.president?.phone || "");
    setSecName(existing?.secretary?.name || "");
    setSecPhone(existing?.secretary?.phone || "");
    setMem0Name(existing?.members?.[0]?.name || "");
    setMem0Phone(existing?.members?.[0]?.phone || "");
    setMem1Name(existing?.members?.[1]?.name || "");
    setMem1Phone(existing?.members?.[1]?.phone || "");
    setFilledBy(existing?.filledBy || "");
    setFormError(null);
    setOpenFormId(parishId);
    const ai = archIndexForParish(parishId);
    if (ai >= 0) setOpenArch((prev) => ({ ...prev, [ai]: true }));
  }

  function cancelForm() {
    setOpenFormId(null);
    setFormError(null);
  }

  async function saveForm(parishId: string) {
    setFormError(null);

    let body: any = { parishId, mode, filledBy };
    if (mode === "officers") {
      if (!presName.trim() || !presPhone.trim() || !secName.trim() || !secPhone.trim()) {
        setFormError("Please add the President and Secretary\u2019s names and phone numbers.");
        return;
      }
      body.president = { name: presName.trim(), phone: presPhone.trim() };
      body.secretary = { name: secName.trim(), phone: secPhone.trim() };
    } else {
      if (!mem0Name.trim() || !mem0Phone.trim() || !mem1Name.trim() || !mem1Phone.trim()) {
        setFormError("Please add both members\u2019 names and phone numbers.");
        return;
      }
      body.members = [
        { name: mem0Name.trim(), phone: mem0Phone.trim() },
        { name: mem1Name.trim(), phone: mem1Phone.trim() },
      ];
    }

    setSaving(true);
    try {
      const res = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Could not save just now. Please try again.");
      }
      setData(json.data);
      setOpenFormId(null);
    } catch (err: any) {
      setFormError(err.message || "Could not save just now. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const q = query.trim().toLowerCase();

  return (
    <div className="wrap">
      <header className="top">
        <h1>Parish Representatives</h1>
        <p className="subtitle">Diocese of Egba — by archdeaconry and parish</p>
        <div className="note">
          <b>For each parish:</b> add the President and Secretary (name + phone). If a parish
          has no formal President/Secretary, add at least two members known to be actively
          taking ownership there instead. Please check the parish first — if it already shows
          filled details, there&rsquo;s no need to add another entry.
        </div>
        {loadError && (
          <div className="errorbanner">
            Could not load the current list ({loadError}). Try refreshing the page.
          </div>
        )}
        <div className="progressrow">
          <div className="progressbar">
            <span style={{ width: totals.total ? `${Math.round((totals.filled / totals.total) * 100)}%` : "0%" }} />
          </div>
          <div className="progresslabel">{totals.filled} / {totals.total} filled</div>
        </div>
        <div className="searchrow">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search parish or archdeaconry…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
        </div>
      </header>

      <main>
        {archdeaconries.map((arch, ai) => {
          const rows = arch.parishes.filter(
            (p) => !q || arch.name.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)
          );
          if (rows.length === 0) return null;
          const archFilled = arch.parishes.filter((p) => isFilled(data[p.id])).length;
          const isOpen = !!openArch[ai] || (!!q && rows.length > 0);

          return (
            <details
              key={arch.name}
              className="arch"
              open={isOpen}
              onToggle={(e) => {
                const open = (e.target as HTMLDetailsElement).open;
                setOpenArch((prev) => ({ ...prev, [ai]: open }));
              }}
            >
              <summary className="archhead">
                <span className="chev" />
                <span className="archname">{arch.name}</span>
                <span className="archcount">{archFilled}/{arch.parishes.length}</span>
              </summary>
              <div className="parishlist">
                {rows.map((parish) => {
                  const entry = data[parish.id];
                  const filled = isFilled(entry);
                  const formOpen = openFormId === parish.id;

                  return (
                    <div className="parish" key={parish.id}>
                      <div className="parishname">{parish.name}</div>
                      <div className="statusrow">
                        <span className={`badge ${filled ? "filled" : "empty"}`}>
                          {filled ? "Filled" : "Not yet filled"}
                        </span>
                        <button
                          type="button"
                          className={filled ? "linklike" : "smallbtn"}
                          onClick={() => openForm(parish.id)}
                        >
                          {filled ? "Edit" : "Add"}
                        </button>
                      </div>

                      {filled && entry && (
                        <div className="filledinfo">
                          {entry.mode === "members" ? (
                            <>
                              <span className="rolelabel">Members:</span>{" "}
                              {entry.members?.map((m, i) => (
                                <span key={i}>
                                  {m.name}{m.phone ? ` (${m.phone})` : ""}{i === 0 ? ", " : ""}
                                </span>
                              ))}
                            </>
                          ) : (
                            <>
                              <span className="rolelabel">President:</span> {entry.president?.name}
                              {entry.president?.phone ? ` (${entry.president.phone})` : ""}
                              <br />
                              <span className="rolelabel">Secretary:</span> {entry.secretary?.name}
                              {entry.secretary?.phone ? ` (${entry.secretary.phone})` : ""}
                            </>
                          )}
                          {(entry.filledBy || entry.updatedAt) && (
                            <span className="meta">
                              {entry.filledBy ? `Reported by ${entry.filledBy}` : ""}
                              {entry.filledBy && entry.updatedAt ? " · " : ""}
                              {fmtDate(entry.updatedAt)}
                            </span>
                          )}
                        </div>
                      )}

                      {formOpen && (
                        <div className="form">
                          <div className="modeswitch">
                            <button
                              type="button"
                              className={mode === "officers" ? "active" : ""}
                              onClick={() => setMode("officers")}
                            >
                              President &amp; Secretary
                            </button>
                            <button
                              type="button"
                              className={mode === "members" ? "active" : ""}
                              onClick={() => setMode("members")}
                            >
                              No officers — 2 members
                            </button>
                          </div>

                          {mode === "officers" ? (
                            <>
                              <div className="fieldgrp">
                                <span className="lbl">President</span>
                                <div className="pairrow">
                                  <div>
                                    <input className="txt" placeholder="Full name" value={presName} onChange={(e) => setPresName(e.target.value)} />
                                  </div>
                                  <div>
                                    <input className="txt" type="tel" placeholder="Phone number" value={presPhone} onChange={(e) => setPresPhone(e.target.value)} />
                                  </div>
                                </div>
                              </div>
                              <div className="fieldgrp">
                                <span className="lbl">Secretary</span>
                                <div className="pairrow">
                                  <div>
                                    <input className="txt" placeholder="Full name" value={secName} onChange={(e) => setSecName(e.target.value)} />
                                  </div>
                                  <div>
                                    <input className="txt" type="tel" placeholder="Phone number" value={secPhone} onChange={(e) => setSecPhone(e.target.value)} />
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="fieldgrp">
                                <span className="lbl">Member 1</span>
                                <div className="pairrow">
                                  <div>
                                    <input className="txt" placeholder="Full name" value={mem0Name} onChange={(e) => setMem0Name(e.target.value)} />
                                  </div>
                                  <div>
                                    <input className="txt" type="tel" placeholder="Phone number" value={mem0Phone} onChange={(e) => setMem0Phone(e.target.value)} />
                                  </div>
                                </div>
                              </div>
                              <div className="fieldgrp">
                                <span className="lbl">Member 2</span>
                                <div className="pairrow">
                                  <div>
                                    <input className="txt" placeholder="Full name" value={mem1Name} onChange={(e) => setMem1Name(e.target.value)} />
                                  </div>
                                  <div>
                                    <input className="txt" type="tel" placeholder="Phone number" value={mem1Phone} onChange={(e) => setMem1Phone(e.target.value)} />
                                  </div>
                                </div>
                              </div>
                            </>
                          )}

                          <div className="fieldgrp">
                            <span className="lbl">Your name (optional, for follow-up)</span>
                            <input className="txt" value={filledBy} onChange={(e) => setFilledBy(e.target.value)} />
                          </div>

                          <div className="formactions">
                            <button type="button" className="savebtn" disabled={saving} onClick={() => saveForm(parish.id)}>
                              {saving ? "Saving…" : "Save"}
                            </button>
                            <button type="button" className="cancelbtn" onClick={cancelForm}>
                              Cancel
                            </button>
                          </div>
                          {formError && <div className="formerr">{formError}</div>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </details>
          );
        })}
      </main>
    </div>
  );
}
