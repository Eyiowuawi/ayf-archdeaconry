"use client";

import jsQR from "jsqr";
import { Camera, CameraOff } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { checkInTicket, type CheckInState } from "@/lib/actions/admin";
import { Button } from "@/design-system/Button";
import { Input } from "@/design-system/Input";
import { Label } from "@/design-system/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/design-system/Select";
import { cn } from "@/lib/cn";
import { formatTicketCode, parseTicketCode } from "@/lib/identifiers";

type Result = Exclude<CheckInState, { status: "idle" }>;

const TONE: Record<Result["status"], string> = {
  ok: "border-success-line bg-success-soft text-success",
  already: "border-sun/60 bg-sun/15 text-ink",
  "other-event": "border-danger-line bg-danger-soft text-danger",
  error: "border-danger-line bg-danger-soft text-danger",
};

function heading(r: Result): string {
  if (r.status === "ok") return "Checked in";
  if (r.status === "already") return "Already checked in";
  if (r.status === "other-event") return "Ticket is for another event";
  return "Not a valid ticket";
}

/**
 * Scans ticket QR codes with the device camera (or takes a typed code) and checks the holder in
 * for the chosen event. Each code is only processed once every few seconds, so holding a ticket
 * in front of the camera doesn't fire repeatedly.
 */
export function CheckInScanner({ events, initialEvent }: { events: { slug: string; label: string }[]; initialEvent: string }) {
  const [eventSlug, setEventSlug] = useState(initialEvent);
  const [result, setResult] = useState<Result | null>(null);
  const [history, setHistory] = useState<Result[]>([]);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [manual, setManual] = useState("");
  const [busy, setBusy] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recent = useRef(new Map<string, number>());
  const eventRef = useRef(eventSlug);
  eventRef.current = eventSlug;

  const submit = useCallback(async (raw: string) => {
    const code = parseTicketCode(raw);
    const key = code ?? raw;
    const now = Date.now();
    if ((recent.current.get(key) ?? 0) > now - 4000) return;
    recent.current.set(key, now);
    setBusy(true);
    const res = await checkInTicket(eventRef.current, raw).catch(() => ({ status: "error", message: "Couldn't reach the server. Try again." }) as const);
    setBusy(false);
    if (res.status === "idle") return;
    setResult(res);
    if (res.status !== "error") setHistory((h) => [res, ...h.filter((x) => x.status === "error" || x.code !== res.code)].slice(0, 8));
    if (res.status === "ok") navigator.vibrate?.(120);
    else navigator.vibrate?.([80, 60, 80]);
  }, []);

  useEffect(() => {
    if (!cameraOn) return;
    let stream: MediaStream | null = null;
    let frame = 0;
    let stopped = false;
    const video = videoRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

    function tick() {
      if (stopped) return;
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        const scale = Math.min(1, 640 / video.videoWidth);
        canvas.width = Math.round(video.videoWidth * scale);
        canvas.height = Math.round(video.videoHeight * scale);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const found = jsQR(img.data, img.width, img.height, { inversionAttempts: "dontInvert" });
        if (found?.data) void submit(found.data);
      }
      frame = requestAnimationFrame(tick);
    }

    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then((s) => {
        if (stopped) return s.getTracks().forEach((t) => t.stop());
        stream = s;
        video.srcObject = s;
        void video.play();
        frame = requestAnimationFrame(tick);
      })
      .catch(() => {
        setCameraError("The camera couldn't start. Allow camera access in your browser, or type the ticket code below.");
        setCameraOn(false);
      });
    if (!navigator.mediaDevices) {
      setCameraError("This browser can't use the camera here. Type the ticket code below.");
      setCameraOn(false);
    }

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [cameraOn, submit]);

  function onManual(e: FormEvent) {
    e.preventDefault();
    if (!manual.trim()) return;
    recent.current.delete(parseTicketCode(manual) ?? manual);
    void submit(manual).then(() => setManual(""));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,26rem)_1fr]">
      <div className="space-y-4">
        <div>
          <Label htmlFor="checkin-event">Event</Label>
          <Select value={eventSlug} onValueChange={(v) => { setEventSlug(v); setResult(null); }}>
            <SelectTrigger id="checkin-event"><SelectValue /></SelectTrigger>
            <SelectContent>
              {events.map((e) => <SelectItem key={e.slug} value={e.slug}>{e.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-hidden rounded-card border border-line bg-night shadow-card">
          <div className="relative aspect-square">
            <video ref={videoRef} muted playsInline className={cn("size-full object-cover", !cameraOn && "hidden")} />
            {cameraOn ? (
              <div aria-hidden="true" className="pointer-events-none absolute inset-[18%] rounded-2xl border-4 border-sun/80" />
            ) : (
              <div className="absolute inset-0 grid place-items-center p-6 text-center text-night-ink">
                <div>
                  <Camera className="mx-auto mb-3 size-10 text-sun" aria-hidden="true" />
                  <p className="text-sm">Point the camera at the QR code on a ticket.</p>
                </div>
              </div>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
        <Button type="button" className="w-full" variant={cameraOn ? "secondary" : "primary"} onClick={() => { setCameraError(""); setCameraOn((on) => !on); }}>
          {cameraOn ? <><CameraOff aria-hidden="true" /> Stop camera</> : <><Camera aria-hidden="true" /> Start camera</>}
        </Button>
        {cameraError && <p role="alert" className="text-sm text-danger">{cameraError}</p>}

        <form onSubmit={onManual}>
          <Label htmlFor="checkin-code">Or type the ticket code</Label>
          <div className="flex gap-2">
            <Input id="checkin-code" value={manual} onChange={(e) => setManual(e.target.value)} placeholder="XXXX-XXXX-XXXX" autoCapitalize="characters" className="font-mono" />
            <Button type="submit" disabled={busy || !manual.trim()} className="shrink-0">Check in</Button>
          </div>
        </form>
      </div>

      <div aria-live="polite">
        {result ? (
          <div className={cn("rounded-card border-2 p-6", TONE[result.status])}>
            <p className="font-display text-sm font-bold uppercase tracking-widest">{heading(result)}</p>
            {result.status === "error" ? (
              <p className="mt-2 text-lg">{result.message}</p>
            ) : (
              <>
                <p className="mt-2 font-display text-3xl font-extrabold text-ink">{result.name}</p>
                <p className="text-ink-muted">{result.detail}</p>
                <p className="mt-3 text-sm text-ink">
                  {result.status === "other-event" ? `This ticket is for ${result.eventTitle}.` : result.eventTitle}
                  {result.status === "already" && result.at && ` · first scanned ${new Date(result.at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Lagos" })}`}
                </p>
                <p className="mt-1 font-mono text-xs text-ink-muted">{formatTicketCode(result.code)}</p>
              </>
            )}
          </div>
        ) : (
          <p className="rounded-card border border-dashed border-line p-8 text-center text-ink-muted">Scan a ticket to see who it belongs to.</p>
        )}

        {history.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-2 font-display text-lg font-extrabold">Recent</h2>
            <ul className="divide-y divide-line rounded-card border border-line bg-surface">
              {history.map((h, i) =>
                h.status === "error" ? null : (
                  <li key={`${h.code}-${i}`} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                    <span className="font-bold">{h.name}</span>
                    <span className="text-ink-muted">{heading(h)}</span>
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
