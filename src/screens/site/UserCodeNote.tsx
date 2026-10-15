/** Shows a member their user code, the key to registering for events without retyping their details. */
export function UserCodeNote({ code }: { code: string }) {
  return (
    <div className="my-4 rounded-2xl border border-primary/30 bg-surface-muted px-4 py-3">
      <p className="text-sm font-bold text-ink-muted">Your user code</p>
      <p className="font-display text-2xl font-extrabold tracking-wider text-primary">{code}</p>
      <p className="mt-1 text-sm text-ink-muted">
        Keep it safe. Use it (or your phone number) to register for events without filling this form again.
      </p>
    </div>
  );
}
